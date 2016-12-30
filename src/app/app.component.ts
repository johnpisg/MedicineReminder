import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen, Push } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { Page3 } from '../pages/page3/page3';

declare var FCMPlugin: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public alertCtrl: AlertController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 },
      { title: 'Page Three', component: Page3 }
    ];

  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Notificacion',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      //notif 2
      let push = Push.init({
        android: {
          senderID: "47288883895"
        },
        ios: {
          alert: "true",
          badge: false,
          sound: "true"
        },
        windows: {}
      });

      push.on('registration', (data) => {
        console.log("device token ->", data.registrationId);
        //TODO - send device token to server
        this.showAlert(JSON.stringify(data));
      });

      push.on('notification', (data) => {
        console.log('message', data.message);
        let self = this;
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'Nueva notificación',
            message: data.message,
            buttons: [{
              text: 'Ignorar',
              role: 'cancelar'
            }, {
              text: 'Ver',
              handler: () => {
                //TODO: Your logic here
                self.nav.push(Page3, {message: data.message});
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          self.nav.push(Page3, {message: data.message});
          console.log("Push notification clicked");
        }
      });
      push.on('error', (e) => {
        console.log(e.message);
        this.showAlert(e.message);
      });
      //fin


      //notif 1
        // if(typeof(FCMPlugin) !== "undefined"){
        //   FCMPlugin.getToken(function(t){
        //     console.log("Use this token for sending device specific messages\nToken: " + t);
        //   }, function(e){
        //     console.log("Uh-Oh!\n"+e);
        //   });

        //   FCMPlugin.onNotification(function(d){
        //     if(d.wasTapped){  
        //       // Background receival (Even if app is closed),
        //       //   bring up the message in UI
        //       this.showAlert("Background=>" + JSON.stringify(d))
        //     } else {
        //       // Foreground receival, update UI or what have you...
        //       this.showAlert("Foreground=>" + JSON.stringify(d))
        //     }
        //   }, function(msg){
        //     // No problemo, registered callback
        //   }, function(err){
        //     console.log("Arf, no good mate... " + err);
        //   });
        // } else console.log("Notifications disabled, only provided in Android/iOS environment");

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
