import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefFoodOrderDetailPage } from './fs-chef-food-order-detail';
import { ComponentsModule } from "../../../components/food-staff/components.module";
@NgModule({
  declarations: [
    FsChefFoodOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefFoodOrderDetailPage),
    ComponentsModule
  ],
})
export class FsChefFoodOrderDetailPageModule {}
