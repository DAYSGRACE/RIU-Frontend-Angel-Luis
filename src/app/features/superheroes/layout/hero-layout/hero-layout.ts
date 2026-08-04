import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroNavbar } from '../../components/hero-navbar/hero-navbar';

@Component({
  selector: 'app-hero-layout',
  imports: [RouterOutlet, HeroNavbar],
  templateUrl: './hero-layout.html',
  styleUrl: './hero-layout.scss',
})
export default class HeroLayout {}
