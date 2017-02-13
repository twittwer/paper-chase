import { Component } from '@angular/core';
import { NavController, Platform, ToastController } from 'ionic-angular';
import { GeoLocationService } from '../../providers/geo-location-service';
import { DeviceOrientationService } from '../../providers/device-orientation-service';
import { UserService } from '../../providers/user-service';
import { Question } from '../../providers/path-service';
import { ToastOptions } from 'ionic-native';

@Component( {
  selector   : 'page-current',
  templateUrl: 'current.html'
} )
export class CurrentPage {

  public locationAccuracy: number;
  public distance: number;
  public pointingDirection: number;
  public destinationDirection: number;

  public question: Question;
  public questionAnswer: number;

  private listenerIdLocation: string;
  private listenerIdDistance: string;
  private listenerIdOrientation: string;

  constructor ( public navCtrl: NavController, private platform: Platform, private toastController: ToastController,
                private geoLocationService: GeoLocationService,
                private deviceOrientationService: DeviceOrientationService, public userService: UserService ) {
    console.log( 'constructor' );

    this.locationAccuracy = null;
    this.distance = 0;
    this.destinationDirection = 0;
    this.pointingDirection = 0;

    this.question = null;
    this.questionAnswer = null;
  }

  ionViewDidEnter () {
    console.log( 'CurrentPage: ionViewDidEnter' );

    this.listenerIdLocation = this.geoLocationService.addLocationWatcher( ( coords: Coordinates ) => {
      console.log( 'CurrentPage : GeoLocationUpdate' );
      this.locationAccuracy = coords.accuracy;
    } );

    this.updateLocationListeners();
  }

  ionViewWillLeave () {
    console.log( 'CurrentPage: ionViewWillLeave' );

    this.geoLocationService.removeLocationWatcher( this.listenerIdLocation );
    this.geoLocationService.removeDistanceWatcher( this.listenerIdDistance );
    this.deviceOrientationService.removeOrientationWatcher( this.listenerIdOrientation );
  }

  private updateLocationListeners () {
    if ( this.userService.active ) {

      let destination = this.userService.active.path.points[ this.userService.active.index.activePoint ].coordinates;

      if ( this.listenerIdDistance ) {
        this.geoLocationService.removeDistanceWatcher( this.listenerIdDistance );
      }
      if ( this.listenerIdOrientation ) {
        this.deviceOrientationService.removeOrientationWatcher( this.listenerIdOrientation );
      }

      this.listenerIdDistance = this.geoLocationService.addDistanceWatcher( destination,
        ( distance: number, angle: number ) => {
          console.log( 'CurrentPage : DistanceUpdate' );
          this.distance = distance;
          this.destinationDirection = angle;
          this.showQuestion( (this.distance < 20) );
        } );

      this.listenerIdOrientation = this.deviceOrientationService.addOrientationWatcher(
        ( heading: number, headingAccuracy: number, updatedAt: number ) => {
          console.log( 'CurrentPage : DirectionUpdate' );
          this.pointingDirection = this.destinationDirection - heading;
        } );
    }
  }

  public showQuestion ( show: boolean ) {
    if ( !show ) {
      this.question = null;
      this.questionAnswer = null;
    } else {
      if ( this.userService.active.index.activePoint < this.userService.active.counter.points ) {
        this.question = this.userService.active.path.points[ this.userService.active.index.activePoint ].question;
      } else {
        this.userService.stopCurrentPath();
        this.navCtrl.parent.select( 2 );
      }
    }
  }

  public answerQuestion () {
    let toastOptions: ToastOptions = {
      duration: 3000
    };
    if ( !this.questionAnswer ) {
      toastOptions.message = 'Please select an answer.';
      toastOptions.position = 'bottom';
    } else {
      if ( this.questionAnswer == this.question.answer ) {
        this.userService.active.path.points[ this.userService.active.index.activePoint ].status = 'right';
        this.userService.active.counter.pointsRight++;
        toastOptions.message = 'Congratulation, this was the right answer.';
      } else {
        this.userService.active.path.points[ this.userService.active.index.activePoint ].status = 'wrong';
        this.userService.active.counter.pointsWrong++;
        toastOptions.message = 'Sadly this answer was wrong.';
      }
      this.userService.active.counter.pointsPending--;
      toastOptions.position = 'middle';
      this.showQuestion( false );
      this.userService.active.index.activePoint++;
      this.updateLocationListeners();
    }

    this.toastController.create( toastOptions )
      .present();

    if ( this.userService.active.index.activePoint === this.userService.active.counter.points ) {
      this.toastController.create( {
        message : 'Congratulation, you finished the paper chase.',
        duration: 3000,
        position: 'middle'
      } )
        .present();
      this.userService.stopCurrentPath();
      this.navCtrl.parent.select( 2 );
    }
  }
}
