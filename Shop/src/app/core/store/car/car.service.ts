import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as carActions from './car-actions';
import * as carSelector from './car-selectors';
import { Observable } from 'rxjs';
import { CarItem } from '../../data/models/car-model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private store: Store<any>) { }

  public addNewItem(newItem: CarItem) {
    this.store.dispatch(
      carActions.addItem({
        newItem: {...newItem, quantity: newItem.quantity || 1}
      }));
  }
  public incrementItem(item: CarItem) {
    this.store.dispatch(
      carActions.increment({
        newItem: {...item}
      }));
  }

  public decrementItem(item: CarItem) {
    this.store.dispatch(
      carActions.decrement({
        newItem: {...item}
      }));
  }

  public deleteItemcar(item: CarItem) {
    this.store.dispatch(
      carActions.deleteItem({
        newItem: {...item}
      }));
  }

  public selectCarItems$(): Observable<[]> {
    return this.store.select(carSelector.selectCarItems);
  }

  public clearCar() {
    this.store.dispatch(carActions.clearCart());
  }

}
