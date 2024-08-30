import { RideModel } from '../../shared/types/ride.model';

export interface DialogUpdateTimeData {
  id: number;
  scheduleRideId: number;
  ride: RideModel;
}
