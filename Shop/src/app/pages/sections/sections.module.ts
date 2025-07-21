import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionsRoutingModule } from './sections-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';

import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SectionsComponent } from './containers/sections/sections.component';
import { WomensComponent } from './components/womens/womens.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { PriceCopPipe } from 'src/app/core/pipes/price-cop.pipe';

@NgModule({
  declarations: [
    SectionsComponent,
    WomensComponent,
    CheckoutComponent,
    ItemDetailComponent,
    PriceCopPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SectionsRoutingModule,
    SharedModule,

    ReactiveFormsModule,

    MatRadioModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class SectionsModule { }
