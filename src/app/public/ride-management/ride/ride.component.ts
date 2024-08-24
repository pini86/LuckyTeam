import { KeyValuePipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { RideModel, Schedule } from '../../../shared/types/routes.model';

@Component({
  selector: 'app-ride',
  standalone: true,
  imports: [
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatGridList,
    MatGridTile,
    KeyValuePipe,
  ],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss',
})
export class RideComponent implements OnInit {
  public readonly ride = input.required<RideModel>();
  public readonly schedule = input.required<Schedule>();

  protected readonly price = signal(null);

  public ngOnInit(): void {
    console.log('[34] 🍄:', this.schedule().segments);
  }
}
