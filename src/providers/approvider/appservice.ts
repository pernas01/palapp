import { Injectable } from '@angular/core';
import { Store, AdvertImg } from '../../shared/interfaces';
import { } from "googlemaps";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import moment from "moment";

@Injectable()
export class AppService {

  private stores: Store[] = [{ id: "2", storeName: "ICA Nära Blå Center", address: "Tegelbruksvägen 10, 831 47 Östersund", phone: "063-19 45 55", latitude: 63.170065, longitude: 14.663709, adverts: [{ id: "1", imageUrl: "assets/imgs/adverts/10percent.png" }, { id: "2", imageUrl: "assets/imgs/adverts/chips.png"}, {id: "5", imageUrl: "assets/imgs/adverts/coffee.png"}], showAdverts: false },
  { id: "3", storeName: "ICA Supermarket Traktören", address: "Kyrkgatan 46, 831 31 Östersund", phone: "063-12 00 50", latitude: 63.179275, longitude: 14.638412, adverts: [{ id: "1", imageUrl: "assets/imgs/adverts/10percent.png" }, {id: "4", imageUrl: "assets/imgs/adverts/chocolate.png" }, {id: "6", imageUrl: "assets/imgs/adverts/digestive.png" }], showAdverts: false },
  { id: "4", storeName: "ICA Kvantum Lillänge", address: "Hagvägen 13, 831 48 Östersund", phone: "063-685 66 00", latitude: 63.170730, longitude: 14.691163, adverts: [{id: "3", imageUrl: "assets/imgs/adverts/5percent.png" }, {id: "5",imageUrl: "assets/imgs/adverts/coffee.png"}, {id: "2", imageUrl: "assets/imgs/adverts/chips.png"}], showAdverts: false },
  { id: "5", storeName: "ICA Supermarket Matmästaren", address: "Samuel Permans Gata 26, 831 42 Östersund", phone: "063-51 65 00", latitude: 63.179791, longitude: 14.650953, adverts: [{id: "1", imageUrl: "assets/imgs/adverts/10percent.png" }, {id: "6", imageUrl: "assets/imgs/adverts/digestive.png"}, { id: "4", imageUrl: "assets/imgs/adverts/chocolate.png"}], showAdverts: false },
  { id: "1", storeName: "ICA Maxi Stormarknad", address: "Arenavägen 19, 831 32 Östersund", phone: "063-57 76 00", latitude: 63.192805, longitude: 14.651058, adverts: [{id: "3", imageUrl: "assets/imgs/adverts/5percent.png"}, {id: "5",imageUrl: "assets/imgs/adverts/coffee.png"}, {id: "4", imageUrl: "assets/imgs/adverts/chocolate.png"}], showAdverts: false },
  { id: "6", storeName: "ICA Supermarket Odenhallen", address: "Slåttervägen 31, 831 61 Östersund", phone: "063-19 95 30", latitude: 63.155881, longitude: 14.683254, adverts: [{id: "3", imageUrl: "assets/imgs/adverts/5percent.png"}, {id: "6", imageUrl: "assets/imgs/adverts/digestive.png"}, {id: "2", imageUrl: "assets/imgs/adverts/chips.png" }], showAdverts: false }];
  private adverts: AdvertImg[] = [{ id: "1", imageUrl: "assets/imgs/adverts/chips.png"}, { id: "2", imageUrl: "assets/imgs/adverts/10percent.png" }, {id: "3", imageUrl: "assets/imgs/adverts/5percent.png"}, {id: "4", imageUrl: "assets/imgs/adverts/coffee.png"}, {id: "5", imageUrl: "assets/imgs/adverts/chocolate.png" }, {id: "6", imageUrl: "assets/imgs/adverts/digestive.png"}];
  private visableWindows: google.maps.InfoWindow[] = [];
  private choosenStore: Store;
  private chooseStore: Subject<Store> = new Subject();
  private readonly startWeek = 11;
  private readonly endOfTestTrial = moment("2019-06-01");
  constructor() { 
    this.updateAdvertOnStores();
  }

  public updateAdvertOnStores() {
    const week = moment().week()
    // const week = moment("2019-04-25").week();
    this.stores.forEach((s: Store) => this.setAdvertOnStore(s, this.getIdFromWeek(week)));
  }

  public getEndOfTrial() {
    return this.endOfTestTrial;
  }

  private setAdvertOnStore(store: Store, currentWeekId: number) {    
    let currentAdvertId: number = this.calcAdvertId(currentWeekId);
    const advertId = this.calcAdvertOffset(currentAdvertId, store);
    const newAdvert = this.adverts.find(a => +a.id === advertId);
    store.adverts = [newAdvert];
  }

  private calcAdvertOffset(currentAdvertId: number, store: Store): number {
    // const offset = 6 - +store.id + 1;
    // return currentAdvertId + offset > 6 ? (currentAdvertId + offset)%6 : currentAdvertId + offset;
    switch(+store.id) {
      case 1:
      return currentAdvertId;
      case 2:
      return currentAdvertId + 5 > 6 ? (currentAdvertId + 5)%6 : currentAdvertId + 5;
      case 3:
      return currentAdvertId + 4 > 6 ? (currentAdvertId + 4)%6 : currentAdvertId + 4;
      case 4:
      return currentAdvertId + 3 > 6 ? (currentAdvertId + 3)%6 : currentAdvertId + 3;
      case 5:
      return currentAdvertId + 2 > 6 ? (currentAdvertId + 2)%6 : currentAdvertId + 2;
      case 6:
      return currentAdvertId + 1 > 6 ? (currentAdvertId + 1)%6 : currentAdvertId + 1;
    }
  }

  private calcAdvertId(currentWeekId: number): number {
    const startWeekId = this.getIdFromWeek(this.startWeek);
    let advertIdStore1 = 1;
    if(startWeekId > currentWeekId) 
    {
      advertIdStore1 = 6 - (startWeekId - currentWeekId - 1);
    } else if(currentWeekId > startWeekId)
    {
      advertIdStore1 = currentWeekId - startWeekId + 1;
    }
    return advertIdStore1;
  }

  private getIdFromWeek(weekNumber: number): number {
    return weekNumber > 6 ? (weekNumber%6)+1 : weekNumber;
  }

  getStores(): Store[] {
    return this.stores;
  }

  resetShowStoreAdverts() {
    this.stores.forEach(s => s.showAdverts = false);
  }

  getVisableInfos(): google.maps.InfoWindow[] {
    return this.visableWindows;
  }

  setChoosenStore(infoWindow: google.maps.InfoWindow) {
    const icaStore: Store = this.stores.find(store => infoWindow.getContent().toString().includes(store.storeName));
    if (icaStore !== undefined) {
      this.choosenStore = icaStore;
      this.chooseStore.next(icaStore);
    }
  }

  getWhenStoreIsChoosen(): Observable<Store> {
    return this.chooseStore.asObservable();
  }

  getChoosenStore(): Store | undefined {
    return this.choosenStore;
  }

  removeChoosenStore() {
    this.choosenStore = undefined;
  }

  setVisableInfos(infos: google.maps.InfoWindow[]) {
    if (this.choosenStore === undefined) {
      this.visableWindows = infos;
    }
  }

  getVisableStores(): Store[] {
    if(this.choosenStore !== undefined) {
      return [this.choosenStore];
    }
    return this.getStoresInMap();
  }

  getStoresInMap(): Store[] {
    let visableStores: Store[] = []
    this.visableWindows.forEach(w => {
      visableStores.push(this.stores.find(s => w.getContent().toString().includes(s.storeName)));
    })
    return visableStores;
  }
}
