import { Path } from './path-service';

export const dummyChases: Path[] = [
  {
    id       : 1234,
    name     : "Die neue Route",
    createdAt: new Date( 1480593021 ),
    updatedAt: new Date( 1480594021 ),
    points   : [
      {
        id         : 123,
        question   : {
          text   : "Wie ist die Hausnummer vom gelben Haus?",
          options: [
            "32",
            "33",
            "34",
            "35"
          ],
          answer : 2,
        },
        coordinates: {
          latitude : 48.774063,
          longitude: 9.171182
        }
      },
      {
        id         : 124,
        question   : {
          text   : "Wie ist die Hausnummer vom roten Haus?",
          options: [
            "22",
            "21",
            "20",
            "23"
          ],
          answer : 2,
        },
        coordinates: {
          latitude : 48.773580,
          longitude: 9.172050
        }
      }
    ]
  },
  {
    id       : 1235,
    name     : "History of Stuttgart",
    createdAt: new Date( 1480493021 ),
    updatedAt: new Date( 1480594021 ),
    points   : [
      {
        id         : 123,
        question   : {
          text   : "Welches wichtige Gebäude befindet sich an diesem Platz?",
          options: [
            "32",
            "33",
            "34",
            "35"
          ],
          answer : 2,
        },
        coordinates: {
          latitude : 48.774063,
          longitude: 9.171182
        }
      },
      {
        id         : 124,
        question   : {
          text   : "Wie ist die Hausnummer vom roten Haus?",
          options: [
            "22",
            "21",
            "20",
            "23"
          ],
          answer : 2,
        },
        coordinates: {
          latitude : 48.773580,
          longitude: 9.172050
        }
      }
    ]
  }
];
