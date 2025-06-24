import { Subject } from 'rxjs';

const isValidAuthorizationTokenObservable = new Subject();

export const AuthService = {
  setIsValidAuthorizationToken: value => setIsValidAuthorizationToken(value),
  isValidAuthorizationToken: () => isValidAuthorizationToken(),
  setAuthorizationTokenTimeOut: expireTime => setTimeout(invalidateAuthorizationToken, expireTime)
};

const setIsValidAuthorizationToken = value => {
  isValidAuthorizationTokenObservable.next(value);
};

const isValidAuthorizationToken = () => {
  return isValidAuthorizationTokenObservable.asObservable();
};

const invalidateAuthorizationToken = () => {
  AuthService.setIsValidAuthorizationToken(false);
};
