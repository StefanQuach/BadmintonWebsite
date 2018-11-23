import { db } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const adminCheck = async (authUser) => {
  if(! !!authUser){
    return false;
  }
  var uid = authUser.uid;
  return await db.userIsAdmin(uid);
}

export {
  byPropKey,
  adminCheck,
}
