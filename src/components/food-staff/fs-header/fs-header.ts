import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@Component({
  selector: 'fs-header',
  templateUrl: 'fs-header.html'
})
export class FsHeaderComponent {

  orderedFood = [];
  searchKeyword = "";
  user: any;
  backButtons = ["arrow-back"];
  scrollContent: HTMLElement;

  @Input()
  placholder = "Tìm kiếm món ăn, dịch vụ, khuyến mãi";
  @Input()
  showSearchBar = false;
  @Input()
  title = "Bistro Dancer";
  @Input()
  showBackButton: number = 0;//0 == Không hiển thị; 1 == nút back; 2 == nút menu
  @Input()
  showOrder = false;

  //Just use 1 in 2 following propertives
  @Input()
  backButtonType = 0;
  @Input()
  backButton = "arrow-back";

  @Output()
  onSearch = new EventEmitter<string>();

  constructor(private el: ElementRef, private appController: AppControllerProvider, private navCtrl: NavController) {
  }
  ngAfterViewInit() {
    this.backButton = this.backButtons[this.backButtonType];
    // this.user = this.appController.getUserService().getUser();
    this.getOrderLength();
    let showPage = <HTMLElement>this.el.nativeElement.closest('.ion-page');
    if(showPage){
      this.scrollContent = showPage.querySelector('.scroll-content');
    }
  }
  search() {
    this.onSearch.emit(this.searchKeyword);
  }

  checkOrder() {
    if (this.user.isLoggedIn) {
      this.navCtrl.push("DcOrderPage");
    } else {
      this.navCtrl.push("DcLoginPage");
    }
  }

  getOrderLength() {
    // this.orderedFood = this.appController.getFoodService().getOrderedFoods();
  }
  scrollToTop() {
   if(this.scrollContent){
     this.scrollContent.scrollTop = 0;
   }
  }

  openMenu() {
    // this.appController.setBackgroundForScrollContent("", "#FFF");
  }

}
