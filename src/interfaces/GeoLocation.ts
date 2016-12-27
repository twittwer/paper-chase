export interface GeoLocationWatcher {
  ( coords: Coordinates, updatedAt: number ): void;
}

export interface DistanceWatcher {
  ( distance: number ): void;
}
