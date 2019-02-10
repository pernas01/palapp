import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header';
import { FooterComponent } from './footer/footer';
import { BrowserModule } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicModule } from 'ionic-angular';

@NgModule({
    declarations: [HeaderComponent,
        FooterComponent,
    ],
    imports: [BrowserModule, IonicModule.forRoot(HeaderComponent), IonicModule.forRoot(FooterComponent)],
    providers: [
        Geolocation],
    exports: [BrowserModule, HeaderComponent,
        FooterComponent,
    ]
})
export class ComponentsModule { }
