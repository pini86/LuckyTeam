import { Component, EventEmitter, Output } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as leaflet from 'leaflet'; // Изменили импорт на camelCase

@Component({
  selector: 'app-station-map',
  templateUrl: './station-map.component.html',
  styleUrl: './station-map.component.css',
  standalone: true,
  imports: [LeafletModule], // Подключаем модуль карты
})
export class StationMapComponent {
  map: leaflet.Map;
  marker: leaflet.Marker;

  // Событие для передачи координат в форму
  @Output() readonly coordinatesChanged = new EventEmitter<{ latitude: number; longitude: number }>();

  // Опции для инициализации карты
  mapOptions = {
    layers: [
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }),
    ],
    zoom: 6,
    center: leaflet.latLng(51.5074, -0.1278), // Центр по умолчанию (например, Лондон)
  };

  onMapReady(map: leaflet.Map): void {
    this.map = map;
  }

  onMapClick(event: leaflet.LeafletMouseEvent): void {
    const { lat, lng } = event.latlng;
    this.setMarker(lat, lng);

    // Передаём новые координаты в форму
    this.coordinatesChanged.emit({ latitude: lat, longitude: lng });
  }

  setMarker(latitude: number, longitude: number): void {
    if (this.marker) {
      this.marker.setLatLng([latitude, longitude]);
    } else {
      this.marker = leaflet.marker([latitude, longitude]).addTo(this.map);
    }
    this.map.setView([latitude, longitude], this.map.getZoom());
  }
}
