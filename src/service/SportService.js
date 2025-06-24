export const getSportTabOptions = (sports, topOptions = []) => {
  const newSportsList = [...sports];
  newSportsList.unshift(...topOptions);
  return newSportsList;
};
