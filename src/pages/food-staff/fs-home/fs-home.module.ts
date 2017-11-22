import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsHomePage } from './fs-home';
import {ComponentsModule} from "../../../components/food-staff/components.module";

@NgModule({
  declarations: [
    FsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(FsHomePage),
    ComponentsModule
  ],
})
export class FsHomePageModule {}
