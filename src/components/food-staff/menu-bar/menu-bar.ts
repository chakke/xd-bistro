import { Component, Input, EventEmitter, Output } from '@angular/core';

/**
 * Generated class for the MenuBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
export interface MenuItem {
  id: number;
  name: string;
}
@Component({
  selector: 'menu-bar',
  templateUrl: 'menu-bar.html'
})
export class MenuBarComponent {
  @Input() menuItems: Array<MenuItem>;
  @Output() menuChange: EventEmitter<number> = new EventEmitter<number>();

  text: string;
  selectedItem: number = 0;
  scrollElem: HTMLElement;
  animateElem: HTMLElement;
  middle: number = screen.width / 2;
  constructor() {
    console.log('Hello MenuBarComponent Component');
    this.text = 'Hello World';

  }

  selectItem(item, index) {
    this.selectedItem = index;
    this.menuChange.next(item.id);
    this.tranformAnimateBar();
  }

  ngAfterViewInit() {
    this.scrollElem = document.getElementById("menuBar");
    this.animateElem = document.getElementById("animateBar");
  
    if(this.animateElem && this.scrollElem){
      this.animateElem.style.width = this.scrollElem.children[this.selectedItem].clientWidth + "px";
    }
    this.tranformAnimateBar();
  }

  tranformAnimateBar() {
    if (this.scrollElem) {
      console.log("children: ", this.scrollElem.children);

      var distance: number = 0;
      if (this.selectedItem > 0) {
        for (let i = 0; i < this.selectedItem; i++) {
          distance += this.scrollElem.children[i].clientWidth;
        }
      } else {
        distance = 0;
      }

      if (this.animateElem) {
        console.log("width", this.scrollElem.children[this.selectedItem].clientWidth);

        this.animateElem.style.width = this.scrollElem.children[this.selectedItem].clientWidth + "px";

        console.log("distance", distance);

        this.animateElem.style.transform = "translate(" + distance + "px" + ",0)";


        var dx = (screen.width - this.scrollElem.children[this.selectedItem].clientWidth) / 2;
        distance = distance - dx;
        this.scrollLeft(distance);

      }
    }
  }

  scrollLeft(distance) {
    this.scrollElem.scrollTo({
      left: distance,
      behavior: "smooth"
    });
  }
}
