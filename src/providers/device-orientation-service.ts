import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs';
import { Platform } from 'ionic-angular';
import { DeviceOrientation, CompassHeading } from 'ionic-native';

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

  // TODO: notify watchers
  private notifyWatchers (): void {
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

  // TODO: watcher management
}
