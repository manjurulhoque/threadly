import { configureStore } from '@reduxjs/toolkit'
import threadApi from "@/store/threads/threadApi";


export const store = configureStore({
    reducer: {
        [threadApi.reducerPath]: threadApi.reducer,
    },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            threadApi.middleware
        ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;