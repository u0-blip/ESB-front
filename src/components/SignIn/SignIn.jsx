// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import { useRouter } from '../../utils/router';
import { LOCALSTORAGE_KEYS, USER_ROLES, MENU_ITEM } from '../../utils/constants';
import { saveUser, listUsers } from '../../service/UserService';
import { useAuth, AuthUser } from '../../utils/auth';

const SignIn = props => {
  const router = useRouter();
  const routerLocationHash = queryString.parse(router.location.hash);
  const auth = useAuth();

  useEffect(() => {
    signIn(router, routerLocationHash, auth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

const signIn = async (router, routerLocationHash, auth) => {
  if (routerLocationHash.access_token) {
    const access_token = routerLocationHash.access_token;
    const id_token = routerLocationHash.id_token;
    const tokenDecodedObj = jwtDecode(id_token);

    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_ACCESS, access_token);
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_ID, id_token);
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_NAME, getName(tokenDecodedObj));
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_PHONE_NUMBER, tokenDecodedObj.phone_number);
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EMAIL, tokenDecodedObj.email);
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_BIRTHDATE, tokenDecodedObj.birthdate);
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_EXP, tokenDecodedObj.exp);
    localStorage.setItem(LOCALSTORAGE_KEYS.ESB_TOKEN_COGNITO_USER_ID, tokenDecodedObj.sub);

    // User params form cognito needed to create a new user or update a existent in DB
    const userParams = {
      cognitoUserId: tokenDecodedObj.sub,
      name: getName(tokenDecodedObj),
      email: tokenDecodedObj.email
    };

    const saveResult = await saveUser(userParams);

    if (saveResult?.data?.CreateOrSaveUser?.id) {
      // TODO: REPLACE LOCALSTORAGE_KEYS.ESB_USER_ID in all system and get from auth context ??
      localStorage.setItem(LOCALSTORAGE_KEYS.ESB_USER_ID, saveResult.data.CreateOrSaveUser.id);
      localStorage.setItem(
        LOCALSTORAGE_KEYS.ESB_USER_ROLE,
        saveResult.data.CreateOrSaveUser.roles || [USER_ROLES.CUSTOMER.VALUE]
      );
      const user = getUserObj(saveResult.data.CreateOrSaveUser, tokenDecodedObj);
      auth.signin(user);

    } else {
      const listUserResult = await listUsers({ email: tokenDecodedObj.email });
      if (listUserResult?.data?.ListUsers?.rows) {
        // TODO: REPLACE LOCALSTORAGE_KEYS.ESB_USER_ID in all system and get from auth context ??
        localStorage.setItem(LOCALSTORAGE_KEYS.ESB_USER_ID, listUserResult.data.ListUsers.rows[0]?.id);
        localStorage.setItem(
          LOCALSTORAGE_KEYS.ESB_USER_ROLE,
          listUserResult.data.ListUsers.rows[0]?.roles || [USER_ROLES.CUSTOMER.VALUE]
        );
        const user = getUserObj(listUserResult.data.ListUsers.rows[0], tokenDecodedObj);
        auth.signin(user);

      }
    }

    router.push(MENU_ITEM.HOME.PATH);
  }
}

const getUserObj = (userResult = {}, tokenDecodedObj = {}) => {
  return new AuthUser({
    userId: userResult.id,
    cognitoUserId: tokenDecodedObj.sub,
    name: userResult.name,
    email: userResult.email,
    dob: tokenDecodedObj.birthdate,
    phone: tokenDecodedObj.phone_number,
    tokenExpireDate: tokenDecodedObj.exp,
    myReferralCode: userResult.myReferralCode,
    otherReferralCode: userResult.otherReferralCode,
    roles: userResult.roles || [USER_ROLES.CUSTOMER.VALUE]
  });
};

const getName = tokenDecodedObj => {
  return tokenDecodedObj.name
    ? tokenDecodedObj.name
    : `${tokenDecodedObj.given_name} ${tokenDecodedObj.family_name}`;
};

export default SignIn;
