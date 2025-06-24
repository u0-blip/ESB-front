export const MENU_ITEM = {
  HOME: {
    LABEL: 'home',
    PATH: '/',
    PROTECTED: false
  },
  REFERAL_REDIRECT: {
    LABEL: 'referral',
    PATH: '/referralredirect',
    PROTECTED: false
  },
  SIGNIN: {
    LABEL: 'sign in',
    PATH: '/signin',
    PROTECTED: false
  },
  SIGNUP: {
    LABEL: 'sign up',
    PATH: '/signup',
    PROTECTED: false
  },
  PICKS: {
    LABEL: 'picks',
    PATH: '/picks',
    PROTECTED: false
  },
  PICK_DETAIL: {
    LABEL: 'pick detail',
    PATH: '/pick/',
    PROTECTED: false
  },
  SCORECARD: {
    LABEL: 'scorecard',
    PATH: '/scorecard',
    PROTECTED: false
  },
  PACKAGES: {
    LABEL: 'packages',
    PATH: '/packages',
    PROTECTED: true
  },
  PURCHASE_HISTORY: {
    LABEL: 'purchase history',
    PATH: '/purchasehistory',
    PROTECTED: true
  },
  PAYMENT_SUCCESS: {
    LABEL: 'payment success',
    PATH: '/paymentsuccess',
    PROTECTED: true
  },
  ACCOUNT: {
    LABEL: 'your account',
    PATH: '/account',
    PROTECTED: true
  },
  ADMIN: {
    LABEL: 'admin',
    PATH: '/admin',
    PROTECTED: true
  },
  ADMIN_DASHBOARD: {
    LABEL: 'dashboard',
    PATH: '/admin',
    PROTECTED: true
  },
  ADMIN_SPORTS: {
    LABEL: 'Manage Sports',
    PATH: '/admin/sports',
    PROTECTED: true
  },
  ADMIN_TEAMS: {
    LABEL: 'Manage Teams',
    PATH: '/admin/teams',
    PROTECTED: true
  },
  ADMIN_PICKS: {
    LABEL: 'Manage Picks',
    PATH: '/admin/picks',
    PROTECTED: true
  },
  ADMIN_USERS: {
    LABEL: 'Manage Users',
    PATH: '/admin/users',
    PROTECTED: true
  },
  ADMIN_PACKAGES: {
    LABEL: 'Manage Packages',
    PATH: '/admin/packages',
    PROTECTED: true
  },
  ADMIN_PURCHASE_HISTORY: {
    LABEL: 'View Purchase History',
    PATH: '/admin/purchasehistory',
    PROTECTED: true
  },
  SIGNOUT: {
    LABEL: 'sign out',
    PATH: '/signout',
    PROTECTED: false
  }
};

export const LOCALSTORAGE_KEYS = {
  ESB_TOKEN_EMAIL: 'esb_token_email',
  ESB_TOKEN_EXP: 'esb_token_exp',
  ESB_TOKEN_ACCESS: 'esb_token_access',
  ESB_TOKEN_ID: 'esb_token_id',
  ESB_TOKEN_NAME: 'esb_token_name',
  ESB_TOKEN_BIRTHDATE: 'esb_token_birthdate',
  ESB_TOKEN_PHONE_NUMBER: 'esb_token_phone_number',
  ESB_TOKEN_COGNITO_USER_ID: 'esb_token_cognito_user_id',
  ESB_USER_ID: 'esb_user_id',
  ESB_USER_ROLE: 'esb_user_role',
  ESB_IS_LOADING: 'esb_is_loading'
};

export const SESSIONSTORAGE_KEYS = {
  OTHER_REFERRAL_CODE: 'other_referral_code'
};

export const VIBRATOR_DURATION = 35;

export const PICK_STATUS = {
  NEW: {
    LABEL: 'NEW',
    VALUE: 1,
    NAME: 'New',
    COLOR: '',
    ICON: '',
  },
  CORRECT: {
    LABEL: 'CORRECT',
    VALUE: 10,
    NAME: 'Correct',
    COLOR: 'has-text-success',
    ICON: 'fa-check',
  },
  INCORRECT: {
    LABEL: 'INCORRECT',
    VALUE: 20,
    NAME: 'Incorrect',
    COLOR: 'has-text-danger',
    ICON: 'fa-times',
  },
  PUSH: {
    LABEL: 'PUSH',
    VALUE: 30,
    NAME: 'Push',
    COLOR: '',
    ICON: 'fa-minus',
  },
  DELETED: {
    LABEL: 'DELETED',
    VALUE: 100,
    NAME: 'Deleted',
    COLOR: '',
    ICON: '',
  },
};

export const USER_ROLES = {
  CUSTOMER: { LABEL: 'CUSTOMER', VALUE: 'CUSTOMER' },
  ADMIN: { LABEL: 'ADMIN', VALUE: 'ADMIN' },
  BET_ADVISOR: { LABEL: 'BET_ADVISOR', VALUE: 'BET_ADVISOR' },
  CUSTOMER_SUPPORT: { LABEL: 'CUSTOMER_SUPPORT', VALUE: 'CUSTOMER_SUPPORT' }
};

export const MODAL_TYPES = {
  CONFIRMATION: 'confirmation',
  UPDATE: 'update',
  INFO: 'info'
};
