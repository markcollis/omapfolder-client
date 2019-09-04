import { AUTH_USER, AUTH_ERROR } from '../actions/types';
import { LOG_API_CALLS } from '../config';
/* eslint-disable no-console */

const INITIAL_STATE = {
  authenticated: localStorage.getItem('mapoholic-auth-token'), // null if not logged in, JWT token if logged in
  errorMessage: '', // empty unless an error occurs
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_USER:
      if (LOG_API_CALLS) console.log('AUTH_USER with:', action.payload);
      return { ...state, authenticated: action.payload, errorMessage: '' };
    case AUTH_ERROR:
      if (LOG_API_CALLS) console.log('AUTH_ERROR with:', action.payload);
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default authReducer;
