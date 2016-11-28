import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DeviceOrientation, CompassHeading} from 'ionic-native';
import {Subscription} from "rxjs";

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

  public headingAccuracy: number;
  public magneticHeading: number;
  public trueHeading: number;

  protected subscription: Subscription;

  constructor(public navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.subscription = DeviceOrientation.watchHeading().subscribe(this.orientationUpdate, this.orientationError);
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

  orientationUpdate(data: CompassHeading) {
    this.headingAccuracy = data.headingAccuracy;
    this.magneticHeading = data.magneticHeading;
    this.trueHeading = data.trueHeading;
    console.log(data);
  }

  orientationError(error: any) {
    console.log(error);
  }

}
