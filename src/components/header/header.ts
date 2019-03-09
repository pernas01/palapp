import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppService } from '../../providers/approvider/appservice';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  sub: Subscription;
  activeMenu: string;
  constructor(public menu: MenuController, public service: AppService, private alert: AlertController) {
    this.service.getChoosenStore
    this.sub = this.service.getWhenStoreIsChoosen().subscribe(store => {
      if (this.getNumberOfAdverts() > 0)
        // setTimeout(() => this.activateMenu("menu2"), 1000);
        this.activateMenu("menu2")
    });

  }

  ionViewDidLeave(): void {
    this.sub.unsubscribe();
  }

  showAlert() {
    const alert = this.alert.create({
      title: 'Centrala erbjudanden',
      subTitle: 'Här kommer det vara centrala  erbjudanden från alla kedjor & företag som du är intresserad av att se, och som är på din radie.',
      buttons: ['OK']
    });
    alert.present();
  }

  activateMenu(menuId: string): void {
    this.activeMenu = menuId;
    this.menu.enable(true, menuId);
    this.menu.enable(false, menuId === "menu1" ? "menu2" : "menu1");
    this.menu.open(menuId);
  }

  getNumberOfAdverts(): number {
    let count = 0;
    this.service.getVisableStores().forEach(s => count = count + s.adverts.length);
    return count;
  }

}
