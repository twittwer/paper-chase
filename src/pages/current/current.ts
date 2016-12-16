import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { CompassHeading, Geolocation, Geoposition } from 'ionic-native';
import { Subscription } from 'rxjs';
import { Position, GeoLocationService } from '../../providers/geo-location-service';

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
  public myDistance: number;

  protected subscriptionDeviceOrientation: Subscription;
  protected subscriptionGeoLocation: Subscription;

  private listenerId: string;
  // private destination: Position = {
  //   latitude : 48.774063,
  //   longitude: 9.171182
  // };
  private destination: Position = {
    latitude : 48.774056,
    longitude: 9.204528
  };

  constructor ( public navCtrl: NavController, private geoLocationService: GeoLocationService,
                private platform: Platform ) {
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
    this.myDistance = 0;
  }

  ionViewDidEnter () {
    console.log( 'ionViewDidEnter' );

    this.listenerId = this.geoLocationService.addListener( ( coords: Coordinates ) => {
      this.myDistance = GeoLocationService.calcDistance( coords, this.destination );

      this.myData.geoLocationCount++;
      this.myData.latitude = coords.latitude;
      this.myData.longitude = coords.longitude;
      this.myData.locationAccuracy = coords.accuracy;
    } );

    // this.platform.ready()
    //   .then( () => {
    //     this.subscriptionDeviceOrientation = DeviceOrientation.watchHeading( { frequency: 500 } )
    //       .subscribe( this.deviceOrientationUpdate.bind( this ), this.subscriptionError.bind( this ) );
    //
    //     this.subscriptionGeoLocation = Geolocation.watchPosition()
    //       .subscribe( this.geoLocationUpdate.bind( this ), this.subscriptionError.bind( this ) );
    //   } );
  }

  ionViewWillLeave () {
    console.log( 'ionViewWillLeave' );

    this.geoLocationService.removeListener( this.listenerId );

    // this.subscriptionDeviceOrientation.unsubscribe();
    // this.subscriptionGeoLocation.unsubscribe();
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
        alert( 'getCurrentPosition \n' + geoposition );
      } )
      .catch( ( error ) => {
        console.error( 'getCurrentPosition', error );
        alert( 'getCurrentPosition \n' + error );
      } );
  }

  calcDistance () {
    this.myDistance = GeoLocationService.calcDistance( this.myData, this.destination );
  }
}
