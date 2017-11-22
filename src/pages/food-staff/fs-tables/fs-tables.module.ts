import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsTablesPage } from './fs-tables';
import { ComponentsModule } from "../../../components/food-staff/components.module";

@NgModule({
  declarations: [
    FsTablesPage,
  ],
  imports: [
    IonicPageModule.forChild(FsTablesPage),
    ComponentsModule
  ],
})
export class FsTablesPageModule { }
