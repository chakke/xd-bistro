import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
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

  @Input()
  ionContent;

  @Output()
  onSearch = new EventEmitter<string>();

  constructor(private appController: AppControllerProvider, private navCtrl: NavController) {
  }
  ngAfterViewInit() {
    this.backButton = this.backButtons[this.backButtonType];
    // this.user = this.appController.getUserService().getUser();
    this.getOrderLength();
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
    if (this.ionContent) {
      this.ionContent = this.ionContent as Content;
      this.ionContent.scrollToTop(300);
    }
  }

  openMenu() {
    // this.appController.setBackgroundForScrollContent("", "#FFF");
  }

}
