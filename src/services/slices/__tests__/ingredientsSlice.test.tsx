import { describe, expect, test } from '@jest/globals';
import reducer, {
  getIngredients,
  initialState
} from '../../slices/ingredientsSlice';

describe('Тесты редьюсера ingredientsSlice', () => {
  test('Если экшена не существует  в приложении и началльное состояние undefined, должен вернуть начальное состояние', () => {
    const unknownAction = { type: 'UNKNOWN' };
    const result = reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  test('Должен обработать getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBe(null);
    expect(result.ingredients).toEqual([]);
  });

  test('Должен обработать getIngredients.rejected с сообщением об ошибке', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка' }
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка');
    expect(result.ingredients).toEqual([]);
  });

  test('Должен обработать getIngredients.rejected без сообщения об ошибке', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: {}
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки ингредиентов');
    expect(result.ingredients).toEqual([]);
  });

  test('Должен обработать getIngredients.fulfilled', () => {
    const mockIngredients = [
      {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 5,
        fat: 3,
        carbohydrates: 25,
        calories: 147,
        price: 100,
        image: 'url',
        image_large: 'url',
        image_mobile: 'url'
      }
    ];
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = reducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });
});
