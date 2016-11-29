import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CompassHeading, Geolocation, DeviceOrientation, Geoposition } from 'ionic-native';
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

  public myData: {
    deviceOrientationCount: number,
    geoLocationCount: number,
    trueHeading: number,
    headingAccuracy: number,
    latitude: number,
    longitude: number,
    locationAccuracy: number
  };

  protected subscriptionDeviceOrientation: Subscription;
  protected subscriptionGeoLocation: Subscription;

  constructor ( public navCtrl: NavController ) {
    console.log( 'constructor' );

    this.myData = {
      deviceOrientationCount: 0,
      geoLocationCount      : 0,
      trueHeading           : null,
      headingAccuracy       : null,
      latitude              : null,
      longitude             : null,
      locationAccuracy      : null
    };
  }

  ionViewWillEnter () {
    console.log( 'ionViewWillEnter' );
    this.subscriptionDeviceOrientation = DeviceOrientation.watchHeading( { frequency: 500 } )
      .subscribe( this.deviceOrientationUpdate.bind( this ), this.subscriptionError.bind( this ) );

    this.subscriptionGeoLocation = Geolocation.watchPosition()
      .subscribe( this.geoLocationUpdate.bind( this ), this.subscriptionError.bind( this ) );
  }

  ionViewDidLeave () {
    console.log( 'ionViewDidLeave' );
    this.subscriptionDeviceOrientation.unsubscribe();
    this.subscriptionGeoLocation.unsubscribe();
  }

  geoLocationUpdate ( geoposition: Geoposition ) {
    console.log( 'geoLocationUpdate', geoposition );

    this.myData.geoLocationCount++;
    this.myData.latitude = geoposition.coords.latitude;
    this.myData.longitude = geoposition.coords.longitude;
    this.myData.locationAccuracy = geoposition.coords.accuracy;
  }

  deviceOrientationUpdate ( data: CompassHeading ) {
    console.log( 'deviceOrientationUpdate', data );

    this.myData.deviceOrientationCount++;
    this.myData.trueHeading = data.trueHeading;
    this.myData.headingAccuracy = data.headingAccuracy;
  }

  subscriptionError ( error: any ) {
    console.error( 'subscriptionError', error );
  }

  onClick () {
    Geolocation.getCurrentPosition()
      .then( ( geoposition: Geoposition ) => {
        console.log( 'getCurrentPosition', geoposition );
      } )
      .catch( ( error ) => {
        console.error( 'getCurrentPosition', error );
      } );
  }
}
