import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface Games {
    id: number;
    title: string;
    image: string | null; // Allow image to be null
    createdAt: string;
    content: string;
    description: string | null;
    url: string | null;
  }
  
  interface SearchState {
    query: string;
    games: Games[];
  }
  
  const initialState: SearchState = {
    query: '',
    games: [],
  };
  
  const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
      setSearchQuery: (state, action: PayloadAction<string>) => {
        state.query = action.payload;
      },
      setGames: (state, action: PayloadAction<Games[]>) => {
        state.games = action.payload;
      },
    },
  });
  
  export const { setSearchQuery, setGames } = searchSlice.actions;
  export default searchSlice.reducer;
  