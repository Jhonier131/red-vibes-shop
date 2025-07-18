import { createAction, props } from "@ngrx/store";
import { CarItem } from "../../data/models/car-model";

export const increment = createAction('[Counter Component] Increment', props<{ newItem: CarItem }>());
export const decrement = createAction('[Counter Component] Decrement', props<{ newItem: CarItem }>());
export const deleteItem = createAction('[Counter Component] Delete', props<{ newItem: CarItem }>());
export const clearCart = createAction('[Cart] Clear Cart');

export const addItem = createAction(
    '[ADD ITEM] Adiciona item',
    props<{ newItem: CarItem }>()
)
