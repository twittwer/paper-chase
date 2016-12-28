import { Component, Input } from '@angular/core';
import { UserPath, UserService } from '../../providers/user-service';
import { Path } from '../../providers/path-service';
import { NavController } from 'ionic-angular';

@Component( {
  selector   : 'path-list',
  templateUrl: 'path-list.html'
} )
export class PathListComponent {

  @Input() paths: UserPath[]|Path[] = null;
  @Input() type: 'Path'|'UserPath' = 'Path';
  @Input() readonly: boolean = false;

  constructor ( public navCtrl: NavController, private userService: UserService ) {
  }

  onPathSelect ( path: UserPath|Path ) {
    if ( this.readonly ) {
      return;
    }
    if ( this.type === 'Path' ) {
      this.userService.addPath( path );
    } else if ( this.type === 'UserPath' ) {
      this.userService.setCurrentPath( <UserPath>path );
    }
    this.navCtrl.parent.select( 1 );
  }
}
