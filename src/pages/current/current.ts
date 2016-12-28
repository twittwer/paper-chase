import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { GeoLocationService } from '../../providers/geo-location-service';
import { GeoPoint } from '../../interfaces/geo-point';
import { DeviceOrientationService } from '../../providers/device-orientation-service';
import { UserService } from '../../providers/user-service';

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
  public pointingDirection: number;
  public destinationDirection: number;

  private listenerIdLocation: string;
  private listenerIdDistance: string;
  private listenerIdDirection: string;

  constructor ( public navCtrl: NavController, private platform: Platform,
                private geoLocationService: GeoLocationService,
                private deviceOrientationService: DeviceOrientationService, public userService: UserService ) {
    console.log( 'constructor' );

    this.locationAccuracy = null;
    this.distance = 0;
    this.destinationDirection = 0;
    this.pointingDirection = 0;
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
        this.destinationDirection = angle;
      } );

    this.listenerIdDirection = this.deviceOrientationService.addOrientationWatcher(
      ( heading: number, headingAccuracy: number, updatedAt: number ) => {
        console.log( 'CurrentPage : DirectionUpdate' );
        this.pointingDirection = this.destinationDirection - heading;
      } );
  }

  ionViewWillLeave () {
    console.log( 'CurrentPage: ionViewWillLeave' );

    this.geoLocationService.removeLocationWatcher( this.listenerIdLocation );
    this.geoLocationService.removeDistanceWatcher( this.listenerIdDistance );
    this.deviceOrientationService.removeDirectionWatcher( this.listenerIdDirection );
  }
}
