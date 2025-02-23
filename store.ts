import { configureStore } from '@reduxjs/toolkit';

import userReducer from './state/userSlice';

import auth from '@react-native-firebase/auth';
import { debugLog } from './utils/DebugLogger';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
