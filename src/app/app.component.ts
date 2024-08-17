import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, } from '@angular/router';
import { HeaderComponent } from "./public/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
