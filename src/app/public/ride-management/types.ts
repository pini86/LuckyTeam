import { RideModel } from '../../shared/types/routes.model';

export interface DialogUpdateTimeData {
  id: number;
  scheduleRideId: number;
  ride: RideModel;
}
