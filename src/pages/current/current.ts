import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DeviceOrientation, CompassHeading} from 'ionic-native';

/*
 Generated class for the Current page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-current',
  templateUrl: 'current.html'
})
export class CurrentPage {

  constructor(public navCtrl: NavController) {

    // Get the device current compass heading
    DeviceOrientation.getCurrentHeading().then(
      (data: CompassHeading) => console.log(data),
      (error: any) => console.log(error)
    );

    // Watch the device compass heading change
    var subscription = DeviceOrientation.watchHeading().subscribe(
      (data: CompassHeading) => console.log(data)
    );

    // Stop watching heading change
    subscription.unsubscribe();
  }


}
