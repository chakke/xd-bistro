import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFoodToOrderPage } from './add-food-to-order';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    AddFoodToOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFoodToOrderPage),
    ComponentsModule
  ],
})
export class AddFoodToOrderPageModule { }
