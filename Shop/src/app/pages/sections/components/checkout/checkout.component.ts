import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { constantes } from 'src/app/core/data/constantes';
import { CountryService } from 'src/app/core/services/country.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PaymentsService } from 'src/app/core/services/payments.service';
import { SweetAlertService } from 'src/app/core/services/sweet-alert.service';
import { CarService } from 'src/app/core/store/car/car.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild('formPay', { static: true }) formPay!: ElementRef;
  checkoutForm!: FormGroup;
  allCarItems!: any;
  private items: any[] = [];
  public departments: any[] = [];
  public cities: any[] = [];
  public constantes = constantes;
  private mensaje: string = '';
  public shippingCost: number = 10000;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loaderService: LoaderService,
    private carStoreService: CarService,
    private paymentsService: PaymentsService,
    private countryService: CountryService,
    private sweetAlertService: SweetAlertService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.getItemsStorage();
    this.buildForm();
    this.validatePayment();
  }

  ngAfterViewInit(): void {}

  get fullName() {
    return this.checkoutForm.get('fullName');
  }
  get documentId() {
    return this.checkoutForm.get('documentId');
  }
  get email() {
    return this.checkoutForm.get('email');
  }
  get phone() {
    return this.checkoutForm.get('phone');
  }
  get department() {
    return this.checkoutForm.get('department');
  }
  get city() {
    return this.checkoutForm.get('city');
  }
  get address() {
    return this.checkoutForm.get('address');
  }
  get paymentMethod() {
    return this.checkoutForm.get('paymentMethod');
  }

  get validateFullName(): boolean {
    return this.fullName!.invalid && this.fullName!.touched;
  }

  get validateDocumentId(): boolean {
    return this.documentId!.invalid && this.documentId!.touched;
  }

  get validateEmail(): boolean {
    return this.email!.invalid && this.email!.touched;
  }
  
  get validatePhone(): boolean {
    return this.phone!.invalid && this.phone!.touched;
  }

  get validateDepartment(): boolean {
    return this.department!.invalid && this.department!.touched;
  }

  get validateCity(): boolean {
    return this.city!.invalid && this.city!.touched;
  }

  get validateAddress(): boolean {
    return this.address!.invalid && this.address!.touched;
  }

  getCountries() {
    this.countryService
      .getDepartments()
      .subscribe((resp: any) => (this.departments = resp));
  }

  onDepartmentChange(dep: any) {
    this.city?.setValue('');
    this.countryService
      .getCitiesByDepartment(dep.value)
      .subscribe((resp: any) => {
        this.cities = resp;
      });
  }

  fetchCitiesByDepartment(idDepartment: number) {
    this.countryService
      .getCitiesByDepartment(idDepartment)
      .subscribe((resp: any) => {
        this.cities = resp;
      });
  }

  buildForm(): void {
    this.checkoutForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      documentId: ['', [Validators.required, Validators.minLength(6)]],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  getItemsStorage() {
    this.carStoreService.selectCarItems$().subscribe((resp: any) => {
      this.allCarItems = resp.carItems.filter(
        (item: any) => Object.keys(item).length > 0
      );
      this.items = this.allCarItems.map((item: any) => ({
        productId: item._id,
        size: item.sizeSelected,
        quantity: item.quantity,
      }));
    });
  }

  getTotal(): number {
    let total = 0;
    this.allCarItems.map((item: any) => {
      if (Object.keys(item).length) total += this.calcPrice(item.price, item.offSale) * item.quantity;
    });
    return total + this.shippingCost;
  }

  calcPrice(price: number, offSale: number): number {
    return price - (price * offSale / 100);
  }

  confirmPayment() {

    if(this.checkoutForm.invalid || this.getTotal() <= this.shippingCost) {
      if(!this.getTotal()) this.sweetAlertService.showWarning('Error', 'No hay productos en el carrito');
      else this.sweetAlertService.showWarning('Error', 'Verifica los datos');
      return Object.values(this.checkoutForm.controls).forEach(constrols => constrols.markAllAsTouched());
    } else {
      let datos = {
        ...this.checkoutForm.value,
        amount: this.getTotal(),
        items: this.items,
      };
  
  
      this.paymentsService.getPayForm(datos).subscribe((html) => {
        const form = this.formPay.nativeElement;
        form.innerHTML = html.payload;
        form.querySelector('form').submit();
      });
    }

  }

  validatePayment() {
    this.route.queryParams.subscribe(params => {
      if(!params['transactionState']) return;
      const transactionState = params['transactionState'];
      const labTransactionState = params['lapTransactionState'];
      const referenceCode = params['referenceCode'];

      switch (transactionState) {
        case '4':
          this.mensaje = '¡Gracias! Tu pago fue aprobado. Enviamos un email a tu correo.';
          this.carStoreService.clearCar();
          this.sweetAlertService.showSuccess(`${labTransactionState}`, this.mensaje);
          break;
        case '6':
          this.mensaje = 'El pago fue rechazado. Intenta nuevamente.';
          break;
        case '104':
          this.mensaje = 'Error en la transacción.';
          break;
        case '7':
          this.mensaje = 'El pago está pendiente. Te notificaremos al aprobarse.';
          break;
      }
      if(transactionState !== '4') this.sweetAlertService.showError(labTransactionState, this.mensaje);
    });
  }
}
