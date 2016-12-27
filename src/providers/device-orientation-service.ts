import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';
import { DeviceOrientation, CompassHeading } from 'ionic-native';
import { UUID } from 'angular2-uuid';
import { DeviceOrientationWatcher, DirectionWatcher } from '../interfaces/device-orientation';
import { GeoPoint } from '../interfaces/geo-point';

type DeviceOrientationWatcherRegistry = {
  [id: string]: DeviceOrientationWatcher
};

type DeviceDirectionWatcherRegistry = {
  [id: string]: {
    destination: GeoPoint;
    watcher: DirectionWatcher;
  }
};

/**
 * DeviceOrientationService
 */
@Injectable()
export class DeviceOrientationService {

  protected deviceOrientationSubscription: Subscription;
  protected heading: number;
  protected headingAccuracy: number;
  protected updatedAt: number;
  protected orientationWatcher: DeviceOrientationWatcherRegistry;
  protected directionWatcher: DeviceDirectionWatcherRegistry;
  protected watchCounter: number;

  constructor ( private platform: Platform ) {
    console.log( 'Init DeviceOrientationService ...' );

    this.heading = null;
    this.headingAccuracy = null;
    this.updatedAt = null;

    this.orientationWatcher = {};
    this.directionWatcher = {};
    this.watchCounter = 0;
  }

  private subscribeDeviceOrientation () {
    if ( !this.deviceOrientationSubscription ) {
      this.platform.ready()
        .then( () => {
          this.deviceOrientationSubscription = DeviceOrientation.watchHeading()
            .subscribe( this.updateDeviceOrientation.bind( this ), this.subscriptionError.bind( this ) );
        } );
    }
  }

  private unsubscribeDeviceOrientation () {
    if ( this.deviceOrientationSubscription ) {
      this.deviceOrientationSubscription.unsubscribe();
      this.deviceOrientationSubscription = null;
    }
  }

  private updateDeviceOrientation ( compassHeading: CompassHeading ) {
    console.log( 'DeviceOrientationUpdate...', compassHeading );

    this.heading = compassHeading.trueHeading;
    this.headingAccuracy = compassHeading.headingAccuracy;
    this.updatedAt = compassHeading.timestamp;

    this.notifyWatchers();
  }

  private subscriptionError ( error: any ) {
    console.error( 'SubscriptionError @ DeviceOrientation', error );
  }

  private notifyWatchers (): void {
    for ( let watcherId in this.orientationWatcher ) {
      if ( !this.orientationWatcher.hasOwnProperty( watcherId ) ) {
        continue;
      }
      this.orientationWatcher[ watcherId ]( this.heading, this.headingAccuracy, this.updatedAt );
    }
    for ( let watcherId in this.directionWatcher ) {
      if ( !this.directionWatcher.hasOwnProperty( watcherId ) ) {
        continue;
      }
      this.directionWatcher[ watcherId ].watcher(
        this.calcDirection( this.directionWatcher[ watcherId ].destination ) );
    }
  }

  public getCurrentOrientation (): Promise<CompassHeading> {
    console.log( 'GetCurrentOrientation...' );
    return new Promise( ( resolve, reject ) => {
      this.platform.ready()
        .then( () => {
          DeviceOrientation.getCurrentHeading()
            .then( ( compassHeading: CompassHeading ) => {
              console.log( 'CurrentOrientation', compassHeading );
              this.updateDeviceOrientation( compassHeading );
              resolve( compassHeading );
            } )
            .catch( ( error ) => {
              console.error( 'Error @ getCurrentOrientation', error );
              reject( error );
            } );
        } );
    } );
  }

  public addOrientationWatcher ( callback: DeviceOrientationWatcher ): string {
    let id = UUID.UUID();
    this.orientationWatcher[ id ] = callback;
    if ( this.addWatcher() && this.heading !== null ) {
      callback( this.heading, this.headingAccuracy, this.updatedAt );
    }
    return id;
  }

  public addDirectionWatcher ( destination: GeoPoint, watcher: DirectionWatcher ): string {
    let id = UUID.UUID();
    this.directionWatcher[ id ] = {
      destination: destination,
      watcher    : watcher
    };
    if ( this.addWatcher() && this.heading !== null ) {
      watcher( this.calcDirection( destination ) );
    }
    return id;
  }

  /**
   * @return {boolean} If subscription already exists
   */
  private addWatcher (): boolean {
    this.watchCounter++;
    if ( this.watchCounter === 1 ) {
      this.subscribeDeviceOrientation();
      return false;
    }
    return true;
  }

  public removeOrientationWatcher ( id: string ): void {
    this.removeWatcher( this.orientationWatcher, id );
  }

  public removeDirectionWatcher ( id: string ): void {
    this.removeWatcher( this.directionWatcher, id );
  }

  private removeWatcher ( registry: DeviceOrientationWatcherRegistry|DeviceDirectionWatcherRegistry,
                          id: string ): void {
    if ( registry.hasOwnProperty( id ) ) {
      delete registry[ id ];
      this.watchCounter--;
      if ( this.watchCounter === 0 ) {
        this.unsubscribeDeviceOrientation();
      }
    }
  }

  private debugDirection: number = 0;

  /**
   * @param destination {GeoPoint}
   * @return {number} degrees to destination point (e.g. 90 at the right; 270 at the left)
   */
  public calcDirection ( destination: GeoPoint ): number {
    // TODO: Calculation Magic
    let direction = Math.floor( Math.random() * 359 );
    if ( direction % 2 === 0 ) {
      this.debugDirection = direction;
    }
    return this.debugDirection;
  }
}
