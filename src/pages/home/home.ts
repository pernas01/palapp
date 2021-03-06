import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AppService } from '../../providers/approvider/appservice';
import { Store } from '../../shared/interfaces';
import { Platform } from 'ionic-angular';
import { } from "googlemaps";
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: google.maps.Map;
  useStaticMap = true;
  infoWindows: google.maps.InfoWindow[] = [];
  markers: google.maps.Marker[] = [];
  currentPositionMarker: google.maps.Marker;
  sub: Subscription;

  constructor(platForm: Platform, public geolocation: Geolocation, private service: AppService) {
    platForm.ready().then(() => {
      this.loadMap();  
    });
  }

  ionViewDidLeave(): void {
    this.sub.unsubscribe();
  }

  private addStores() {
    this.service.getStores().forEach(store => {
      this.addMarker(store)
    })
  }

  private addMarker(store: Store) {
    const content: string = "<h4>" + store.storeName + "</h4>"
    const position = new google.maps.LatLng(store.latitude, store.longitude);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position,
      icon: "assets/icon/ica_logo.ico"
    });

    this.addInfoWindowStore(marker, content);
    this.markers.push(marker);
  }

  private addInfoWindowStore(marker: google.maps.Marker, content) {

    let infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow({
      content: content,
      position: marker.getPosition()
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.infoWindows.forEach(info => info.close());
      infoWindow.open(this.map, marker);
      this.map.setZoom(14);
      this.map.setCenter(marker.getPosition());
      this.service.setChoosenStore(infoWindow);
    });

    google.maps.event.addListener(infoWindow, 'closeclick', () => {
      this.map.setOptions(this.getMapOptions());
      this.service.removeChoosenStore();
    });

    this.infoWindows.push(infoWindow);
  }

  private addInfoWindow(marker: google.maps.Marker, content) {

    let infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow({
      content: content,
      position: marker.getPosition()
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  private addCurrentPositionMarker(position: Geoposition) {
    const content: string = "<strong><p>" + "Denna figur kommer visa vart du är på kartan i realtid, här kan du även byta vad du är intresserad av just idag." + "</p></strong>"
    const pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    let marker = new google.maps.Marker({
      map: this.map,
      zIndex: 1,
      position: pos,
    });
    this.currentPositionMarker = marker;
    this.addInfoWindow(marker, content);
  }

  private getMapOptions(position?: Geoposition): google.maps.MapOptions {
    const ostersundCenter = { latitude: 63.178269, longitude: 14.655431 }
    let startCoordinates = null;

    if (this.useStaticMap || position === null) {
      startCoordinates = new google.maps.LatLng(ostersundCenter.latitude, ostersundCenter.longitude);
    } else {
      startCoordinates = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    }

    const mapOptions: google.maps.MapOptions = {
      center: startCoordinates,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      disableDefaultUI: true,
    }

    return mapOptions;
  }

  private loadMap() {

    this.geolocation.getCurrentPosition().then((position: Geoposition) => {
      const mapOptions = this.getMapOptions(position);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addStores();
      if (position) {
        this.addCurrentPositionMarker(position);
      }
      this.map.addListener('bounds_changed', () => {
        this.service.setVisableInfos(this.infoWindows.filter(i => this.checkInfoVisibility(i)));
      }
      );
    }, (err) => {
      console.log(err);
    });

    this.sub = this.geolocation.watchPosition().subscribe(
      pos => {
        let newCoordinates = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        this.currentPositionMarker.setPosition(newCoordinates);
      }
    );

  }

  private checkInfoVisibility(info: google.maps.InfoWindow): boolean {
    if (this.map != null && info !== null) {
      const latLongBounds = this.map.getBounds();
      if (latLongBounds.contains(info.getPosition()))
        return true;
      else
        return false;
    }
    return false;
  }

}