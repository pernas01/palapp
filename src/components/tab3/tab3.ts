import { Component } from '@angular/core';

/**
 * Generated class for the Tab3Component component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tab3',
  templateUrl: 'tab3.html'
})
export class Tab3Component {

  text: string;

  constructor() {
    console.log('Hello Tab3Component Component');
    this.text = 'Hello World';
  }

}
