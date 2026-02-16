import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    partNo: newItem.partNo,
                    quantity: newItem.quantity,
                    image: newItem.image
                });
            }
            state.totalQuantity += newItem.quantity;
        },
        removeFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter(item => item.id !== id);
            }
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem && quantity > 0) {
                // Calculate difference to update totalQuantity
                const diff = quantity - existingItem.quantity;
                existingItem.quantity = quantity;
                state.totalQuantity += diff;
            }
        },
        setCartCount(state, action) {
            state.totalQuantity = action.payload;
        }
    }
});

export const { addToCart, removeFromCart, clearCart, updateQuantity, setCartCount } = cartSlice.actions;
export default cartSlice.reducer;
