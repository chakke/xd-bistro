import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateOrderPage } from './create-order';
import { ComponentsModule } from "../../../components/food-staff/components.module";

@NgModule({
  declarations: [
    CreateOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateOrderPage),
    ComponentsModule
  ],
})
export class CreateOrderPageModule { }
