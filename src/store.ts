import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit'
import contactReducer from './contactSlice';
const store = configureStore({
  reducer: contactReducer,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch: () => AppDispatch = useDispatch 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store