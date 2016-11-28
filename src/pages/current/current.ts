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

  public headingAccuracy: number;
  public magneticHeading: number;
  public trueHeading: number;

  protected subscriptionDeviceOrientation: Subscription;
  protected subscriptionGeoLocation: Subscription;

  constructor ( public navCtrl: NavController ) {
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
    console.log( 'geoLocationUpdate', data, this );
  }

  orientationUpdate ( data: CompassHeading ) {
    this.headingAccuracy = data.headingAccuracy;
    this.magneticHeading = data.magneticHeading;
    this.trueHeading = data.trueHeading;
    console.log( 'orientationUpdate', data );
  }

  subscriptionError ( error: any ) {
    console.log( 'error:', error, this );
  }

}
