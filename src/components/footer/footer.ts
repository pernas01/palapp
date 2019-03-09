import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the FooterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'footer',
  templateUrl: 'footer.html'
})
export class FooterComponent {
  constructor(private alertController: AlertController) {
  }

  onClick(title: string, message: string) {
    const alert = this.alertController.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
