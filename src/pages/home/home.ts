import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var google;

interface Store { storeName: string, latitude: number, longitude: number };

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  tab1: any;
  tab2: any;
  tab3: any;
  useStaticMap = true;
  infoWindows = [];
  markers = [];
  icaStores: Store[] = [{ storeName: "ICA Nära Blå Center", latitude: 63.170277, longitude: 14.665546 }, { storeName: "ICA Supermarket Traktören", latitude: 63.179331, longitude: 14.640339 }, { storeName: "ICA Kvantum Lillänge", latitude: 63.170730, longitude: 14.691163 }, { storeName: "ICA Supermarket Matmästaren", latitude: 63.179777, longitude: 14.651969 }, { storeName: "ICA Maxi Stormarknad", latitude: 63.193120, longitude: 14.653036 }, { storeName: "ICA Supermarket Odenhallen", latitude: 63.155881, longitude: 14.683254 }]

  constructor(public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  private addStores() {
    this.icaStores.forEach(store => {
      this.addMarker(store)
    })
  }

  private addMarker(store: Store) {
    const content: string = "<h4>" + store.storeName + "</h4>"
    const postition = new google.maps.LatLng(store.latitude, store.longitude);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: postition,
    });

    this.addInfoWindow(marker, content);
    this.markers.push(marker);
  }

  private addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindows.forEach(info => info.close());
      infoWindow.open(this.map, marker);
      this.map.setZoom(14);
      this.map.setCenter(marker.getPosition());
    });

    google.maps.event.addListener(infoWindow, 'closeclick', () => {
      this.map.setOptions(this.getMapOptions());
    });

    this.infoWindows.push(infoWindow);
  }

  private getMapOptions(position?: Geoposition) {
    const ostersundCenter = { latitude: 63.178269, longitude: 14.655431 }
    let startCoordinates = null;

    if (this.useStaticMap || position === null) {
      startCoordinates = new google.maps.LatLng(ostersundCenter.latitude, ostersundCenter.longitude);
    } else {
      startCoordinates = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    }

    const mapOptions = {
      center: startCoordinates,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID
    }

    return mapOptions;
  }

  activateMenu(s: string){}

  private loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.getMapOptions(position));
      this.addStores();
      this.map.addListener('bounds_changed', () => console.log("bounds_changed", this.markers.filter(m => this.checkMarkerVisibility(m)))
      );
    }, (err) => {
      console.log(err);
    });

  }

  private checkMarkerVisibility(marker: any): boolean {
    if (this.map != null) {
      const latLongBounds = this.map.getBounds();

      if (latLongBounds.contains(marker.getPosition()))
        return true;
      else
        return false;
    }
    return false;
  }

}