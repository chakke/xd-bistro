import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefFoodOrdersPage } from './fs-chef-food-orders';
import { ComponentsModule } from "../../../components/food-staff/components.module";

@NgModule({
  declarations: [
    FsChefFoodOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefFoodOrdersPage),
    ComponentsModule
  ],
})
export class FsChefFoodOrdersPageModule { }
