import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GeoLocationService } from '../../providers/geo-location-service';
import { GeoPoint } from '../../interfaces/geo-point';
import { DeviceOrientationService } from '../../providers/device-orientation-service';

@Component( {
  selector   : 'page-current',
  templateUrl: 'current.html'
} )
export class CurrentPage {

  public destination: GeoPoint = {
    latitude : 48.774056,
    longitude: 9.204528
  };

  public locationAccuracy: number;
  public distance: number;
  public direction: number;

  private listenerIdLocation: string;
  private listenerIdDistance: string;
  private listenerIdDirection: string;

  constructor ( public navCtrl: NavController, private platform: Platform,
                private geoLocationService: GeoLocationService,
                private deviceOrientationService: DeviceOrientationService ) {
    console.log( 'constructor' );

    this.locationAccuracy = null;
    this.distance = 0;
    this.direction = 0;
  }

  ionViewDidEnter () {
    console.log( 'CurrentPage: ionViewDidEnter' );

    this.listenerIdLocation = this.geoLocationService.addLocationWatcher( ( coords: Coordinates ) => {
      console.log( 'CurrentPage : GeoLocationUpdate' );
      this.locationAccuracy = coords.accuracy;
    } );

    this.listenerIdDistance = this.geoLocationService.addDistanceWatcher( this.destination,
      ( distance: number, angle: number ) => {
        console.log( 'CurrentPage : DistanceUpdate' );
        this.distance = distance;
        // DEBUG
        this.direction = angle;
      } );

    this.listenerIdDirection = this.deviceOrientationService.addDirectionWatcher( this.destination,
      ( direction: number ) => {
        console.log( 'CurrentPage : DirectionUpdate' );
        // DEBUG
        // this.direction = direction;
      } );
  }

  ionViewWillLeave () {
    console.log( 'CurrentPage: ionViewWillLeave' );

    this.geoLocationService.removeLocationWatcher( this.listenerIdLocation );
    this.geoLocationService.removeDistanceWatcher( this.listenerIdDistance );
    this.deviceOrientationService.removeDirectionWatcher( this.listenerIdDirection );
  }
}
