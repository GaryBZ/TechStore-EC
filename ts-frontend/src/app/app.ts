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
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ts-frontend');
  protected readonly showLayout = signal(true);
  hideLayout = false;

  constructor(private router: Router) {
    this.hideLayout = this.shouldHideLayout(this.router.url);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hideLayout = this.shouldHideLayout((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private shouldHideLayout(url: string): boolean {
    return url.startsWith('/authentication') || url.startsWith('/login') || url.startsWith('/admin');
  }
}
