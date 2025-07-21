import { Action, createReducer, on } from '@ngrx/store';
import * as cartAction from './car-actions';
import { CarItem } from 'src/app/core/data/models/car-model';

export interface CarState {
  carItems: CarItem[];
}

export const initialState: CarState = {
  carItems: []
};


const methodReducer = createReducer(
    initialState,
    on(cartAction.addItem, (state, { newItem }) => {
      const myCartItems = [...state.carItems];
    
      // Buscar si ya existe el mismo producto con la misma talla seleccionada
      const index = myCartItems.findIndex(item =>
        item._id === newItem._id && item.sizeSelected === newItem.sizeSelected
      );
    
      if (index !== -1) {
        // Ya existe con la misma talla → sumamos cantidad
        const updatedItem = {
          ...myCartItems[index],
          quantity: myCartItems[index].quantity + newItem.quantity
        };
    
        const updatedCart = [...myCartItems];
        updatedCart[index] = updatedItem;
    
        return {
          ...state,
          carItems: updatedCart
        };
      }
    
      // Es otro producto o misma prenda con otra talla → agregar como nuevo
      return {
        ...state,
        carItems: [...myCartItems, newItem]
      };
    }),
    on(cartAction.increment, (state, { newItem }) => {
      const updatedCart = state.carItems.map(cartItem => {
        if (
          cartItem._id === newItem._id &&
          cartItem.sizeSelected === newItem.sizeSelected
        ) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1
          };
        }
        return cartItem;
      });
    
      return {
        ...state,
        carItems: updatedCart
      };
    }),
    
    on(cartAction.decrement, (state, { newItem }) => {
      const updatedCart = state.carItems
        .map(cartItem => {
          // Coincide por ID y talla seleccionada
          if (
            cartItem._id === newItem._id &&
            cartItem.sizeSelected === newItem.sizeSelected
          ) {
            const updatedQuantity = cartItem.quantity - 1;
    
            // Si la cantidad es mayor a 0, devolver el item actualizado
            if (updatedQuantity > 0) {
              return {
                ...cartItem,
                quantity: updatedQuantity
              };
            } else {
              // Si llega a 0, lo eliminaremos más abajo con filter
              return null;
            }
          }
          return cartItem;
        })
        // Eliminar los nulls (items con cantidad 0)
        .filter(item => item !== null) as CarItem[]; // casteo seguro si estás usando TypeScript
    
      return {
        ...state,
        carItems: updatedCart
      };
    }),
    on(cartAction.deleteItem, (state, { newItem }) => {
      const updatedCart = state.carItems.filter(cartItem =>
        !(cartItem._id === newItem._id && cartItem.sizeSelected === newItem.sizeSelected)
      );
    
      return {
        ...state,
        carItems: updatedCart
      };
    }),
    on(cartAction.clearCart, (state) => ({
      ...state,
      carItems: []
    }))
    
)

export function carReducer(state: any | undefined, action: Action) {
    return methodReducer(state, action);
}