import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { ActionReducer, ActionReducerMap, MetaReducer, StoreModule } from '@ngrx/store';
import { counterReducer } from './core/store/reducer';
import { carReducer } from './core/store/car/car-reducer'
import { localStorageSync } from 'ngrx-store-localstorage';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const reducers: ActionReducerMap<any> = {
  contadorCarrito: counterReducer,
  carrito: carReducer 
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync(
    {
      keys: [
        'contadorCarrito',
        'carrito'
      ],
      rehydrate: true
    }
  )(reducer)
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

