import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Tab1Component } from "../../components/tab1/tab1";
import { Tab2Component } from "../../components/tab2/tab2";
import { Tab3Component } from "../../components/tab3/tab3";

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
  icaStores: Store[] = [{ storeName: "ICA Nära Blå Center", latitude: 63.170277, longitude: 14.665546 }, { storeName: "ICA Supermarket Traktören", latitude: 63.179331, longitude: 14.640339 }, { storeName: "ICA Kvantum Lillänge", latitude: 63.170730, longitude: 14.691163 }, { storeName: "ICA Supermarket Matmästaren", latitude: 63.179777, longitude: 14.651969 }, { storeName: "ICA Maxi Stormarknad", latitude: 63.193120, longitude: 14.653036 }, {storeName: "ICA Supermarket Odenhallen", latitude: 63.155881, longitude: 14.683254}]

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {
    this.tab1 = Tab1Component;
    this.tab2 = Tab2Component;
    this.tab3 = Tab3Component
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  addStores() {
    this.icaStores.forEach(store => {
      this.addMarker(store)
    })
  }

  addMarker(store: Store) {
    const content: string = "<h4>" + store.storeName + "</h4>"
    const postition = new google.maps.LatLng(store.latitude, store.longitude);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: postition,
    });

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content) {

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

  getMapOptions(position?: Geoposition) {
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

  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.getMapOptions(position));
      this.addStores();
    }, (err) => {
      console.log(err);
    });

  }

}