import React from 'react';
import withAuthorization from './withAuthorization';

const RankingPage = () =>
  <div>
    <h1>Rankings</h1>
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(RankingPage);
