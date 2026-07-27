import { describe, expect, test } from '@jest/globals';
import reducer, {
  initialState,
  sendOrder,
  addBun,
  addIngredients,
  removeIngredient,
  moveDown,
  moveUp
} from '../../slices/constructorSlice';

describe('Тесты редьюсера constructorSlice', () => {
  const mockBun = {
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
    image_mobile: 'url',
    id: '1'
  };

  const mockIngredient1 = {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 25,
    fat: 5,
    carbohydrates: 5,
    calories: 160,
    price: 110,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url',
    id: '2'
  };

  const mockIngredient2 = {
    _id: '3',
    name: 'Cалат',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 5,
    calories: 20,
    price: 60,
    image: 'url',
    image_large: 'url',
    image_mobile: 'url',
    id: '3'
  };

  const mockOrder = {
    _id: 'заказ № 1223',
    status: 'выполнен',
    name: 'Бургер',
    createdAt: '',
    updatedAt: '',
    number: 1223,
    ingredients: ['1', '2']
  };

  test('Если экшена не существует  в приложении и началльное состояние undefined, должен вернуть начальное состояние', () => {
    const unknownAction = { type: 'UNKNOWN' };
    const result = reducer(undefined, unknownAction);
    expect(result).toEqual(initialState);
  });

  test('Проверяем добаление булки в конструктор', () => {
    const action = addBun(mockBun);
    const result = reducer(initialState, action);
    expect(result.constructorItems.bun).toEqual(mockBun);
    expect(result.constructorItems.ingredients).toEqual([]);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toBe(null);
    expect(result.error).toBe(null);
  });

  test('Проверяем добавление ингредиентов', () => {
    const action = addIngredients(mockIngredient1);
    const result = reducer(initialState, action);
    expect(result.constructorItems.ingredients[0]).toEqual(mockIngredient1);
    expect(result.constructorItems.ingredients).toHaveLength(1);
    expect(result.constructorItems.bun).toBe(null);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toBe(null);
    expect(result.error).toBe(null);
  });

  test('Проверяем удаление ингредиентов', () => {
    const addAction = addIngredients(mockIngredient1);
    const stateWithIngredient = reducer(initialState, addAction);
    expect(stateWithIngredient.constructorItems.ingredients).toHaveLength(1);

    const removeAction = removeIngredient(mockIngredient1.id);
    const result = reducer(stateWithIngredient, removeAction);
    expect(result.constructorItems.ingredients).toHaveLength(0);
    expect(result.constructorItems.bun).toBe(null);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toBe(null);
    expect(result.error).toBe(null);
  });

  test('Проверяем перемещение ингредиента вверх', () => {
    const stateWithIngredients = reducer(
      reducer(initialState, addIngredients(mockIngredient1)),
      addIngredients(mockIngredient2)
    );
    expect(stateWithIngredients.constructorItems.ingredients).toHaveLength(2);
    expect(stateWithIngredients.constructorItems.ingredients[0]._id).toBe('2');
    expect(stateWithIngredients.constructorItems.ingredients[1]._id).toBe('3');

    const action = moveUp(mockIngredient2.id);
    const result = reducer(stateWithIngredients, action);
    expect(result.constructorItems.ingredients[0]._id).toBe('3');
    expect(result.constructorItems.ingredients[1]._id).toBe('2');
  });

  test('Проверяем перемещение ингредиента вниз', () => {
    const stateWithIngredients = reducer(
      reducer(initialState, addIngredients(mockIngredient1)),
      addIngredients(mockIngredient2)
    );
    expect(stateWithIngredients.constructorItems.ingredients).toHaveLength(2);
    expect(stateWithIngredients.constructorItems.ingredients[0]._id).toBe('2');
    expect(stateWithIngredients.constructorItems.ingredients[1]._id).toBe('3');

    const action = moveDown(mockIngredient1.id);
    const result = reducer(stateWithIngredients, action);
    expect(result.constructorItems.ingredients[0]._id).toBe('3');
    expect(result.constructorItems.ingredients[1]._id).toBe('2');
  });

  test('Должен обработать sendOrder.pending', () => {
    const action = { type: sendOrder.pending.type };
    const result = reducer(initialState, action);

    expect(result.orderRequest).toBe(true);
    expect(result.orderModalData).toBe(null);
    expect(result.error).toBe(null);
  });

  test('Должен обработать sendOrder.rejected с сообщением об ошибке', () => {
    const action = {
      type: sendOrder.rejected.type,
      error: { message: 'Ошибка' }
    };
    const result = reducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toBe(null);
    expect(result.error).toBe('Ошибка');
  });

  test('Должен обработать sendOrder.rejected без сообщения об ошибке', () => {
    const action = {
      type: sendOrder.rejected.type,
      error: {}
    };
    const result = reducer(initialState, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toBe(null);
    expect(result.error).toBe('Ошибка оформления заказа');
  });

  test('Должен обработать sendOrder.fulfilled', () => {
    const stateWithItems = reducer(
      reducer(initialState, addBun(mockBun)),
      addIngredients(mockIngredient1)
    );
    const action = { type: sendOrder.fulfilled.type, payload: mockOrder };
    const result = reducer(stateWithItems, action);
    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toEqual(mockOrder);
    expect(result.constructorItems.bun).toBe(null);
    expect(result.constructorItems.ingredients).toEqual([]);
    expect(result.error).toBe(null);
  });
});
