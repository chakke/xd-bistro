import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsLoginPage } from './fs-login';
import { ComponentsModule } from "../../../components/food-staff/components.module";


@NgModule({
  declarations: [
    FsLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(FsLoginPage),
    ComponentsModule
  ],
})
export class FsLoginPageModule { }
