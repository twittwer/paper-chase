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

interface MetaPath {
  path: UserPath;
  counter: {
    points: number;
    pointsPending: number;
    pointsRight: number;
    pointsWrong: number;
  };
  index: {
    activePoint: number;
  };
}

@Injectable()
export class UserService {

  paths: UserPath[] = [];
  active: MetaPath = null;

  constructor ( public http: Http ) {
    //http.get
    // setTimeout( () => {
    //   this.paths.length = 0;
    //   let dummyData = [
    //     {
    //       id        : 1235,
    //       name      : "History of Stuttgart",
    //       createdAt : new Date( 1480493021 ),
    //       updatedAt : new Date( 1480594021 ),
    //       startedAt : new Date( 1480954184 ),
    //       finishedAt: new Date( 1480994210 ),
    //       points    : []
    //     }
    //   ];
    //   Array.prototype.push.apply( this.paths, dummyData );
    //
    //   console.log( 'UserService GET finished:', this.paths );
    // }, Math.random() * 1000 + 500 );
  }

  update ( paths: UserPath[] ) {
    //http.post()
    console.log( 'UserService POST to server:', paths );

    this.paths.length = 0;
    Array.prototype.push.apply( this.paths, paths );
  }

  addPath ( path: Path ) {
    if ( !this.isPathAlreadyStarted( path.id ) ) {
      let newPath = this.initUserPath( path );
      this.paths.push( newPath );
      this.setCurrentPath( newPath );
    } else {
      this.setCurrentPath( this.getPathById( path.id ) );
    }
  }

  setCurrentPath ( path: UserPath ) {
    let meta: MetaPath = {
      path   : path,
      counter: {
        points       : path.points.length,
        pointsPending: 0,
        pointsRight  : 0,
        pointsWrong  : 0
      },
      index  : {
        activePoint: 0
      }
    };

    let hookUpFound: boolean = false;
    path.points.forEach( ( point: UserPoint ) => {
      switch ( point.status ) {
        case 'pending':
          meta.counter.pointsPending++;
          hookUpFound = true;
          break;
        case 'right':
          meta.counter.pointsRight++;
          if ( !hookUpFound ) {
            meta.index.activePoint++;
          }
          break;
        case 'wrong':
          meta.counter.pointsWrong++;
          if ( !hookUpFound ) {
            meta.index.activePoint++;
          }
          break;
      }
    } );

    this.active = meta;
  }

  public stopCurrentPath () {
    this.active = null;
  }

  public initUserPath ( path: Path ): UserPath {
    let points: UserPoint[] = [];
    path.points.forEach( ( point: Point ) => {
      points.push( {
        id         : point.id,
        coordinates: point.coordinates,
        question   : point.question,
        status     : 'pending'
      } );
    } );
    return {
      id        : path.id,
      name      : path.name,
      createdAt : path.createdAt,
      updatedAt : path.updatedAt,
      startedAt : new Date(),
      finishedAt: null,
      points    : points
    };
  }

  public getPathById ( id: number ): UserPath {
    let needle: UserPath = null;
    this.paths.forEach( ( path: UserPath ) => {
      if ( path.id === id ) {
        needle = path;
      }
    } );
    return needle;
  }

  public isPathAlreadyStarted ( id: number ): boolean {
    return (this.getPathById( id ) !== null);
  }
}
