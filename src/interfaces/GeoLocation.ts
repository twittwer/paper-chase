export interface GapData {
  distance: number;
  angle: number;
}

export interface GeoLocationWatcher {
  ( coords: Coordinates, updatedAt: number ): void;
}

export interface DistanceWatcher {
  ( distance: number, angle: number ): void;
}
