import { Component, Input } from '@angular/core';
import { UserPath } from '../../providers/user-service';
import { Path } from '../../providers/path-service';

@Component( {
  selector   : 'path-list',
  templateUrl: 'path-list.html'
} )
export class PathListComponent {

  @Input()
  paths: UserPath[]|Path[] = [];

  constructor () {
  }

}
