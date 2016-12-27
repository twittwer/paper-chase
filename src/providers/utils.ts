export default class Utils {

  public static toRadians ( degrees: number ): number {
    return degrees * Math.PI / 180;
  }
  public static toDegrees ( radians: number ): number {
    return radians * 180 / Math.PI;
  }
}
