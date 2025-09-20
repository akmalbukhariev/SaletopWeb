import { configureStore } from '@reduxjs/toolkit';
import {userSliceReducer} from '@store/slices/userSlice';


export const store = configureStore({ 
    reducer: {
        user: userSliceReducer
    },  

    devTools: import.meta.env.MODE !== 'production', // devtool faqat dev muhitida yoqiladi
});


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
