import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';
import { DeviceOrientation, CompassHeading } from 'ionic-native';
import { UUID } from 'angular2-uuid';

export interface DeviceOrientationWatcher {
  ( heading: number, headingAccuracy: number, updatedAt: number ): void;
}

type DeviceOrientationWatcherRegistry = {
  [id: string]: DeviceOrientationWatcher
};

/*
 DeviceOrientationService
 TODO
 */
@Injectable()
export class DeviceOrientationService {

  protected deviceOrientationSubscription: Subscription;
  protected heading: number;
  protected headingAccuracy: number;
  protected updatedAt: number;
  protected orientationWatcher: DeviceOrientationWatcherRegistry;
  protected watchCounter: number;

  constructor ( private platform: Platform ) {
    console.log( 'Init DeviceOrientationService ...' );

    this.heading = null;
    this.headingAccuracy = null;
    this.updatedAt = null;
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

  private removeWatcher ( registry: DeviceOrientationWatcherRegistry, id: string ): void {
    if ( registry.hasOwnProperty( id ) ) {
      delete registry[ id ];
      this.watchCounter--;
      if ( this.watchCounter === 0 ) {
        this.unsubscribeDeviceOrientation();
      }
    }
  }

  // TODO: Calculation Magic
}
