import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component( {
  selector   : 'compass',
  templateUrl: 'compass.html'
} )
export class CompassComponent implements OnChanges {

  @Input() scale: number = 4;
  @Input() rotation: number = 0;

  public needleStyle: any = {};

  constructor () {
  }

  public ngOnChanges ( changes: SimpleChanges ): void {
    this.needleStyle = { 'transform': `scale(${this.scale}) rotate(${this.rotation}deg)` };
  }

}
