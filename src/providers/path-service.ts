import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { dummyChases } from './paper-chases';
import { GeoPoint } from '../interfaces/geo-point';

export interface Path {
  id: number,
  name: string,
  createdAt: Date,
  updatedAt: Date,
  points: Point[],
}

export interface Point {
  id: number,
  question: Question,
  coordinates: GeoPoint
}

export interface Question {
  text: string;
  options: string[];
  answer: number;
}

@Injectable()
export class PathService {

  paths: Path[] = [];

  constructor ( public http: Http ) {
    //http.get
    setTimeout( () => {
      this.paths.length = 0;
      Array.prototype.push.apply( this.paths, dummyChases );

      console.log( 'PathService GET finished:', this.paths );
    }, Math.random() * 1000 + 500 );
  }

}
