import { ROUTES } from "@/shared/constants/routes"
import { IUserState } from "@/shared/types/IUserState" 
import { createSlice, PayloadAction } from "@reduxjs/toolkit" 

const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
const TOKEN_KEY = `${APP_PREFIX}_token`
const USER_KEY = `${APP_PREFIX}_user`

const savedUser = localStorage.getItem(USER_KEY) 
const initialState: IUserState = savedUser
  ? JSON.parse(savedUser)
  : { id: null, admin_id: null, admin_role: null, isAuthenticated: false } 

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IUserState>) {
      state.id = action.payload.id 
      state.admin_id = action.payload.admin_id 
      state.admin_role = action.payload.admin_role 
      state.isAuthenticated = action.payload.isAuthenticated 

      localStorage.setItem(USER_KEY, JSON.stringify(action.payload)) 
    },
    logout(state) {
      state.id = null 
      state.admin_id = null 
      state.admin_role = null 
      state.isAuthenticated = false 

      // Clear stored data
      localStorage.removeItem(USER_KEY) 
      localStorage.removeItem(TOKEN_KEY) 
    },
  },
}) 

export const { login, logout } = userSlice.actions 
export const userSliceReducer = userSlice.reducer 
