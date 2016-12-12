import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Path, PathService } from '../../providers/path-service';

@Component( {
  selector   : 'page-home',
  templateUrl: 'home.html'
} )
export class HomePage {

  paths: Path[] = [];

  constructor ( public navCtrl: NavController, public pathService: PathService ) {
    this.paths = pathService.paths;
  }

}
