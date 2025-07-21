import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceCop'
})
export class PriceCopPipe implements PipeTransform {

  transform(value: number): string {
    if (typeof value !== 'number') {
      return '';
    }

    return '$' + value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

}
