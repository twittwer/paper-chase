import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CompassHeading, Geolocation, DeviceOrientation } from 'ionic-native';
import { Subscription } from 'rxjs';

/*
 Generated class for the Current page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component( {
  selector   : 'page-current',
  templateUrl: 'current.html'
} )
export class CurrentPage {

  public myData: any;

  protected subscriptionDeviceOrientation: Subscription;
  protected subscriptionGeoLocation: Subscription;

  constructor ( public navCtrl: NavController ) {
    console.log( 'constructor' );

    this.myData = {
      clickCount     : 0,
      updateCount    : 0,
      magneticHeading: null,
      trueHeading    : null,
      headingAccuracy: null
    };
  }

  ionViewWillEnter () {
    console.log( 'ionViewWillEnter' );
    this.subscriptionDeviceOrientation = DeviceOrientation.watchHeading()
      .subscribe( this.orientationUpdate.bind( this ), this.subscriptionError.bind( this ) );

    this.subscriptionGeoLocation = Geolocation.watchPosition()
      .subscribe( this.geoLocationUpdate.bind( this ), this.subscriptionError.bind( this ) );
  }


  ionViewDidLeave () {
    console.log( 'ionViewDidLeave' );
    this.subscriptionDeviceOrientation.unsubscribe();
    this.subscriptionGeoLocation.unsubscribe();
  }

  geoLocationUpdate ( data: Geolocation ) {
    console.log( 'geoLocationUpdate', data );
  }

  subscriptionError ( error: any ) {
    console.log( 'subscriptionError', error );
  }


  orientationUpdate ( data: CompassHeading ) {
    console.log( 'orientationUpdate', data );

    this.myData.updateCount++;
    this.myData.magneticHeading = data.magneticHeading;
    this.myData.trueHeading = data.trueHeading;
    this.myData.headingAccuracy = data.headingAccuracy;
  }

}
