import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition, Coordinates } from 'ionic-native';
import { UUID } from 'angular2-uuid';
import Utils from './utils';
import { GeoLocationWatcher, DistanceWatcher, GapData } from '../interfaces/GeoLocation';
import { GeoPoint } from '../interfaces/GeoPoint';

type GeoLocationWatcherRegistry = {
  [id: string]: GeoLocationWatcher
};

type GeoDistanceWatcherRegistry = {
  [id: string]: {
    destination: GeoPoint;
    watcher: DistanceWatcher;
  }
};

/**
 * GeoLocationService
 */
@Injectable()
export class GeoLocationService {

  protected geoLocSubscription: Subscription;
  protected coordinates: Coordinates;
  protected updatedAt: number;
  protected locationWatcher: GeoLocationWatcherRegistry;
  protected distanceWatcher: GeoDistanceWatcherRegistry;
  protected watchCounter: number;

  constructor ( private platform: Platform ) {
    console.log( 'Init GeoLocationService ...' );

    this.coordinates = null;
    this.updatedAt = null;

    this.locationWatcher = {};
    this.distanceWatcher = {};
    this.watchCounter = 0;
  }

  private subscribeGeoLocation () {
    if ( !this.geoLocSubscription ) {
      this.platform.ready()
        .then( () => {
          this.geoLocSubscription = Geolocation.watchPosition()
            .subscribe( this.updateGeoLocation.bind( this ), this.subscriptionError.bind( this ) );
        } );
    }
  }

  private unsubscribeGeoLocation () {
    if ( this.geoLocSubscription ) {
      this.geoLocSubscription.unsubscribe();
      this.geoLocSubscription = null;
    }
  }

  private updateGeoLocation ( geoposition: Geoposition ) {
    console.log( 'GeoLocationUpdate...', geoposition );

    this.coordinates = geoposition.coords;
    this.updatedAt = geoposition.timestamp;

    this.notifyWatchers();
  }

  private subscriptionError ( error: any ) {
    console.error( 'SubscriptionError @ GeoLocation', error );
  }

  private notifyWatchers (): void {
    for ( let watcherId in this.locationWatcher ) {
      if ( !this.locationWatcher.hasOwnProperty( watcherId ) ) {
        continue;
      }
      this.locationWatcher[ watcherId ]( this.coordinates, this.updatedAt );
    }
    for ( let watcherId in this.distanceWatcher ) {
      if ( !this.distanceWatcher.hasOwnProperty( watcherId ) ) {
        continue;
      }
      let gapData = GeoLocationService.calcGap( this.coordinates, this.distanceWatcher[ watcherId ].destination );
      this.distanceWatcher[ watcherId ].watcher( gapData.distance, gapData.angle );
    }
  }

  public getCurrentPosition (): Promise<Geoposition> {
    console.log( 'GetCurrentPosition...' );
    return new Promise( ( resolve, reject ) => {
      this.platform.ready()
        .then( () => {
          Geolocation.getCurrentPosition()
            .then( ( geoposition: Geoposition ) => {
              console.log( 'CurrentPosition', geoposition );
              this.updateGeoLocation( geoposition );
              resolve( geoposition );
            } )
            .catch( ( error ) => {
              console.error( 'Error @ GetCurrentPosition', error );
              reject( error );
            } );
        } );
    } );
  }

  public addLocationWatcher ( callback: GeoLocationWatcher ): string {
    let id = UUID.UUID();
    this.locationWatcher[ id ] = callback;
    if ( this.addWatcher() && this.coordinates !== null ) {
      callback( this.coordinates, this.updatedAt );
    }
    return id;
  }

  public addDistanceWatcher ( destination: GeoPoint, watcher: DistanceWatcher ): string {
    let id = UUID.UUID();
    this.distanceWatcher[ id ] = {
      destination: destination,
      watcher    : watcher
    };
    if ( this.addWatcher() && this.coordinates !== null ) {
      let gapData = GeoLocationService.calcGap( this.coordinates, destination );
      watcher( gapData.distance, gapData.angle );
    }
    return id;
  }

  /**
   * @return {boolean} If subscription already exists
   */
  private addWatcher (): boolean {
    this.watchCounter++;
    if ( this.watchCounter === 1 ) {
      this.subscribeGeoLocation();
      return false;
    }
    return true;
  }

  public removeLocationWatcher ( id: string ): void {
    this.removeWatcher( this.locationWatcher, id );
  }

  public removeDistanceWatcher ( id: string ): void {
    this.removeWatcher( this.distanceWatcher, id );
  }

  private removeWatcher ( registry: GeoLocationWatcherRegistry|GeoDistanceWatcherRegistry, id: string ): void {
    if ( registry.hasOwnProperty( id ) ) {
      delete registry[ id ];
      this.watchCounter--;
      if ( this.watchCounter === 0 ) {
        this.unsubscribeGeoLocation();
      }
    }
  }

  /**
   * Calculate distance and angle from current position to a given point in meters.
   *
   * @param destination {GeoPoint}
   * @return {Promise<GapData>} Promise with distance (meter) and angle (degrees) to given coordinates
   */
  public getCurrentGap ( destination: GeoPoint ): Promise<GapData> {
    return new Promise( ( resolve, reject ) => {
      this.getCurrentPosition()
        .then( () => {
          let gapData = GeoLocationService.calcGap( this.coordinates, destination );
          resolve( gapData );
        } );
    } );
  }

  /**
   * Calculate distance and angle between two points in meters.
   *
   * @param from {GeoPoint}
   * @param to {GeoPoint}
   * @return {GapData} distance (meter) and angle (degress) to destination
   */
  public static calcGap ( from: GeoPoint, to: GeoPoint ): GapData {
    let currLatR = Utils.toRadians( from.latitude );
    let destLatR = Utils.toRadians( to.latitude );
    let dLat = Utils.toRadians( to.latitude - from.latitude );
    let dLong = Utils.toRadians( to.longitude - from.longitude );

    let a1 = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 );
    let a2 = Math.cos( currLatR ) * Math.cos( destLatR );
    let a3 = Math.sin( dLong / 2 ) * Math.sin( dLong / 2 );
    let a = a1 + a2 * a3;

    let c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
    let distance = c * 6371e3;

    let y = Math.sin( dLong ) * Math.cos( destLatR );
    let x = Math.cos( currLatR ) * Math.sin( destLatR ) - Math.sin( currLatR ) * Math.cos( destLatR ) * Math.cos(
        dLong );
    let angleRadian = Math.atan2( y, x );

    let angle = (Utils.toDegrees( angleRadian ) + 360) % 360;

    return {
      distance: distance,
      angle   : angle
    };
  }

}
