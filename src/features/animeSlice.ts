import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string };
  };
  synopsis: string;
}

interface AnimeState {
  query: string;
  loading: boolean;
  error: string;
  anime: Anime[];
}

const initialState: AnimeState = {
  query: "",
  loading: false,
  error: "",
  anime: [],
};

// Load top anime
export const fetchTopAnime = createAsyncThunk("anime/top", async () => {
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await res.json();
  return data.data;
});

// Search anime
export const searchAnime = createAsyncThunk(
  "anime/search",
  async (query: string) => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}&limit=15`
    );
    const data = await res.json();
    return data.data;
  }
);

const animeSlice = createSlice({
  name: "anime",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopAnime.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTopAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.anime = action.payload;
      })
      .addCase(searchAnime.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(searchAnime.fulfilled, (state, action) => {
        state.loading = false;
        state.anime = action.payload;
      });
  },
});

export const { setQuery } = animeSlice.actions;
export default animeSlice.reducer;
