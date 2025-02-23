import { createSlice } from '@reduxjs/toolkit';

import User from '../types/User';
import { debugLog } from '../utils/DebugLogger';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: null,
  },
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;

      state.value = Object.assign({}, state.value, payload);
      debugLog('REDUX', `User value set`);
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: { user: { value: User } }) => state.user;

export default userSlice.reducer;
