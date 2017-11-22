import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsOrdersPage } from './fs-orders';
import { ComponentsModule } from "../../../components/food-staff/components.module";

@NgModule({
  declarations: [
    FsOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(FsOrdersPage),
    ComponentsModule
  ],
})
export class FsOrdersPageModule { }
