import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppService } from '../../providers/approvider/appservice';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  activeMenu: string;
  constructor(public menu: MenuController, public service: AppService, private alert: AlertController) {
    this.service.getChoosenStore
    this.service.getWhenStoreIsChoosen().subscribe(store => {
      if (this.getNumberOfAdverts() > 0)
        setTimeout(() => this.activateMenu("menu2"), 1000);
    });

  }

  showAlert() {
    const alert = this.alert.create({
      title: 'Under utveckling!',
      subTitle: 'Denna tab är tänkt att innehålla ett socialt flöde.',
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
