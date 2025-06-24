export const isUnlockedPick = (isAdminUser, isValidAuthorizationToken, unlockedPicks, pick) => {
  return (
    isValidAuthorizationToken &&
    (isAdminUser || unlockedPicks.some(unlockedPickItem => unlockedPickItem.PickId === pick.id))
  );
};
