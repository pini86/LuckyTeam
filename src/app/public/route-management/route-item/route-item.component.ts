import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatRipple } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-route-item',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, MatIconModule, MatFabButton, MatRipple, MatTabGroup],
  templateUrl: './route-item.component.html',
  styleUrl: './route-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteItemComponent implements OnInit {
  protected readonly _auth = inject(AuthService);

  ngOnInit(): void {
    console.log('[21] 🚀:', this._auth.isAdmin());
  }
}
