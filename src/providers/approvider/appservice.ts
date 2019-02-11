import { Injectable } from '@angular/core';
import { Store } from '../../shared/interfaces';
import { } from "googlemaps";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {

  private stores: Store[] = [{ id: "1", storeName: "ICA Nära Blå Center", address: "Tegelbruksvägen 10, 831 47 Östersund", phone: "063-19 45 55", latitude: 63.170065, longitude: 14.663709, adverts: [{ imageUrl: "assets/imgs/adverts/10percent.png" }, {imageUrl: "assets/imgs/adverts/chips.png"}, {imageUrl: "assets/imgs/adverts/coffee.png"}], showAdverts: false },
  { id: "2", storeName: "ICA Supermarket Traktören", address: "Kyrkgatan 46, 831 31 Östersund", phone: "063-12 00 50", latitude: 63.179275, longitude: 14.638412, adverts: [{ imageUrl: "assets/imgs/adverts/10percent.png" }, { imageUrl: "assets/imgs/adverts/chocolate.png" }, { imageUrl: "assets/imgs/adverts/digestive.png" }], showAdverts: false },
  { id: "3", storeName: "ICA Kvantum Lillänge", address: "Hagvägen 13, 831 48 Östersund", phone: "063-685 66 00", latitude: 63.170730, longitude: 14.691163, adverts: [{ imageUrl: "assets/imgs/adverts/5percent.png" }, {imageUrl: "assets/imgs/adverts/coffee.png"}, {imageUrl: "assets/imgs/adverts/chips.png"}], showAdverts: false },
  { id: "4", storeName: "ICA Supermarket Matmästaren", address: "Samuel Permans Gata 26, 831 42 Östersund", phone: "063-51 65 00", latitude: 63.179791, longitude: 14.650953, adverts: [{ imageUrl: "assets/imgs/adverts/10percent.png" }, {imageUrl: "assets/imgs/adverts/digestive.png"}, {imageUrl: "assets/imgs/adverts/chocolate.png"}], showAdverts: false },
  { id: "5", storeName: "ICA Maxi Stormarknad", address: "Arenavägen 19, 831 32 Östersund", phone: "063-57 76 00", latitude: 63.192805, longitude: 14.651058, adverts: [{ imageUrl: "assets/imgs/adverts/5percent.png"}, {imageUrl: "assets/imgs/adverts/coffee.png"}, {imageUrl: "assets/imgs/adverts/chocolate.png"}], showAdverts: false },
  { id: "6", storeName: "ICA Supermarket Odenhallen", address: "Slåttervägen 31, 831 61 Östersund", phone: "063-19 95 30", latitude: 63.155881, longitude: 14.683254, adverts: [{ imageUrl: "assets/imgs/adverts/5percent.png"}, {imageUrl: "assets/imgs/adverts/digestive.png"}, {imageUrl: "assets/imgs/adverts/chips.png" }], showAdverts: false }];
  private visableWindows: google.maps.InfoWindow[] = [];
  private choosenStore: Store;
  private chooseStore: Subject<Store> = new Subject();
  constructor() { }

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
