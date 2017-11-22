import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsNotificationPage } from './fs-notification';
import { ComponentsModule } from '../../../components/food-staff/components.module';
@NgModule({
  declarations: [
    FsNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(FsNotificationPage),
    ComponentsModule
  ],
})
export class FsNotificationPageModule { }
