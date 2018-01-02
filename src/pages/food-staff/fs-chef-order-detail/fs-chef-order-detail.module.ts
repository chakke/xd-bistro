import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefOrderDetailPage } from './fs-chef-order-detail';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    FsChefOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefOrderDetailPage),
    ComponentsModule
  ],
})
export class FsChefOrderDetailPageModule { }
