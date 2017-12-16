import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import 'firebase/firestore';

import { FIREBASE_PATH } from "../app-constant"; 
import { FirebaseQuery, FirebaseOrder } from '../interfaces/firebase';
import { Observable } from 'rxjs/Observable';

// import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class FirebaseServiceProvider {

  db: firebase.firestore.Firestore;
  isUseFakeData = true;
  isTestingPhase = false;
  constructor(
    // private agf: AngularFirestore
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyDMEZoEtmor-T166lP9bGCR9FxqQP4eGik",
      authDomain: "bistrodancerapp.firebaseapp.com",
      databaseURL: "https://bistrodancerapp.firebaseio.com",
      projectId: "bistrodancerapp",
      storageBucket: "bistrodancerapp.appspot.com",
      messagingSenderId: "773087969883"
    });
    this.db = firebase.firestore();

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

  addDocument(collection: string, documentId: string, value: any): Promise<any> {
    console.log("firebase add document", collection, documentId);
    // this.progressController.add();
    return this.db.collection(collection).doc(documentId).set(value).then(success => {
      // this.progressController.subtract();
    }, error => {
      // this.progressController.subtract();
    })
  }


  getDocument(path: string): Promise<any> {
    console.log("firebase get document", path);
    // this.progressController.add();
    return new Promise((resolve, reject) => {
      this.db.doc(path).get().then(success => {
        console.log("get document succsess", success.data());
        if (success.exists) {
          let result = success.data();
          result.id = success.id;
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

  getCollection(path: string): Promise<any> {
    console.log("firebase get collection", path);
    // this.progressController.add();
    return new Promise((resolve, reject) => {
      this.db.collection(path).get().then(querySnapshot => {
        console.log("firebase get collection success", querySnapshot);
        let result = [];
        querySnapshot.forEach(doc => {
          let element = doc.data();
          element.id = doc.id;
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
    return  Observable.create(observer => {
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
    })

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

  getAllProductInRestaurant(restId: string): Promise<any> {
    return this.getCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD);
  }

  fetchAllProductInRestaurant(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/" + restId + "/" + FIREBASE_PATH.FOOD);
  }

  fetchProductCategories(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_CATEGORY);
  }

  fetchProductOptions(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_OPTION);
  }
  
  fetchProductSales(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_SALE);
  }

  fetchProductSizes(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_SIZE);
  }

  fetchProductStates(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_STATE);
  }

  fetchProductTypes(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_TYPE);
  }

  fetchProductUnits(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.PRODUCT + "/"  + restId + "/" + FIREBASE_PATH.FOOD_UNIT);
  }

  fetchAllTableRestaurant(restId: string):Observable<any>{
    return this.fetchCollection(FIREBASE_PATH.RESTAURANT + "/" + restId + "/" + FIREBASE_PATH.TABLE);
  }

}
