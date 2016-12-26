import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService, UserPath } from '../../providers/user-service';

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
