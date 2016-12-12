import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Path, Point } from './path-service';
import { Observable, Observer } from 'rxjs';


export interface UserPath extends Path {
  startedAt: Date,
  finishedAt: Date,
  points: UserPoint[],
}
export interface UserPoint extends Point {
  status: 'right'|'wrong'|'pending',
}
/*
 Generated class for the PathService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class UserService {
  paths: UserPath[] = [];

  dummyData = [
    {
      id        : 1235,
      name      : "History of Stuttgart",
      createdAt : new Date( 1480493021 ),
      updatedAt : new Date( 1480594021 ),
      startedAt : new Date( 1480954184 ),
      finishedAt: new Date( 1480994210 ),
      points    : []
    }
  ];

  constructor ( public http: Http ) {
    //http.get
    setTimeout( () => {
      this.paths.length = 0;
      Array.prototype.push.apply(this.paths, this.dummyData);

      console.log( 'UserService GET finished:', this.paths);
    }, Math.random() * 1000 + 500 );
  }

  update ( paths: UserPath[] ) {
    //http.post()
    console.log( 'UserService POST to server:', paths );

    this.paths.length = 0;
    Array.prototype.push.apply(this.paths, paths);
  }
}
