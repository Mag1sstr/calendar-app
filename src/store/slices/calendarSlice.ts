import { createSlice } from "@reduxjs/toolkit"
import { IEvents } from "../../components/interfaces/interfaces"

interface CounterState {
   events: IEvents[]
}

const initialState: CounterState = {
   events: [],
}

export const calendarSlice = createSlice({
   name: "calendar",
   initialState,
   reducers: {
      setEvent(state, action) {
         state.events.push(action.payload)
      },
   },
})

export const { setEvent } = calendarSlice.actions

export default calendarSlice.reducer
