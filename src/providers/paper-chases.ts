import { Path } from './path-service';

export const dummyChases: Path[] = [
  {
    id       : 1111,
    name     : "Die neue Route",
    createdAt: new Date( 1480593021 ),
    updatedAt: new Date( 1480594021 ),
    points   : [
      {
        id         : 111,
        question   : {
          text   : "Welches Insekt lebt in diesen Straßen?",
          options: [
            "Schmetterling",
            "Bienen",
            "Ameisen"
          ],
          answer : 0,
        },
        coordinates: {
          latitude : 53.121109,
          longitude: 9.772811
        }
      },
      {
        id         : 112,
        question   : {
          text   : "Welche roten Beeren gibt es in diesen Straßen?",
          options: [
            "Schlehen",
            "Hagebutten",
            "Holunder",
            "Vogelbeeren"
          ],
          answer : 2,
        },
        coordinates: {
          latitude : 53.123915,
          longitude: 9.776018
        }
      },
      {
        id         : 113,
        question   : {
          text   : "Aus welchem Material besteht die Fassade des Supermarkt?",
          options: [
            "Beton",
            "Wellblech",
            "Ziegelstein",
            "Holz"
          ],
          answer : 2,
        },
        coordinates: {
          latitude : 53.119993,
          longitude: 9.782068
        }
      }
    ]
  },
  {
    id       : 2222,
    name     : "History of Stuttgart",
    createdAt: new Date( 1480493021 ),
    updatedAt: new Date( 1480594021 ),
    points   : [
      {
        id         : 221,
        question   : {
          text   : "Welches Gebäude befindet sich an diesem Platz?",
          options: [
            "Das Schloss",
            "Das Rathaus",
            "Die SWR Station",
            "Das Stadion"
          ],
          answer : 1,
        },
        coordinates: {
          latitude : 48.775223,
          longitude: 9.178362
        }
      },
      {
        id         : 222,
        question   : {
          text   : "Welches Gebäude befindet sich an diesem Platz?",
          options: [
            "Das Gerber",
            "Die Schwabengalerie",
            "Das Rathaus",
            "Das Schloss"
          ],
          answer : 3,
        },
        coordinates: {
          latitude : 48.778350,
          longitude: 9.180615
        }
      },
      {
        id         : 223,
        question   : {
          text   : "Welches wichtige Gebäude befindet sich in deiner Nähe?",
          options: [
            "Die Liederhalle",
            "Die Schwabengalerie",
            "Die Staatsgalerie",
            "Das Schloss"
          ],
          answer : 0,
        },
        coordinates: {
          latitude : 48.779326,
          longitude: 9.185832
        }
      }
    ]
  }
];
