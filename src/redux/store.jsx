import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Use localStorage as default
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./authSlice";
import trainingReducer from "./trainingForm";
import cartFormReducer from "./cartForm";
import cartReducer from "./cartSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  training: trainingReducer,
  cartForm: cartFormReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "training", "cart"], // Persist auth, training, and cart data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
