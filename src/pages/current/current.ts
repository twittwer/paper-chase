import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Position, GeoLocationService } from '../../providers/geo-location-service';
import { DeviceOrientationService } from '../../providers/device-orientation-service';

@Component( {
  selector   : 'page-current',
  templateUrl: 'current.html'
} )
export class CurrentPage {

  public counter: {
    geoLocation: number,
    geoDistance: number
  };
  public myGeoLocation: {
    latitude: number,
    longitude: number,
    locationAccuracy: number
  };
  public myDistance: { km: number, angle: number };

  public destination: Position = {
    latitude : 48.774056,
    longitude: 9.204528
  };

  private listenerIdLocation: string;
  private listenerIdDistance: string;
  private listenerIdOrientation: string;

  constructor ( public navCtrl: NavController, private geoLocationService: GeoLocationService,
                private deviceOrientationService: DeviceOrientationService, private platform: Platform ) {
    console.log( 'constructor' );

    this.counter = {
      geoLocation: 0,
      geoDistance: 0
    };
    this.myGeoLocation = {
      latitude        : null,
      longitude       : null,
      locationAccuracy: null
    };
    this.myDistance = {
      km   : 0,
      angle: 0
    };
  }

  ionViewDidEnter () {
    console.log( 'ionViewDidEnter' );

    this.listenerIdLocation = this.geoLocationService.addLocationWatcher( ( coords: Coordinates ) => {
      console.log( 'Current : GeoLocationUpdate' );
      this.counter.geoLocation++;
      this.myGeoLocation.latitude = coords.latitude;
      this.myGeoLocation.longitude = coords.longitude;
      this.myGeoLocation.locationAccuracy = coords.accuracy;

    } );

    this.listenerIdDistance = this.geoLocationService.addDistanceWatcher( this.destination, ( distance: { km: number, angle: number } ) => {
      console.log( 'Current : GeoDistanceUpdate' );
      this.counter.geoDistance++;
      this.myDistance = distance;
    } );

    /*this.listenerIdOrientation = this.deviceOrientationService.addOrientationWatcher(
     ( heading: number, headingAccuracy: number, updatedAt: number ) => {
     console.log( heading, headingAccuracy, updatedAt );
     } );*/
  }

  ionViewWillLeave () {
    console.log( 'ionViewWillLeave' );

    this.geoLocationService.removeLocationWatcher( this.listenerIdLocation );
    this.geoLocationService.removeDistanceWatcher( this.listenerIdDistance );
    this.deviceOrientationService.removeOrientationWatcher( this.listenerIdOrientation );
  }
}
