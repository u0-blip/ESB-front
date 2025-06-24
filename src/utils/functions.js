export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const sum = (prevValue, currentValue) => {
  return prevValue + currentValue;
};

export const isUserAdmin = userRoles => {
  return userRoles
    && userRoles.length > 0
    && userRoles.indexOf("ADMIN") > -1;
}

export const generateReferalCode = length => {
  let result = '';
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for ( var i = 0; i < length; i++ ) {
     result = result.concat(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  return result;
}

export const isValidEmail = mail => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true
  }
  return false;
}

export const formatDob = dob => {
  const dobFormatted = dob.split('/').reverse().join('/').replace(/[/]/g,'-');
  return dobFormatted;
}

export const someObjectIsEmpty = object => {
  return Object.values(object).some(data => {
    return (
      (typeof data !== 'undefined' && !data) ||
      (typeof data === 'object' && typeof data.value !== 'undefined' && !data.value)
    );
  });
};