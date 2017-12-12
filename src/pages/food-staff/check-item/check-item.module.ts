import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckItemPage } from './check-item';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    CheckItemPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckItemPage),
    ComponentsModule
  ],
})
export class CheckItemPageModule { }
