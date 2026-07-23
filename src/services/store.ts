import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsReduser from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import feedReducer from './slices/feedSlice';
import userReduser from './slices/userSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { BurgerConstructor } from '@components';

const rootReducer = combineReducers({
  ingredients: ingredientsReduser,
  burgerConstructor: constructorReducer,
  feed: feedReducer,
  user: userReduser
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
