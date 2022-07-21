import authService from '../../services/authService';

export const loginUser = async (dispatch, loginPayload) => {
  dispatch({ type: 'REQUEST_LOGIN' });
  try {
    const authPayload = await authService.login(loginPayload);
    dispatch({ type: 'LOGIN_SUCCESS', payload: authPayload });
  } catch (error) {
    dispatch({ type: 'LOGIN_ERROR', payload: { errorMessage: error } });
  }
};

export const logout = (dispatch) => {
  dispatch({ type: 'LOGOUT' });
  authService.logout();
};

export const resetLoginFailed = (dispatch) => {
  dispatch({ type: 'RESET' });
};
