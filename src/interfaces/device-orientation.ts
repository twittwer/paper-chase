export interface DeviceOrientationWatcher {
  ( heading: number, headingAccuracy: number, updatedAt: number ): void;
}

export interface DirectionWatcher {
  ( direction: number ): void;
}
