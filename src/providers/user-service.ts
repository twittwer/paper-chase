import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Path, Point } from './path-service';


export interface UserPath extends Path {
  startedAt: Date,
  finishedAt: Date,
  points: UserPoint[],
}

export interface UserPoint extends Point {
  status: 'right'|'wrong'|'pending',
}

@Injectable()
export class UserService {

  paths: UserPath[] = [];
  currentPath: UserPath = null;
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
      Array.prototype.push.apply( this.paths, this.dummyData );

      console.log( 'UserService GET finished:', this.paths );
    }, Math.random() * 1000 + 500 );
  }

  update ( paths: UserPath[] ) {
    //http.post()
    console.log( 'UserService POST to server:', paths );

    this.paths.length = 0;
    Array.prototype.push.apply( this.paths, paths );
  }

  addPath ( path: Path ) {
    let points: UserPoint[] = [];
    path.points.forEach( ( point: Point ) => {
      points.push( {
        id         : point.id,
        coordinates: point.coordinates,
        question   : point.question,
        status     : 'pending'
      } );
    } );
    let newPath: UserPath = {
      id        : path.id,
      name      : path.name,
      createdAt : path.createdAt,
      updatedAt : path.updatedAt,
      startedAt : new Date(),
      finishedAt: null,
      points    : points
    };
    this.paths.push( newPath );
    this.currentPath = newPath;
  }

  reactivatePath(path: UserPath) {
    this.currentPath = path;
  }
}
