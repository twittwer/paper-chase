import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the PathService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class PathService {
  data: any;
  dummyData = [
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
        {}
      ]
    }
  ];

  constructor ( public http: Http ) {
    this.data = null;
  }

  load () {
    if ( this.data ) {
      return Promise.resolve( this.data );
    }

    return new Promise( resolve => {
      setTimeout( () => {
        this.data = this.dummyData;
        resolve( this.data );
      }, Math.random() * 1000 + 500 );
    } );


    /*return new Promise( resolve => {
     this.http.get( 'path/to/data.json' )
     .map( res => res.json() )
     .subscribe( data => {
     this.data = data;
     resolve( this.data );
     } );
     } );*/
  }
}
