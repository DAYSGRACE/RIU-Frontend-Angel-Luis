import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hero-layout',
  imports: [RouterOutlet],
  templateUrl: './hero-layout.html',
  styleUrl: './hero-layout.css',
})
export default class HeroLayout {

  title = signal<string>('Heroes App')
}
