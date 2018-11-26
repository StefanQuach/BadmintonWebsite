const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const convertUnixTime = (time) => {
  let date = new Date(Number(time));
  return date.toString();
}

export {
  byPropKey,
  convertUnixTime,
}
