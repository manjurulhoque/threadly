import { configureStore } from "@reduxjs/toolkit";
import threadApi from "@/store/threads/threadApi";
import commentApi from "@/store/comments/commentApi";
import followApi from "@/store/follow/followApi";
import likeApi from "@/store/likes/likeApi";
import usersApi from "./users/userApi";

export const store = configureStore({
  reducer: {
    [threadApi.reducerPath]: threadApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [followApi.reducerPath]: followApi.reducer,
    [likeApi.reducerPath]: likeApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({}).concat(
      threadApi.middleware,
      commentApi.middleware,
      followApi.middleware,
      likeApi.middleware,
      usersApi.middleware
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
