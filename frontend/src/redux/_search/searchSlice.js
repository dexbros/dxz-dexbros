/** @format */

import { createSlice } from "@reduxjs/toolkit";
import { getSearchResult } from "../../api/_search/SearchAPi";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    search: null,
    all: [],
    searchposts: [],
    people: [],
    searchblock: [],
    // search_tag: [],
    // search_history: [],
  },
  reducers: {
    setSearch: (state, action) => {
      console.log("action.data: ", action.data);
      state.all = action.payload;
    },

    setPostSearch: (state, action) => {
      state.searchposts = action.payload;
    },

    setPeopleSearch: (state, action) => {
      state.people = action.payload;
    },

    setBlockSearch: (state, action) => {
      state.searchblock = action.payload;
    },

    setSearchHistory: (state, action) => {
      //
    },
  },
});

const { actions, reducer } = searchSlice;

// Extract and export each action creator by name
export const { setSearch, setPostSearch, setPeopleSearch, setBlockSearch } =
  searchSlice.actions;

export const fetchAllSearchResult = (data) => async (dispatch) => {
  const response = await getSearchResult(data);
  const searchData = response.map((res) => res.data);
  var arr = [
    ...searchData[0].user,
    ...searchData[1].block,
    ...searchData[2].posts,
  ];
  dispatch(setSearch(arr));
  dispatch(setPostSearch(searchData[2].posts));
  dispatch(setPeopleSearch(searchData[0].user));
  dispatch(setBlockSearch(searchData[1].block));
};

// Export the reducer, either as a default or named export
export default searchSlice.reducer;
