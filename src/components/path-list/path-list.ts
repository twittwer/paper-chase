import { Component, Input } from '@angular/core';
import { UserPath } from '../../providers/user-service';
import { Path } from '../../providers/path-service';

/*
 Generated class for the PathList component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
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
