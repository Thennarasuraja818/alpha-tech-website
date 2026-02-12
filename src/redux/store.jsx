import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Use localStorage as default
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./authSlice";
import trainingReducer from "./trainingForm";
import cartFormReducer from "./cartForm";
import cartReducer from "./cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['cart'] // Persist cart data
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

const store = configureStore({
  reducer: {
    auth: authReducer,
    training: trainingReducer,
    cartForm: cartFormReducer,
    cart: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
