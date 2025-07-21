import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

   showSuccess(title: string, text?: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#3085d6',
    });
  }


  showError(title: string, text?: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#d33',
    });
  }

  showInfo(title: string, text?: string) {
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#3085d6',
    });
  }

  showWarning(title: string, text?: string) {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#f0ad4e',
    });
  }

  confirmDialog(
    title: string,
    text: string,
    confirmText: string = 'Sí',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => result.isConfirmed);
  }
}
