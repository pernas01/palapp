import { Component } from '@angular/core';

/**
 * Generated class for the Tab1Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tab1',
  // templateUrl: 'tab1.html'
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Heart</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>Tab 1</ion-content>`
})
export class Tab1Component {

  text: string;

  constructor() {
    console.log('Hello Tab1Component Component');
    this.text = 'Hello World';
  }

}
