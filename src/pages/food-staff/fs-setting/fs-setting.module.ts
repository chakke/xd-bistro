import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsSettingPage } from './fs-setting';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    FsSettingPage,
  ],
  imports: [
    IonicPageModule.forChild(FsSettingPage),
    ComponentsModule
  ],
})
export class FsSettingPageModule { }
