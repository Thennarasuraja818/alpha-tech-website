import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isGetList: false,
  id: '',
  type: ''
};

const checkoutFromHandle = createSlice({
  name: 'formHandle',
  initialState,
  reducers: {
    handleForm(state, action) {
      const { isGetList , id, type } = action.payload;
      state.isGetList = isGetList;
      state.id = id;
      state.type = type;
    }
  }
});

export const { checkhandleForm } = checkoutFromHandle.actions;
export default checkoutFromHandle.reducer;
