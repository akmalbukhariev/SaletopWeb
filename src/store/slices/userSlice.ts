import { IUserState } from "@/shared/types/IUserState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const initialState: IUserState = savedUser
  ? JSON.parse(savedUser)
  : { id: null, admin_id: null, admin_role: null, isAuthenticated: false };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IUserState>) {
      state.id = action.payload.id;
      state.admin_id = action.payload.admin_id;
      state.admin_role = action.payload.admin_role;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logout(state) {
      state.id = null;
      state.admin_id = null;
      state.admin_role = null;
      state.isAuthenticated = false;

      // Clear stored data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    },
  },
});

export const { login, logout } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
