import { TUser, TOrder } from '../../utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  TRegisterData,
  getUserApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateUserApi,
  logoutApi,
  getOrdersApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserError: string | null;
  loginUserRequest: boolean;
  orders: TOrder[];
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserError: null,
  loginUserRequest: false,
  orders: []
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const data = await logoutApi();

  localStorage.clear();
  deleteCookie('accessToken');
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const data = await updateUserApi(userData);

    return data.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email }: { email: string }) => {
    const data = await forgotPasswordApi({ email });

    return data;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ password, token }: { password: string; token: string }) => {
    const data = await resetPasswordApi({ password, token });

    return data;
  }
);

export const getUserOrders = createAsyncThunk(
  'user/getUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthChecked = false;
      state.isAuthenticated = false;
      state.loginUserError = null;
    },
    clearError: (state) => {
      state.loginUserError = null;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectLoginUserError: (state) => state.loginUserError,
    selectLoginUserRequest: (state) => state.loginUserRequest,
    selectUserOrders: (state) => state.orders
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.loginUserError = null;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserError = action.error.message || 'Ошибка входа';
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })

      .addCase(getUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.loginUserError = null;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        state.loginUserRequest = false;
        state.loginUserError =
          action.error.message || 'Ошибка получения данных';
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loginUserRequest = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка выхода';
      })

      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })

      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError =
          action.error.message || 'Ошибка обновления данных';
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loginUserRequest = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError =
          action.error.message || 'Ошибка восстановления пароля';
      })

      .addCase(resetPassword.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loginUserRequest = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message || 'Ошибка сброса пароля';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError =
          action.error.message || 'Ошибка получения заказов';
      });
  }
});

export const { authChecked, clearUser, clearError } = userSlice.actions;

export const {
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectLoginUserError,
  selectLoginUserRequest,
  selectUserOrders
} = userSlice.selectors;

export default userSlice.reducer;
