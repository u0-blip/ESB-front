import React, { useState, useContext, createContext, useEffect } from 'react';
import * as moment from 'moment';
import { LOCALSTORAGE_KEYS, USER_ROLES, SESSIONSTORAGE_KEYS } from './constants';

/*
    Handles authentication with fakeAuth, a library for prototyping ...
    ... auth flows without need for a backend (everything is stored locally).

    [CHANGING AUTH SERVICES]: You can switch to another auth service ...
    ... like firebase, auth0, etc, by modifying the useProvideAuth() ...
    ... function below. Simply swap out the fakeAuth.function() calls for the ...
    ... correct ones for your given auth service.
  */

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... update when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(new AuthUser());

  const signin = userParam => {
    setUser(userParam);
  };

  const signup = userParam => {
    setUser(userParam);
  };

  const isAdminUser = () => {
    if (user?.roles && user.roles.length && user.roles.includes(USER_ROLES.ADMIN.VALUE)) {
      return true;
    }
    return false;
  };

  const isValidAuthorizationToken = () => {
    if (user?.tokenExpireDate && moment.unix(user.tokenExpireDate).isAfter(moment())) {
      return true;
    }
    return false;
  };

  const signout = () => {
    cleanStorage();
  };

  // Subscribe to user on mount
  // [CHANGING AUTH SERVICES]: Not all auth services have a subscription ...
  // ... function so depending on your service you may need to remove  ...
  // ... this effect and use the commented out one below.
  // useEffect(() => {
  //   const unsubscribe = fakeAuth.onChange(user => {
  //     setUser(user);
  //   });

  //   // Call unsubscribe on cleanup
  //   return () => unsubscribe();
  // }, []);

  // Fetch user on mount
  // [CHANGING AUTH SERVICES]: If your auth service doesn't have a subscribe ...
  // ... function then use this effect instead of the one above and modify ...
  // ... to work with your chosen auth service.
  useEffect(() => {
    const userParams = {
      id: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ID),
      sub: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_COGNITO_USER_ID),
      name: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_NAME),
      email: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EMAIL),
      birthdate: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_BIRTHDATE),
      phone_number: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_PHONE_NUMBER),
      exp: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EXP),
      roles: localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ROLE)
    };

    setUser(getUserObj(userParams));
  }, []);

  return {
    user,
    signin,
    signup,
    isAdminUser,
    isValidAuthorizationToken,
    signout
  };
}

// const getFromQueryString = key => {
//   return queryString.parse(window.location.search)[key];
// };

export const isValidAuthorizationToken = () => {
  const tokenExpireTime = localStorage.getItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EXP);
  if (!!tokenExpireTime && !!moment.unix(tokenExpireTime).isAfter(moment())) {
    return true;
  }
  return false;
};

export class AuthUser {
  userId;
  cognitoUserId;
  name;
  email;
  dob;
  phone;
  tokenExpireDate;
  myReferralCode;
  otherReferralCode;
  roles;
  constructor(obj) {
    Object.assign(this, obj);
  }
}

const getUserObj = (userParams = {}) => {
  return new AuthUser({
    userId: +userParams.id,
    cognitoUserId: userParams.sub,
    name: userParams.name,
    email: userParams.email,
    dob: userParams.birthdate,
    phone: userParams.phone_number,
    tokenExpireDate: userParams.exp,
    myReferralCode: userParams.myReferralCode,
    otherReferralCode: userParams.otherReferralCode,
    roles: userParams.roles || [USER_ROLES.CUSTOMER.VALUE]
  });
};

const cleanStorage = () => {
  // LOCAL STORAGE
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_ACCESS);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_ID);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_NAME);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_PHONE_NUMBER);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EMAIL);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_BIRTHDATE);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EXP);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_TOKEN_COGNITO_USER_ID);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_USER_ID);
  localStorage.removeItem(LOCALSTORAGE_KEYS.ESB_USER_ROLE);
  // SESSION STORAGE
  sessionStorage.removeItem(SESSIONSTORAGE_KEYS.ESB_USER_ROLE);
};
