import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Path, PathService } from '../../providers/path-service';

@Component( {
  selector   : 'page-routes',
  templateUrl: 'routes.html'
} )
export class RoutesPage {

  public paths: Path[];

  constructor ( public navCtrl: NavController, private pathService: PathService ) {
    this.paths = [];
  }

  ionViewWillEnter () {
    this.paths = this.pathService.paths;
  }

}
