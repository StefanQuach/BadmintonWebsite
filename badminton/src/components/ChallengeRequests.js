import React, { Component } from 'react';

import withAuthorization from './withAuthorization';
import { firebase, db } from '../firebase';
import { db as database } from '../firebase/firebase';
import { adminCheck, byPropKey, arrayEqual } from '../helpers/helpers';
import Alert from './Alert';

var Button = require("react-bootstrap/lib/Button");

class ChallengeRequestPage extends Component{
  _isMounted = false
  constructor(props){
    super(props);
    this.state = {
      requests: null,
    };
  }

  componentDidMount(){
    this._isMounted = true;
    database.ref(`pending-challenge-requests`).on('value', (snapshot) => {
      if(this._isMounted) {
        this.setState(byPropKey('requests', snapshot.val()));
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render(){
    const requests = this.state.requests;
    var dispRequests = [];
    if(!!requests){
      for(var key in requests){
        dispRequests.push(<ChallengeRequest
          key={key}
          cKey={requests[key].challenger}
          oKey={requests[key].opponent}
          requestKey={key}
        />);
      }
    }
    return(
      <div>
        <h1>Challenge Requests</h1>
        <div id="challenge-request-list">{dispRequests}</div>
      </div>
    );
  }
}

class ChallengeRequest extends Component{
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {...props};
    this.state.challenger = null;
    this.state.opponent = null;
    this.state.challengerReport = null;
    this.state.opponentReport = null;
  }

  componentDidMount(){
    this._isMounted = true;
    this.getUserInfo(this.state.cKey, 'challenger');
    this.getUserInfo(this.state.oKey, 'opponent');
    this.getGamesReport('challenger');
    this.getGamesReport('opponent');
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  getUserInfo(uid, stateKey){
    database.ref(`users/${uid}`).once('value', (snapshot) => {
      if(this._isMounted) {
        this.setState(byPropKey(stateKey, snapshot.val()));
      }
    });
  }

  getGamesReport(role){
    database.ref(`pending-challenge-requests/${this.state.requestKey}/${role}-report`).on('value', (snapshot) => {
      if(this._isMounted) {
        this.setState(byPropKey(role + "Report", snapshot.val()));
      }
    });
  }

  resolve(){
    const scores = this.state.challengerReport.gameScores;
    const challengerWon = challengerWins(scores) > opponentWins(scores);
    if((this.state.challenger.rank > this.state.opponent.rank && challengerWon)
      || (this.state.opponent.rank > this.state.challenger.rank && !challengerWon)){
      this.swap();
    }
    database.ref(`pending-challenge-requests/${this.state.requestKey}`).once('value', (snapshot) => {
      const key = snapshot.key;
      let newObj = {};
      newObj[key] = snapshot.val();
      database.ref(`archive-challenge-requests`).push(newObj);
      database.ref(`pending-challenge-requests/${this.state.requestKey}`).remove();
    });
  }

  /**
   * Swaps the challenger's and opponent's ranks.
   * @return {null}
   */
  swap(){
    const cRank = this.state.challenger.rank;
    const oRank = this.state.opponent.rank;
    database.ref(`users/${this.state.cKey}`).update({
      rank: oRank,
    });
    database.ref(`users/${this.state.oKey}`).update({
      rank: cRank,
    });
  }

  dismiss(){
    const passphrase = 'dismiss'
    const confirm = prompt('You are about to dismiss this challenge request. Type "' + passphrase + '" if you\'re sure');
    if(confirm === passphrase){
      database.ref(`pending-challenge-requests/${this.state.requestKey}`).remove();
    }
  }

  render(){
    const challengerReport = this.state.challengerReport;
    const opponentReport = this.state.opponentReport;
    var valid = false;
    if(!!challengerReport && !!opponentReport){
      valid = arrayEqual(challengerReport.gameScores, opponentReport.gameScores);
    }
    return(
      <div className="challenge-request">
        <div className="cr-info">
          <div className="cr-details">
            <div className="cr-challenger cr-participant">
              {this.state.challenger && this.state.challenger.username}
            </div>
            <div className="cr-text">
              CHALLENGES
            </div>
            <div className="cr-opponent cr-participant">
              {this.state.opponent && this.state.opponent.username}
            </div>
          </div>
          <div className="cr-match-reports">
            {!!challengerReport && <MatchReport scores={challengerReport.gameScores}/>}
            {!!opponentReport && <MatchReport scores={opponentReport.gameScores}/>}
          </div>
        </div>
        <div className="cr-control">
          <div className="cr-ctrl-action">
            {valid && <Button className="cr-resolve cr-button" onClick={() => {this.resolve()}}>Resolve</Button>}
          </div>
          <div className="cr-ctrl-action">
            {!valid && <Button className="cr-dismiss cr-button" onClick={() => {this.dismiss()}}>Dismiss</Button>}
          </div>
        </div>
      </div>
    );
  }
}

const MatchReport = ({ scores }) => {
  let games = [];
  for(let i = 0; i<scores.length/2; i++){
    games.push(<GameReport cScore={scores[2*i]} oScore={scores[2*i+1]} gameNum={i+1} key={i}/>);
  }
  return(
    <div className="cr-match-report">
      {games.map((game) => game)}
    </div>
  );
}

const GameReport = ({ cScore, oScore, gameNum }) =>
  <div className="cr-game-report">
    <div className="cr-game-report-title">Game {gameNum}</div>
    <div className="cr-game-report-scores">
      <div className="cr-game-report-challenger cr-game-report-participant">Challenger: {cScore}</div>
      <div className="cr-game-report-opponent cr-game-report-participant">Opponent: {oScore}</div>
    </div>
  </div>

const HomeChallengeRequestList = ({ userChallengeRequestList, type }) =>
  <div>
    {userChallengeRequestList.map((ucr) =>
      <HomeChallengeRequest userChallengeRequest={ucr} key={ucr.key} type={type}/>
    )}
  </div>

class HomeChallengeRequest extends Component{
  _isMounted = false;
  constructor(props){
    super(props);
    this.type = props.type;
    this.key = props.userChallengeRequest.key;
    this.state = {
      // Ordered list of game scores, game 1: challenger, opponent; game2: ...
      gameScores: ['', '', '', '', '', ''],
      alert: null,
      isOwner: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount(){
    this._isMounted = true;
    database.ref(`pending-challenge-requests/${this.key}`).once('value', (snapshot) => {
      if(this._isMounted && (firebase.auth.currentUser.uid === snapshot.val().challenger)) {
        this.setState({isOwner: true});
      }
    });

    database.ref(`pending-challenge-requests/${this.key}/${this.type}-report/gameScores`).on('value', (snapshot) => {
      const gameScores = snapshot.val();
      if(!!gameScores && this._isMounted){
        this.setState({gameScores: gameScores});
      }
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleChange(evt, ind){
    var gameScores = this.state.gameScores;
    if(evt.target.value === ''){
      gameScores[ind] = '';
    }else{
      try{
        const score = parseInt(evt.target.value);
        if(isNaN(score)){
          gameScores[ind] = '';
        }else{
          gameScores[ind] = score;
        }
      }catch(e){
        gameScores[ind] = '';
      }
    }
    this.setState({gameScores: gameScores});
  }

  onSubmit(evt){
    evt.preventDefault();
    if(this.checkScores()){
      database.ref(`pending-challenge-requests/${this.key}/${this.type}-report`).set({
        gameScores: this.state.gameScores,
      });
      this.setState({alert: <Alert text={'Nice submission'} color='#00ff00'/>});
      setTimeout(() => {this.setState({alert: null})}, 2000);
    }else{
      this.setState({alert: <Alert text={'That match is invalid'} color={'#ff0000'}/>});
      setTimeout(() => {this.setState({alert: null})}, 2000);
    }
  }

  onDelete(evt) {
    evt.preventDefault();
    database.ref(`pending-challenge-requests/${this.key}`).remove(function(error) {
      if(error) {
        console.log("Deleting challenge request error");
      } else {
        console.log("Challenge request successfully delete");
      }
    });
  }

  /**
   * Checks the scores (this.state.gameScores) to determine if they are
   * legitimate by checking if each game is legitimate.
   * @return {boolean}      Are the game scores legitimate?
   */
  checkScores(){
    const scores = this.state.gameScores;
    return (
      ((this.checkGame(scores[0], scores[1])
      && this.checkGame(scores[2], scores[3])
      && this.checkGame(scores[4], scores[5])) ||

      (this.checkGame(scores[0], scores[1])
      && this.checkGame(scores[2], scores[3])
      && scores[4] === "" && scores[5] === ""))

      &&

      (challengerWins(scores) === 2 || opponentWins(scores) === 2)
    );
  }

  /**
   * Determines if game scores are valid (one person has 21 and is at least 2 ahead
   * or both are greater than or equal to 21 with a 2 point difference).
   * @param  {int} score1 One score
   * @param  {int} score2 The other score
   * @return {boolean}        Whether the game is valid.
   */
  checkGame(score1, score2){
    if(isNaN(parseInt(score1)) || isNaN(parseInt(score2))){
      return false;
    }
    if(score1 > 21 || score2 > 21){
      return(Math.abs(score1-score2) === 2);
    }else if(score1 === 21){
      return(score1 - score2 >= 2);
    }else if(score2 === 21){
      return(score2 - score1 >= 2);
    }
    return false;
  }

  render(){
    var scores = this.state.gameScores;
    const {
      userChallengeRequest,
    } = this.props;
    var gameInputs = <div className="cr-match">
      <ChallengeRequestGame scores={scores} onChange={this.handleChange} gameNum={1} type={this.type}/>
      <ChallengeRequestGame scores={scores} onChange={this.handleChange} gameNum={2} type={this.type}/>
      <ChallengeRequestGame scores={scores} onChange={this.handleChange} gameNum={3} type={this.type}/>
    </div>;
    return(
      <div key={this.key} className="home-challenge-request">
        {
          this.type === 'challenger'
          ? <h3>You challenged: {userChallengeRequest.username}</h3>
          : <h3>{userChallengeRequest.username} challenged you</h3>
        }
        <form>
          {gameInputs}
          <div className="home-cr-match-submit">
            <Button className="home-cr-match-cancel" disabled={!this.state.isOwner} onClick={event=>this.onDelete(event)}>Cancel</Button>
            <Button className="home-cr-match-submit-button" type="submit" onClick={this.onSubmit}>Submit Scores</Button>
          </div>
        </form>
        {this.state.alert}
      </div>
    );
  }
}

/**
 * Computes number of times the challenger won.
 * @return {int} Number of times the challenger won
 */
function challengerWins(scores){
  return(+(scores[0] > scores[1]) + +(scores[2] > scores[3]) + +(scores[4] > scores[5]));
}

/**
 * Computes number of times the opponent won.
 * @return {int} Number of times the opponent won
 */
function opponentWins(scores){
  return(+(scores[0] < scores[1]) + +(scores[2] < scores[3]) + +(scores[4] < scores[5]));
}

const ChallengeRequestGame = ({ scores, onChange, gameNum, type }) =>{
  const base = (gameNum-1) * 2;
  const next = base + 1;
  return(
    <div className="cr-game-group">
      <div className="cr-game-title"><h4>Game {gameNum}</h4></div>
      <div className="cr-game-section">
        <div className="cr-game">
          <div className="cr-game-score-label-container-challenger">
            <label className="cr-game-score-label" htmlFor={"cr-game-score-input" + base}>
              {type === 'challenger' ? 'You:' : 'Challenger:'}
            </label>
          </div>
          <div className="cr-game-score-input-container-challenger"><input
            id={"cr-game-score-input" + base}
            className="home-game-input"
            value={scores[base]}
            onChange={evt => {onChange(evt, base)}}
          /></div>
        </div>
        <div className="cr-game">
          <div className="cr-game-score-label-container-opponent">
            <label className="cr-game-score-label" htmlFor={"cr-game-score-input" + next}>
              {type === 'opponent' ? 'You:' : 'Opponent:'}
            </label>
          </div>
          <div className="cr-game-score-input-container-opponent"><input
            id={"cr-game-score-input" + next}
            className="home-game-input"
            value={scores[next]}
            onChange={evt => {onChange(evt, next)}}
          /></div>
        </div>
      </div>
    </div>
  );
}

const authCondition = adminCheck;

export default withAuthorization(authCondition)(ChallengeRequestPage);

export {
  HomeChallengeRequestList,
};
