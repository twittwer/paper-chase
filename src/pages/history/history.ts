import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService, UserPath } from '../../providers/user-service';

/*
 Generated class for the History page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component( {
  selector   : 'page-history',
  templateUrl: 'history.html'
} )
export class HistoryPage {

  paths: UserPath[] = [];

  constructor ( public navCtrl: NavController, public userService: UserService ) {
    this.paths = userService.paths;
  }

}
