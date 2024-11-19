// store/balanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BalanceState {
  balance: number | null; // Balance can be null initially if not fetched
}

const initialState: BalanceState = {
  balance: null,
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload; // Set the balance value
    },
    resetBalance: (state) => {
      state.balance = null; // Reset the balance to null
    },
    addBalance: (state, action: PayloadAction<number>) => {
      if (state.balance !== null) {
        state.balance += action.payload; // Add the specified amount to balance
      }
    },
    deductBalance: (state, action: PayloadAction<number>) => {
      if (state.balance !== null) {
        state.balance -= action.payload; // Deduct the specified amount from balance
      }
    },
  },
});

export const { setBalance, resetBalance, addBalance, deductBalance } = balanceSlice.actions;

export default balanceSlice.reducer;
