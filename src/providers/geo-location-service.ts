import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition, Coordinates } from 'ionic-native';
import { UUID } from 'angular2-uuid';
import Utils from './utils';

export interface Position {
  latitude: number;
  longitude: number;
}

export interface GeoLocationListener {
  ( coords: Coordinates, updatedAt: number ): void;
}

/*
 GeoLocationService
 TODO
 */
@Injectable()
export class GeoLocationService {

  protected geoLocSubscription: Subscription;
  protected coordinates: Coordinates;
  protected updatedAt: number;
  protected listeners: {[id: string]: GeoLocationListener};
  protected listenersCounter: number;

  constructor ( private platform: Platform ) {
    console.log( 'Init GeoLocationService ...' );

    this.coordinates = null;
    this.updatedAt = null;
    this.listeners = {};
    this.listenersCounter = 0;
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

    this.callListeners();
  }

  private subscriptionError ( error: any ) {
    console.error( 'SubscriptionError @ GeoLocation', error );
  }

  private callListeners (): void {
    for ( let listenerId in this.listeners ) {
      if ( !this.listeners.hasOwnProperty( listenerId ) ) {
        continue;
      }
      this.listeners[ listenerId ]( this.coordinates, this.updatedAt );
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

  public addListener ( callback: GeoLocationListener ): string {
    let id = UUID.UUID();
    this.listeners[ id ] = callback;
    this.listenersCounter++;
    if ( this.listenersCounter === 1 ) {
      this.subscribeGeoLocation();
    }
    return id;
  }

  public removeListener ( id: string ): void {
    if ( this.listeners.hasOwnProperty( id ) ) {
      delete this.listeners[ id ];
      this.listenersCounter--;
      if ( this.listenersCounter === 0 ) {
        this.unsubscribeGeoLocation();
      }
    }
  }

  /**
   * Calculate distance from current position to a given point in meters.
   *
   * @param destination {Position}
   * @return {Promise<number>} Promise with distance to given coordinates (meter)
   */
  public getCurrentDistance ( destination: Position ): Promise<number> {
    return new Promise( ( resolve, reject ) => {
      this.getCurrentPosition()
        .then( () => {
          let distance = GeoLocationService.calcDistance(this.coordinates, destination);
          resolve( distance );
        } );
    } );
  }

  /**
   * Calculate distance between two points in meters.
   *
   * @param from {Position}
   * @param to {Position}
   * @return {number} distance of given in meter
   */
  public static calcDistance(from: Position, to: Position) {
    let currLatR = Utils.toRadians( from.latitude );
    let destLatR = Utils.toRadians( to.latitude );
    let dLat = Utils.toRadians( to.latitude - from.latitude );
    let dLong = Utils.toRadians( to.longitude - from.longitude );

    let a1 = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 );
    let a2 = Math.cos( currLatR ) * Math.cos( destLatR );
    let a3 = Math.sin( dLong / 2 ) * Math.sin( dLong / 2 );
    let a = a1 + a2 * a3;

    let c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );

    return c * 6371e3;
  }

}
