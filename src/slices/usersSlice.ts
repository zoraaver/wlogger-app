import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { API } from "../config/axios.config";
import { extractTokenFromSetCookieHeaders } from "../util/util";

const loginUrl = "/auth/login";
const googleLoginUrl = "/auth/google";
const validateUrl = "/auth/validate";
const verifyUrl = "/auth/verify";
const usersUrl = "/users";

interface userLoginData {
  email: string;
  password: string;
}

type userSignupData = userLoginData & {
  confirmPassword: string;
};

interface userData {
  email: string;
}

async function saveToken(response: AxiosResponse<any>): Promise<void> {
  const token: string = extractTokenFromSetCookieHeaders(
    response.headers["set-cookie"]
  );
  await EncryptedStorage.setItem("token", token);
}

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (formData: userLoginData) => {
    try {
      const response: AxiosResponse<{ user: userData }> = await API.post(
        loginUrl,
        formData
      );
      await saveToken(response);
      return response.data.user;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  "users/googleLoginUser",
  async (idToken: string) => {
    try {
      const response: AxiosResponse<{
        user: userData;
      }> = await API.post(googleLoginUrl, { idToken });
      await saveToken(response);
      return response.data.user;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const validateUser = createAsyncThunk("users/validate", async () => {
  try {
    const response: AxiosResponse<{
      user: userData;
    }> = await API.get(validateUrl);
    return response.data.user;
  } catch (error) {
    if (error.response) return Promise.reject(error.response.data);
    return Promise.reject(error);
  }
});

export const verifyUser = createAsyncThunk(
  "users/verify",
  async (verificationToken: string) => {
    try {
      const response: AxiosResponse<{ user: userData }> = await API.post(
        verifyUrl,
        {
          verificationToken,
        }
      );
      await saveToken(response);
      return response.data.user;
    } catch (error) {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const signupUser = createAsyncThunk(
  "users/signupUser",
  async (formData: userSignupData, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{
        user: { email: string };
      }> = await API.post(usersUrl, formData);
      return response.data.user.email;
    } catch (error) {
      if (error.response) return rejectWithValue(error.response.data);
      return Promise.reject(error);
    }
  }
);

export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  try {
    await EncryptedStorage.removeItem("token");
  } catch (error) {}
});

interface signupError {
  field: string;
  error: string;
}

type authenticationStatus = "pending" | "confirmed" | "unknown";

interface userState {
  loginError?: string;
  signupError?: signupError;
  signupSuccess?: string;
  verificationError?: string;
  authenticationStatus: authenticationStatus;
  data: userData | null;
  postUserPending?: boolean;
}

const initialState: userState = {
  data: null,
  authenticationStatus: "pending",
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthenticationStatus(
      state,
      action: PayloadAction<authenticationStatus>
    ) {
      state.authenticationStatus = action.payload;
    },

    setSignupSuccess(state, action: PayloadAction<string | undefined>) {
      state.signupSuccess = action.payload;
    },

    setSignupError(state, action: PayloadAction<signupError | undefined>) {
      state.signupError = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(loginUser.rejected, (state, action) => {
      state.data = null;
      state.loginError = action.error.message;
      state.authenticationStatus = "unknown";
    });

    addCase(loginUser.fulfilled, (state, action: PayloadAction<userData>) => {
      const userData = action.payload;
      state.data = userData;
      state.loginError = undefined;
      state.authenticationStatus = "confirmed";
    });

    addCase(loginUser.pending, (state) => {
      state.authenticationStatus = "pending";
    });

    addCase(
      googleLoginUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.loginError = undefined;
        state.authenticationStatus = "confirmed";
      }
    );

    addCase(googleLoginUser.rejected, (state, action) => {
      state.data = null;
      state.loginError = action.error.message;
      state.authenticationStatus = "unknown";
    });

    addCase(googleLoginUser.pending, (state) => {
      state.authenticationStatus = "pending";
    });

    addCase(
      validateUser.fulfilled,
      (state, action: PayloadAction<userData>) => {
        const userData = action.payload;
        state.data = userData;
        state.authenticationStatus = "confirmed";
      }
    );

    addCase(validateUser.pending, (state) => {
      state.authenticationStatus = "pending";
    });

    addCase(validateUser.rejected, (state) => {
      state.data = null;
      state.authenticationStatus = "unknown";
    });

    addCase(verifyUser.fulfilled, (state, action: PayloadAction<userData>) => {
      const userData = action.payload;
      state.data = userData;
      state.authenticationStatus = "confirmed";
    });

    addCase(verifyUser.rejected, (state, action) => {
      state.data = null;
      state.verificationError = action.error.message;
      state.authenticationStatus = "unknown";
    });

    addCase(signupUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.signupSuccess = `Account successfully created: a verification email has been sent to ${action.payload}`;
      state.signupError = undefined;
      state.postUserPending = false;
    });

    addCase(signupUser.pending, (state) => {
      state.postUserPending = true;
    });

    addCase(signupUser.rejected, (state, action: PayloadAction<unknown>) => {
      const signupError = action.payload as signupError;
      state.signupError = {
        field: signupError.field,
        error: signupError.error,
      };
      state.signupSuccess = undefined;
      state.postUserPending = false;
    });

    addCase(logoutUser.fulfilled, (state) => {
      state.data = null;
      state.authenticationStatus = "unknown";
    });

    addCase(logoutUser.pending, (state) => {
      state.authenticationStatus = "pending";
    });
  },
});

export const userReducer = slice.reducer;
export const { setSignupSuccess, setSignupError } = slice.actions;
