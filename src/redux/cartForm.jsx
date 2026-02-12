import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGetList: false,
  id: ''
};

const cartFromHandle = createSlice({
  name: 'formHandle',
  initialState,
  reducers: {
    handleForm(state, action) {
      const { isGetList , id } = action.payload;
      state.isGetList = isGetList;
      state.id = id;
    }
  }
});

export const { handleForm } = cartFromHandle.actions;
export default cartFromHandle.reducer;
