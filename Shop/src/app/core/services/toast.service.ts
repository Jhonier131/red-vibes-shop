import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private deferredPrompt: any = null;

  showInstallToast(installCallback: () => void) {
  // No mostrar en pantallas grandes (escritorio)
  if (window.innerWidth > 768) return; 
  Swal.fire({
    toast: true,
      title:
        '<span style="display:flex; align-items:center; gap:10px; font-size: 1.3rem !important; font-weight: bold"><img src="../../../../assets/img/LogosRV/LogoRedVibes.svg" style="width:5rem; height:5rem;"> ¿Quieres instalar nuestra app?</span>', 
      showConfirmButton: true,
      confirmButtonText: 'Instalar',
      confirmButtonColor: 'red',
      showCancelButton: true,
      cancelButtonText: 'Más tarde',
      cancelButtonColor: 'black',
      position: 'bottom-end',
      timer: 10000,
      timerProgressBar: true,
  }).then((result) => {
    if (result.isConfirmed) {
      installCallback();
    }
  });
}

  public successToast(message: string) {
    Swal.fire({
      toast: true,
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      position: 'bottom-end',
    });
  }

  public infoToast(message: string) {
    Swal.fire({
      toast: true,
      icon: 'info',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      position: 'bottom-end',
    });
  }

  public errorToast(message: string) {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      position: 'bottom-end',
    });
  }
}
