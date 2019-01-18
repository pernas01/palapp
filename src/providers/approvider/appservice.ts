import { Injectable } from '@angular/core';
import { Store, AdvertImg } from '../../shared/interfaces';
import { } from "googlemaps";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {

  private icaStores: Store[] = [{ id:"1", storeName: "ICA Nära Blå Center", latitude: 63.170277, longitude: 14.665546 }, { id:"2", storeName: "ICA Supermarket Traktören", latitude: 63.179331, longitude: 14.640339 }, { id:"3", storeName: "ICA Kvantum Lillänge", latitude: 63.170730, longitude: 14.691163 }, { id:"4", storeName: "ICA Supermarket Matmästaren", latitude: 63.179777, longitude: 14.651969 }, { id:"5", storeName: "ICA Maxi Stormarknad", latitude: 63.193120, longitude: 14.653036 }, { id:"6", storeName: "ICA Supermarket Odenhallen", latitude: 63.155881, longitude: 14.683254 }]
  private visableWindows: google.maps.InfoWindow[] = []
  private adverts: AdvertImg[] = [{storeId: "2", imageUrl: "img1"}, {storeId: "2", imageUrl: "img2"}, {storeId: "3", imageUrl: "img3"}, {storeId: "5", imageUrl: "img4"}, {storeId: "6", imageUrl: "img5"}]
  private choosenStore: Store;
  private chooseStore: Subject<Store> = new Subject();
  constructor() { }

  getStores(): Store[] {
    return this.icaStores;
  }

  getVisableInfos(): google.maps.InfoWindow[] {
    return this.visableWindows;
  }

  getVisableStores(): Store[] {
    let visableStores: Store[] = []
    this.visableWindows.forEach(w => {
        visableStores.push(this.icaStores.find(s => w.getContent().toString().includes(s.storeName)));
    })
    return visableStores;
  }

  setChoosenStore(infoWindow: google.maps.InfoWindow) {    
    const icaStore: Store = this.icaStores.find(store => infoWindow.getContent().toString().includes(store.storeName));
    if(icaStore !== undefined) {
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

  setVisableInfos(infos: google.maps.InfoWindow[]){
    if(this.choosenStore === undefined) {
    this.visableWindows = infos;
    }
  }

  getAdverts(): AdvertImg[] {
    if(this.choosenStore !== undefined) {
      return this.adverts.filter(a => a.storeId === this.choosenStore.id);
    }
    return this.adverts.filter(a => this.getVisableStores().some(s => s.id === a.storeId));
  }

}
