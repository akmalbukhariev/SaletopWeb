import { createSlice } from "@reduxjs/toolkit"

interface SearchSlice {
  value: string
}

const initialState: SearchSlice = {
  value: ""
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.value = action.payload
    },
  }
})

export const { setSearchValue } = searchSlice.actions
export default searchSlice.reducer