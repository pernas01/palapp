import { Component } from '@angular/core';

/**
 * Generated class for the Tab2Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tab2',
  // templateUrl: 'tab2.html'
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Star</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>Tab 2</ion-content>`
})
export class Tab2Component {

  text: string;

  constructor() {
    console.log('Hello Tab2Component Component');
    this.text = 'Hello World';
  }

}
