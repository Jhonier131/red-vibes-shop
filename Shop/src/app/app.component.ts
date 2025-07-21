import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Red Vibes';
  public hiddeFooter: boolean = false;
  public isLoading = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.hiddeFooter = !window.location.pathname.includes('/home'); 
  }
}
