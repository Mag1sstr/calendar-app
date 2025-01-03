import { configureStore } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import calendarSlice from "./slices/calendarSlice"

export const store = configureStore({
   reducer: {
      calendar: calendarSlice,
   },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
