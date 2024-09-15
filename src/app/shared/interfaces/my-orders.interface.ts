export interface Order {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  userId: number;
  status: 'active' | 'completed' | 'rejected' | 'canceled'; // статус заказа
  path: number[]; // Список идентификаторов станций
  carriages: string[]; // Список типов вагонов
  schedule: {
    segments: {
      // Сегменты дороги между станциями
      start: string; // начало сегмента
      end: string; // конец сегмента
    }[];
    time: string[]; // Время [отправление, прибытие]
  };
  price: Record<string, number>; // Цены по типам вагонов
}
