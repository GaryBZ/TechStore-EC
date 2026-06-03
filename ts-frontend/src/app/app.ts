import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Footer } from './layout/footer/footer';
import { Navbar } from './layout/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ts-frontend');
  protected readonly showLayout = signal(true);

  constructor(private readonly router: Router) {
    this.updateLayoutVisibility(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.updateLayoutVisibility((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private updateLayoutVisibility(url: string): void {
    this.showLayout.set(!url.startsWith('/authentication'));
  }
}
