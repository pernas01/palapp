import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  activeMenu: string;
  constructor(public menu: MenuController) {  }

  activateMenu(menuId: string): void {
    this.activeMenu = menuId;
    this.menu.enable(true, menuId);
    this.menu.enable(false, menuId === "menu1" ? "menu2" : "menu1");
    this.menu.open(menuId);
  }

}
