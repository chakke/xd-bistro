import { NgModule } from '@angular/core';
import { TitlePipe } from './title/title';
import { PricePipe } from './price/price';
@NgModule({
    declarations: [TitlePipe,
    PricePipe],
    imports: [],
    exports: [TitlePipe,
    PricePipe]
})
export class PipesModule { }
