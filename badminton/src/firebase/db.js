import { db } from './firebase';

export const doCreateUser = (id, username, email, admin) =>
  onceGetUsers()
    .then(snapshot => {
      console.log(snapshot.numChildren());
      let rank = snapshot.numChildren() + 1
      db.ref(`users/${id}`).set({
          username,
          email,
          admin,
          rank,
      });
    })

export const onceGetUsers = () =>
  db.ref(`users`).once('value');

export const userIsAdmin = (uid) => {
  return new Promise(function(resolve, reject){
    try{
      db.ref(`users/${uid}/admin`).once('value', (snapshot) => {
        resolve(snapshot.val());
      });
    }catch(e){
      reject(Error(e));
    }
  })
}
