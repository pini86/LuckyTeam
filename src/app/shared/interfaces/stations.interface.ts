export interface IStations {
  id: number;
  city: string;
  latitude: number;
  longitude: number;
  connectedTo: Record<string, number>;
}
