import axios from './axios-instance';
import { isValidAuthorizationToken } from '../utils/auth';

/**
 * Call all graphql queries
 * @param {*} query this is the query in string format
 * @param {*} variables these are the variables used inside the query
 * Result: fields selected
 */
export const ExecGraphQl = async (query, variables = undefined) => {
  try {
    const result = await axios({
      method: 'POST',
      url: getUrl(),
      params: null,
      data: {
        query: query,
        variables: variables
      },
      responseType: null
    });
    // axios returns {data: {...}, status: 200, statusText: "OK", headers: {...}, config: {...}, request: {...} }
    // we are interested in data which is the API result
    return result.data;
  } catch (error) {
    throw error.response ? error.response : error;
  }
};

const getUrl = () => {
  if (isValidAuthorizationToken()) {
    return '/protected/graphql';
  }
  return '/open/graphql';
};

export const upload = async data => {
  try {
    return await axios.post('/v1/image-upload', data);
  } catch (error) {
    throw error.response ? error.response : error;
  }
};

export const sendReferralInvite = async (to, subject, userName, userReferralCode, appUrl) => {
  try {
    return await axios.post('/v1/mail', {
      to: to,
      template: 'referralinvite',
      subject: subject,
      templateVars: {
        User: {
          Name: userName,
          MyReferralCode: userReferralCode
        },
        App: {
          Url: appUrl
        }
      }
    });
  } catch (error) {
    throw error.response ? error.response : error;
  }
};
