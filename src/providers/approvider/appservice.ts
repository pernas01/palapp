import { Injectable } from '@angular/core';
import { Store } from '../../shared/interfaces';
import { } from "googlemaps";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {

  private stores: Store[] = [{ id: "1", storeName: "ICA Nära Blå Center", latitude: 63.170277, longitude: 14.665546, adverts: [], showAdverts: false },
  { id: "2", storeName: "ICA Supermarket Traktören", latitude: 63.179331, longitude: 14.640339, adverts: [{ imageUrl: "img1" }, { imageUrl: "img2" }, { imageUrl: "img4562" }], showAdverts: false },
  { id: "3", storeName: "ICA Kvantum Lillänge", latitude: 63.170730, longitude: 14.691163, adverts: [{ imageUrl: "img3" }], showAdverts: false },
  { id: "4", storeName: "ICA Supermarket Matmästaren", latitude: 63.179777, longitude: 14.651969, adverts: [], showAdverts: false },
  { id: "5", storeName: "ICA Maxi Stormarknad", latitude: 63.193120, longitude: 14.653036, adverts: [{ imageUrl: "img4"}, {imageUrl: "img44541"}, {imageUrl: "img4"}, {imageUrl: "img4" }], showAdverts: false },
  { id: "6", storeName: "ICA Supermarket Odenhallen", latitude: 63.155881, longitude: 14.683254, adverts: [{ imageUrl: "img5"}, {imageUrl: "img4456413"}, {imageUrl: "img4" }], showAdverts: false }];
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
