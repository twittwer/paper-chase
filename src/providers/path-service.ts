import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Coordinates } from 'ionic-native';

export interface Path {
  id: number,
  name: string,
  createdAt: Date,
  updatedAt: Date,
  points: Point[],
}

export interface Point {
  id: number,
  question: {
    text: string,
    options: string[],
    answer: number,
  },
  coordinates: Coordinates
}

@Injectable()
export class PathService {

  paths: Path[] = [];
  dummyData: Path[] = [
    {
      id       : 1234,
      name     : "Die neue Route",
      createdAt: new Date( 1480593021 ),
      updatedAt: new Date( 1480594021 ),
      points   : [
        {
          id         : 123,
          question   : {
            text   : "Frage1: Wie ist die Hausnummer vom gelben Haus",
            options: [
              "32", "33", "34", "35"
            ],
            answer : 2,
          },
          coordinates: {
            latitude        : 48.774063,
            longitude       : 9.171182,
            accuracy        : 10,
            altitude        : null,
            altitudeAccuracy: null,
            heading         : null,
            speed           : null,
          }
        }, {
          id         : 124,
          question   : {
            text   : "Frage1: Wie ist die Hausnummer vom roten Haus",
            options: [
              "22", "21", "20", "23"
            ],
            answer : 2,
          },
          coordinates: {
            latitude        : 48.773580,
            longitude       : 9.172050,
            accuracy        : 10,
            altitude        : null,
            altitudeAccuracy: null,
            heading         : null,
            speed           : null,
          }
        }
      ]
    }, {
      id       : 1235,
      name     : "History of Stuttgart",
      createdAt: new Date( 1480493021 ),
      updatedAt: new Date( 1480594021 ),
      points   : [
      ]
    }
  ];

  constructor ( public http: Http ) {
    //http.get
    setTimeout( () => {
      this.paths.length = 0;
      Array.prototype.push.apply(this.paths, this.dummyData);

      console.log( 'PathService GET finished:', this.paths);
    }, Math.random() * 1000 + 500 );
  }

}
