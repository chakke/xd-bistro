import { Component, ElementRef, Renderer } from '@angular/core';
import { AppModule } from '../../../providers/app-module';
declare global {
  interface HTMLElement {
    animateBezier: (x1, y1, x2, y2, propertive, target) => {};
  }
}

@Component({
  selector: 'scroll-to-top',
  templateUrl: 'scroll-to-top.html'
})
export class ScrollToTopComponent {

  showButton = false;
  scrollContent: HTMLElement;
  scrollDuration = 1000;
  constructor(private el: ElementRef, private renderer: Renderer) {

  }


  ngAfterViewInit() {
    // let scrollContent = document.querySelector('.show-page .scroll-content');
    HTMLElement.prototype.animateBezier = this.animateBezier;
    this.scrollContent = <HTMLElement>this.el.nativeElement.closest('.scroll-content');
    let height = this.scrollContent.clientHeight;
    if (this.scrollContent) {
      this.scrollContent.addEventListener('scroll', (event) => {
        let scrollTop = this.scrollContent.scrollTop;
        if (scrollTop > 0.8 * height) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      })
    }

    // let div = document.createElement("div");
    // div.style.position = "absolute";
    // div.style.width = "50px";
    // div.style.height = "50px";
    // div.style.backgroundColor = "green";
    // div.style.left = "20px";
    // div.style.top = "100px";
    // div.style.zIndex = "9999";
    // this.scrollContent.appendChild(div);
    // setTimeout(() => {
    //   div.animateBezier(1, 0, 0, 1, "top", 300);
    // }, 2000)
  }

  scrollTop() {
    if (this.scrollContent) {
      AppModule.getInstance().getScrollController().doScrollTop("",this.scrollContent);
    }
  }

  animateBezier(x1, y1, x2, y2, propertive, target) {
    let defaultTime = 1000;
    function caculateX(time: number) {
      return 3 * x1 * Math.pow(1 - time, 2) * time + 3 * x2 * (1 - time) * Math.pow(time, 2) + Math.pow(time, 3);
    }

    function caculateY(time: number) {
      return 3 * y1 * Math.pow(1 - time, 2) * time + 3 * y2 * (1 - time) * Math.pow(time, 2) + Math.pow(time, 3);
    }

    function caculateDistance(time) {
      return Math.sqrt(Math.pow(caculateX(time), 2) + Math.pow(caculateY(time), 2));
    }

    let debounceTime = 10;
    // let start = (<any>this).style[propertive];
    let start = 100;
    let distance = target - start;
    console.log("start animate", this, start, distance);
    let t = 0;
    let startTime = Date.now();
    let interval = setInterval(() => {
      t += debounceTime / defaultTime;
      // this[propertive] = start + caculateDistance(t) / Math.SQRT2 * distance;
      (<any>this).style[propertive] = start + caculateY(t) * distance + "px";
      console.log((<any>this).style[propertive]);
      if (t >= 1) {
        clearInterval(interval);
        console.log("end animate", Date.now() - startTime);
      }
    }, debounceTime);
    return null;
  }
}
