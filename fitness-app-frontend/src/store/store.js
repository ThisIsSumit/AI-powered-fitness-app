import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import activitiesReducer from "./activitiesSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        activities: activitiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});