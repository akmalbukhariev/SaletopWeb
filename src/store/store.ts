import { configureStore } from "@reduxjs/toolkit" 
import { userSliceReducer } from "@store/slices/userSlice" 
import authAPI from "@/features/auth/api/authAPI" 
import companyAPI from "@/features/company/api/companyAPI" 
import notifyAPI from "@/features/notification/api/NotifyAPI" 
import userAPI from "@/features/user/api/UserAPI" 
import adminPageAPI from "@/features/admin/api/adminPageAPI"

export const store = configureStore({
  reducer: {
    //slice
    user: userSliceReducer,

    //api
    [userAPI.reducerPath]: userAPI.reducer,
    [companyAPI.reducerPath]: companyAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [notifyAPI.reducerPath]: notifyAPI.reducer,
    [adminPageAPI.reducerPath]: adminPageAPI.reducer,
  },

  // api middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(userAPI.middleware)
      .concat(companyAPI.middleware)
      .concat(authAPI.middleware)
      .concat(notifyAPI.middleware)
      .concat(adminPageAPI.middleware),

  // Redux DevTools konfiguratsiyasi
  devTools: import.meta.env.MODE !== "production", // devtool faqat dev muhitida yoqiladi
}) 

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState> 

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 
