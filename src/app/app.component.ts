import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AppService } from '../providers/approvider/appservice';
import { Store } from '../shared/interfaces';
import { ImageModalPage } from '../pages/image-modal/image-modal';
import { Storage } from '@ionic/storage';
import moment from 'moment';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;
  overlayHidden: boolean = false;
  constructor(public platform: Platform, private storage: Storage, public statusBar: StatusBar, public splashScreen: SplashScreen, public service: AppService, private modalCtrl: ModalController, private alertController: AlertController) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
    this.overlayHidden = moment().isBefore(service.getEndOfTrial());

    // if (this.overlayHidden) {
    //   const alert = this.alertController.create({
    //     title: 'OBS',
    //     subTitle: 'Denna app har mycket begränsat med funktioner och ska endast ses som en prototyp.',
    //     buttons: ['OK']
    //   });
    //   alert.present();
    // }
    
  }

  openModal(imgUrl: string) {
    const modal = this.modalCtrl.create(ImageModalPage, { imgUrl });
    modal.present();
  }

  getStoresToGroup(): Store[] {
    return this.service.getVisableStores().filter(s => s.adverts.length > 0).sort((a, b) => a.storeName < b.storeName ? -1 : 1);
  }

  menuClosed() {
    this.service.resetShowStoreAdverts();
  }

  menuOpened() {
    this.service.resetShowStoreAdverts();
    const yearWeek = moment().year().toString() + "_" + moment().isoWeek().toString();
    this.storage.get(yearWeek).then(
      (value) => {
        if (value === null) {
          this.service.updateAdvertOnStores();
          this.storage.length().then((l) => {
            if (l > 0) {
              const alert = this.alertController.create({
                title: 'Nya erbjudanden',
                subTitle: 'Ny vecka och nya erbjudanden!',
                buttons: ['OK']
              });
              alert.present();
            }
            this.storage.set(yearWeek, true);
          });
        }
      });
  }

  toggleGroup(store: Store) {
    store.showAdverts = !store.showAdverts;
  }

  getLabel(): string {
    return this.service.getChoosenStore() !== undefined ? this.service.getChoosenStore().storeName : "Personliga Erbjudanden";
  }

  getSubLabel(): string {
    const store = this.service.getChoosenStore();
    return store !== undefined ? store.address + " " + store.phone : "";
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
