import { ExecGraphQl } from '../http/httpService';
import { CREATE_OR_SAVE_USER } from '../http/graphqlMutations';
import { LIST_USERS_QL } from '../http/graphqlQuerys';

export const saveUser = async userParams => {
  return await ExecGraphQl(CREATE_OR_SAVE_USER, userParams);
};

export const listUsers = async userParams => {
  return await ExecGraphQl(LIST_USERS_QL, userParams);
};

export const getUserCreditsAvailable = (creditsPurchased = [], totalPicksUnlockedWithStatusCorrect) => {
  const totalCreditsPurchased = creditsPurchased.reduce((prevValue, currentValue) => {
    return !!currentValue?.credits ? prevValue + currentValue.credits : prevValue;
  }, 0);
  return totalCreditsPurchased - totalPicksUnlockedWithStatusCorrect;
};
