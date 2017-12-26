import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefOrdersPage } from './fs-chef-orders';
import { ComponentsModule } from "../../../components/food-staff/components.module";

@NgModule({
  declarations: [
    FsChefOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefOrdersPage),
    ComponentsModule
  ],
})
export class FsChefOrdersPageModule { }
