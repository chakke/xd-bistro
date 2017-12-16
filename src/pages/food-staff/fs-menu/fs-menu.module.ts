import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsMenuPage } from './fs-menu';
import { ComponentsModule } from "../../../components/food-staff/components.module";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    FsMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(FsMenuPage),
    ComponentsModule,
    PipesModule
  ],
})
export class FsMenuPageModule { }
