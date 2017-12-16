import { Component, ElementRef, Renderer } from '@angular/core';

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
  }

  scrollTop() {
    if (this.scrollContent) {
      let currentTop = this.scrollContent.scrollTop;
      let a = currentTop * 4 / this.scrollDuration / this.scrollDuration;
      let vMax = 2 * currentTop / this.scrollDuration;
      let v = 0;
      let debounceTime = 16;
      let startTime = Date.now();
      let intervalCount = 0;
      console.log("vmax", vMax);
      let interval = setInterval(() => {
        intervalCount++;
        if(this.scrollContent.scrollTop == 0){
          clearInterval(interval);
          console.log("time: ", Date.now() - startTime);
          console.log("count: ", intervalCount);
        }
        v += a * debounceTime;
        if (v >= vMax) {
          a = -a;
        }
        if (v <= 0) {
          this.scrollContent.scrollTop = 0;
          clearTimeout(interval);
          console.log("time: ", Date.now() - startTime);
          console.log("count: ", intervalCount);
        }else{
          this.scrollContent.scrollTop = this.scrollContent.scrollTop - v * debounceTime; 
        }
      }, debounceTime)
    }
  }
}
