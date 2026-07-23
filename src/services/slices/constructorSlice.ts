import { TConstructorIngredient, TOrder } from '../../utils/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

export type TConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const sendOrder = createAsyncThunk(
  'burgerConstructor/sendOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return {
      _id: response.order._id,
      status: response.order.status,
      name: response.order.name,
      createdAt: response.order.createdAt,
      updatedAt: response.order.updatedAt,
      number: response.order.number,
      ingredients: ingredients
    };
  }
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredients: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveUp: (state, action: PayloadAction<string>) => {
      const ingredients = state.constructorItems.ingredients;
      const index = ingredients.findIndex((item) => item.id === action.payload);

      if (index > 0) {
        const [item] = ingredients.splice(index, 1);
        ingredients.splice(index - 1, 0, item);
      }
    },

    moveDown: (state, action: PayloadAction<string>) => {
      const ingredients = state.constructorItems.ingredients;
      const index = ingredients.findIndex((item) => item.id === action.payload);
      if (index !== -1 && index < ingredients.length - 1) {
        const [item] = ingredients.splice(index, 1);
        ingredients.splice(index + 1, 0, item);
      }
    },

    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
        state.error = null;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = null;
        state.error = action.error.message || 'Ошибка оформления заказа';
      });
  }
});

export const {
  addBun,
  addIngredients,
  removeIngredient,
  moveDown,
  moveUp,
  clearOrderModal
} = constructorSlice.actions;

export const {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} = constructorSlice.selectors;

export default constructorSlice.reducer;
