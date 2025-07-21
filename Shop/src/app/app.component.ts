import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { SweetAlertService } from './core/services/sweet-alert.service';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Red Vibes';
  public hiddeFooter: boolean = false;
  public isLoading = this.loaderService.loading$;

  constructor(private loaderService: LoaderService, private toastService: ToastService) { }
private deferredPrompt: any;
  ngOnInit(): void {
    this.hiddeFooter = !window.location.pathname.includes('/home');
    window.addEventListener('beforeinstallprompt', (e) => {
      this.deferredPrompt = e;
      this.toastService.showInstallToast(() => this.installApp());
    });
  }

  installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('El usuario aceptó la instalación');
        } else {
          console.log('El usuario canceló la instalación');
        }
        this.deferredPrompt = null;
      });
    }
  }
}
