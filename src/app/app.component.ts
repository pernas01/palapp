import { Component, ViewChild} from '@angular/core';
import { trigger, transition, style, animate, state, query, stagger } from '@angular/animations';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AppService } from '../providers/approvider/appservice';
import { Store } from '../shared/interfaces';
import { ImageModalPage } from '../pages/image-modal/image-modal';

@Component({
  templateUrl: 'app.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: '0' })),
      state('*', style({ opacity: '1' })),
      transition('void <=> *', animate('150ms ease-in'))
    ])
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public service: AppService, private modalCtrl: ModalController) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
  }

  openModal(imgUrl: string){
    const modal = this.modalCtrl.create(ImageModalPage, {imgUrl});
     modal.present();
  }

  getStoresToGroup(): Store[] {
    return this.service.getVisableStores().filter(s => s.adverts.length > 0).sort((a,b) => a.storeName < b.storeName ? -1 : 1);
  }

  menuClosed() {    
    this.service.resetShowStoreAdverts();
  }

  menuOpened() {
    this.service.resetShowStoreAdverts();
  }

  toggleGroup(store: Store) {
    store.showAdverts = !store.showAdverts;
  }

  getLabel(): string {
    return this.service.getChoosenStore() !== undefined ? this.service.getChoosenStore().storeName : "Erbjudanden";
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
