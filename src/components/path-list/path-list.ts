import { Component, Input } from '@angular/core';
import { UserPath, UserService } from '../../providers/user-service';
import { Path } from '../../providers/path-service';

@Component( {
  selector   : 'path-list',
  templateUrl: 'path-list.html'
} )
export class PathListComponent {

  @Input() paths: UserPath[]|Path[] = [];
  @Input() type: 'Path'|'UserPath' = 'Path';
  @Input() readonly: boolean = false;

  constructor ( private userService: UserService ) {
  }

  onPathSelect ( path: UserPath|Path ) {
    if ( this.readonly ) {
      return;
    }
    if ( this.type === 'Path' ) {
      this.userService.addPath( path );
    } else if ( this.type === 'UserPath' ) {
      this.userService.reactivatePath( <UserPath>path );
    }
  }
}
