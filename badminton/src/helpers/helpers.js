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

const convertUnixTime = (time) => {
  let date = new Date(Number(time));
  return date.toString();
}

const arrayEqual = (arr1, arr2) => {
  if(arr1 === arr2){
    return true;
  }if(arr1 === null || arr2 === null){
    return false;
  }if(arr1.length !== arr2.length){
    return false;
  }
  for(let i = 0; i<arr1.length; i++){
    if(arr1[i] !== arr2[i]){
      return false;
    }
  }return true;
}

export {
  byPropKey,
  adminCheck,
  convertUnixTime,
  arrayEqual,
}
