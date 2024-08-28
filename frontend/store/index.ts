import { configureStore } from '@reduxjs/toolkit'
import threadApi from "@/store/threads/threadApi";
import commentApi from "@/store/comments/commentApi";
import followApi from "@/store/follow/followApi";


export const store = configureStore({
    reducer: {
        [threadApi.reducerPath]: threadApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
        [followApi.reducerPath]: followApi.reducer,
    },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({}).concat(
            threadApi.middleware, commentApi.middleware, followApi.middleware
        ),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;