import { useReducer } from 'react';
import authService from '../../services/authService';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN': return {
      ...state,
      loading: true,
    };
    case 'LOGIN_SUCCESS': return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      loading: false,
      loginFailed: false,
    };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: '',
        loading: false,
        loginFailed: true,
        errorMessage: action.payload.errorMessage,
      };
    case 'LOGOUT': return {
      ...state,
      user: null,
      token: '',
    };
    case 'RESET': return {
      ...state,
      loginFailed: false,
    };
    default:
      throw new Error('Unhandled authReducer action');
  }
};
const { user = null, token = null } = authService.getUser();
const initState = {
  user,
  token,
  loading: false,
  loginFailed: false,
  errorMessage: '',
};

function useAuthReducer() {
  const [auth, dispatch] = useReducer(authReducer, initState, (state) => state);
  return { auth, dispatch };
}

export default useAuthReducer;
