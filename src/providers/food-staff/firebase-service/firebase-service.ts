import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import 'firebase/firestore';

import { FIREBASE_PATH, FOOD_ORDER_STATE } from "../app-constant";
import { FirebaseQuery, FirebaseOrder } from '../interfaces/firebase';
import { Observable } from 'rxjs/Observable';
import { Order } from '../classes/order';
import { Product, FoodOrder } from '../classes/product';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class FirebaseServiceProvider {

  db: firebase.firestore.Firestore;
  isUseFakeData = true;
  isTestingPhase = false;
  todayString: string;
  constructor(
    // private agf: AngularFirestore
  ) {
    firebase.initializeApp({
      // apiKey: "AIzaSyDG_pauTdXELEjd-kB2FuEji4PJUURVQ78",
      // authDomain: "bistro-dancer.firebaseapp.com",
      // databaseURL: "https://bistro-dancer.firebaseio.com",
      // projectId: "bistro-dancer",
      // storageBucket: "bistro-dancer.appspot.com",
      // messagingSenderId: "796575514827"
  
      apiKey: "AIzaSyDMEZoEtmor-T166lP9bGCR9FxqQP4eGik",
      authDomain: "bistrodancerapp.firebaseapp.com",
      databaseURL: "https://bistrodancerapp.firebaseio.com",
      projectId: "bistrodancerapp",
      storageBucket: "bistrodancerapp.appspot.com",
      messagingSenderId: "773087969883"
    });
    this.db = firebase.firestore();

    let today = new Date();
    this.todayString = "";
    this.todayString += today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    this.todayString += (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
    this.todayString += today.getFullYear();

    //test
    if (this.isTestingPhase) {
      this.fetchCollection(FIREBASE_PATH.PRODUCT + "/bistro/" + FIREBASE_PATH.FOOD).subscribe(data => {
        console.log("hey, this is fucker food data from observable", data);
      });
    }

  }

  getNewId(type: string): string {
    return type + Date.now();
  }

  getNewFirebaseDocumentId() {
    return this.db.collection('_').doc().id;
  }
  addDocument(collection: string, value: any, documentId?: string): Promise<any> {
    console.log("firebase add document", collection, documentId);
    // this.progressController.add();
    if (documentId) {
      value["firebase_id"] = documentId;
      value["id"] = documentId;
      return this.db.collection(collection).doc(documentId).set(value).then(success => {
        // this.progressController.subtract();
      }, error => {
        // this.progressController.subtract();
      })
    } else {
      let newRef = this.db.collection(collection).doc();
      value["firebase_id"] = newRef.id;
      value["id"] = newRef.id;
      return newRef.set(value).then(success => {
        // this.progressController.subtract();
      }, error => {
        // this.progressController.subtract();
      })
    }

  }

  getDocument(path: string): Promise<any> {
    console.log("firebase get document", path);
    // this.progressController.add();
    return new Promise((resolve, reject) => {
      this.db.doc(path).get().then(success => {
        console.log("get document succsess", success.data());
        if (success.exists) {
          let result = success.data();
          resolve(result);
        } else {
          reject("Bản ghi không tồn tại");
        }
        // this.progressController.subtract();
      }, error => {
        // this.progressController.subtract();
        console.log("get fail", error);
        reject(error);
      })
    })
  }

  updateDocument(path: string, data: any): Promise<any> {
    console.log("firebase update document", path);
    // this.progressController.add();
    return new Promise((resolve, reject) => {
      this.db.doc(path).update(data).then(success => {
        console.log("update succsess", success);
        resolve();
        // this.progressController.subtract();
      }, error => {
        // this.progressController.subtract();
        console.log("update fail", error);
        reject();
      })
    })
  }

  deleteDocument(path: string): Promise<any> {
    console.log("firebase delete document", path);
    // this.progressController.add();
    return new Promise((resolve, reject) => {
      this.db.doc(path).delete().then(success => {
        console.log("delete succsess", success);
        resolve();
        // this.progressController.subtract();
      }, error => {
        // this.progressController.subtract();
        console.log("delete fail", error);
        reject();
      })
    })
  }

  getCollection(path: string, queries?: Array<FirebaseQuery>, orders?: Array<FirebaseOrder>, limit?: number): Promise<any> {
    console.log("firebase get collection", path);
    // this.progressController.add();
    return new Promise((resolve, reject) => {
      let ref = this.db.collection(path) as firebase.firestore.Query;
      if (queries) {
        queries.forEach(query => {
          ref = ref.where(query.field, query.operator, query.value);
        });
      }
      if (orders) {
        orders.forEach(order => {
          ref = ref.orderBy(order.field, order.direction);
        });
      }
      if (limit) {
        ref = ref.limit(limit);
      }
      ref.get().then(querySnapshot => {
        console.log("firebase get collection success", querySnapshot);
        let result = [];
        querySnapshot.forEach(doc => {
          let element = doc.data();
          result.push(element);
        })
        // this.progressController.subtract();
        resolve(result);
      }, error => {
        // this.progressController.subtract();
        console.log("get collection fail", error);
        reject(error);
      })
    })
  }

  fetchCollection(path: string, queries?: Array<FirebaseQuery>, orders?: Array<FirebaseOrder>, limit?: number): Observable<any> {
    return Observable.create(observer => {
      //Chú ý rằng trong query chỉ áp dụng range filter cho 1 field (<, >, <=, >=)
      //Nếu query có range filter thì orderBy đầu tiên phải order theo field của range filter đó
      let ref = this.db.collection(path) as firebase.firestore.Query;
      if (queries) {
        queries.forEach(query => {
          ref = ref.where(query.field, query.operator, query.value);
        });
      }
      if (orders) {
        orders.forEach(order => {
          ref = ref.orderBy(order.field, order.direction);
        });
      }
      if (limit) {
        ref = ref.limit(limit);
      }
      ref.onSnapshot(observer);
    });
  }

  loginWithFacebook(accesstoken): Promise<any> {
    if (this.isUseFakeData) {

    }
    let facebookCredential = firebase.auth.FacebookAuthProvider.credential(accesstoken);
    return firebase.auth().signInWithCredential(facebookCredential);
  }

  loginWithGoogle(accesstoken): Promise<any> {
    if (this.isUseFakeData) {

    }
    let googleCredential = firebase.auth.GoogleAuthProvider.credential(null, accesstoken);
    return firebase.auth().signInWithCredential(googleCredential);
  }

  loginWithAccountPassword(email: string, password: string): Promise<any> {
    if (this.isUseFakeData) {

    }
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  getUserInRestaurant(email: string) {
    console.log("Fuckoff");
    return this.getCollection(FIREBASE_PATH.RESTAURANT + "/bistro/" + FIREBASE_PATH.STAFF, [{
      field: "email",
      operator: "==",
      value: email
    }])
    // return this.getCollection(FIREBASE_PATH.RESTAURANT + "/bistro/" + FIREBASE_PATH.STAFF);
  }

  getAllProductInRestaurant(restId: string): Promise<any> {
    return this.getCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD);
  }

  fetchAllStaffInRestaurant(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.RESTAURANT + "/" + restId + "/" + FIREBASE_PATH.STAFF);
  }

  fetchAllProductInRestaurant(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD);
  }

  fetchProductCategories(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_CATEGORY);
  }

  fetchProductOptions(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_OPTION);
  }

  fetchProductSales(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_SALE);
  }

  fetchProductSizes(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_SIZE);
  }

  fetchProductStates(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_STATE);
  }

  fetchProductTypes(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_TYPE);
  }

  fetchProductUnits(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD_UNIT);
  }

  fetchAllTableRestaurant(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.RESTAURANT + "/" + restId + "/" + FIREBASE_PATH.TABLE);
  }

  fetchAllOrderRestaurant(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.ORDER + "/" + restId + "/" + this.todayString);
  }

  fetchAllFoodOrderInRestaurant(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.FOOD_ORDER + "/" + restId + "/" + this.todayString);
  }

  fetchAreas(restId: string): Observable<any> {
    return this.fetchCollection(FIREBASE_PATH.RESTAURANT + "/" + restId + "/" + FIREBASE_PATH.AREA);
  }

  addOrder(restId: string, order: Order): Promise<any> {
    return this.addDocument(FIREBASE_PATH.ORDER + "/" + restId + "/" + this.todayString, {
      id: order.id,
      description: order.descrition,
      state: order.state,
      type: order.type,
      time_create: order.timeCreate,
      area_id: order.areaId,
      table_ids: order.tableIds,
      staff_id: order.staffId,
      note: order.note,
      customer_phone: order.custormerPhone,
      customer_name: order.custormerName,
      customer_id: order.custormerId,
      number_customers: order.numberCustormer
    });
  }

  addFoodOrder(restId: string, orderId: string, staffId: string, product: FoodOrder): Promise<any> {
    var newId = this.getNewFirebaseDocumentId();
    return this.addDocument(FIREBASE_PATH.FOOD_ORDER + "/" + restId + "/" + this.todayString, {
      id: newId,
      order_id: orderId,
      staff_id: staffId,
      state: FOOD_ORDER_STATE.WAITING,
      amount_order: product.amountOrder,
      amount_done: product.amountDone,
      amount_return: product.amountReturn,
      amount_processing: product.amountProcessing,
      food_id: product.foodId,
      price: product.price,
      sale: product.sale,
      options: product.options,
      note: product.note,
      time_create: product.timeCreate
    }, newId);
  }

  removeFoodOrder(restId: string,firebaseId: string): Promise<any>{
    return this.deleteDocument(FIREBASE_PATH.FOOD_ORDER + "/" + restId + "/" + this.todayString + "/" + firebaseId);
  }

  updateFoodOrder(restId: string, firebaseId: string, value: any): Promise<any> {
    return this.updateDocument(FIREBASE_PATH.FOOD_ORDER + "/" + restId + "/" + this.todayString + "/" + firebaseId, value);
  }

  updateProduct(restId: string, firebaseId: string, value: any): Promise<any> {
    return this.updateDocument(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD + "/" + firebaseId, value);
  }

}
