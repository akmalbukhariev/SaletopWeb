import { configureStore } from "@reduxjs/toolkit" 
import { userSliceReducer } from "@store/slices/userSlice" 
import authAPI from "@/pages/auth/api/authAPI" 
import companyAPI from "@/pages/company/api/companyAPI" 
import userAPI from "@/pages/user/api/UserAPI" 
import adminPageAPI from "@/pages/admin/api/adminPageAPI"
import notifyAPI from "@/pages/notification/api/notifyAPI"
import dashboardAPI from '../pages/dashboard/api/dashboardAPI'
import announcementAPI from "@/pages/announcement/api/announcementAPI"

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
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [announcementAPI.reducerPath]: announcementAPI.reducer,
  },

  // api middleware
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(userAPI.middleware)
      .concat(companyAPI.middleware)
      .concat(authAPI.middleware)
      .concat(notifyAPI.middleware)
      .concat(adminPageAPI.middleware)
      .concat(dashboardAPI.middleware)
      .concat(announcementAPI.middleware),

  // Redux DevTools konfiguratsiyasi
  devTools: import.meta.env.MODE !== "production", // devtool faqat dev muhitida yoqiladi
}) 

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState> 

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch 
