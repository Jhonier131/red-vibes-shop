import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/core/store/car/car.service';
import { ShopService } from '../../services/shop.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { LoaderService } from 'src/app/core/services/loader.service';
import { constantes } from 'src/app/core/data/constantes';
import { Router } from '@angular/router';
import { CarItem } from 'src/app/core/data/models/car-model';

@Component({
  selector: 'app-womens',
  templateUrl: './womens.component.html',
  styleUrls: ['./womens.component.css'],
})
export class WomensComponent implements OnInit {
  private subs = new SubSink();
  public allClothes: any = [];
  public allFilters: any = [];
  public headFilters: any = [];
  public availableSizes: string[] = [];

  clotheSelected: any = null;
  sizes: string[] = ['S', 'M', 'L', 'XL'];
  tallaSeleccionada: string | null = null;
  filtrar: boolean = false;
  filterForm!: FormGroup;
  filterMode: string = '';
  public titleModdule: string = '';

  constructor(
    public loaderService: LoaderService,
    private carStoreService: CarService,
    private shopServices: ShopService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }  

  ngOnInit(): void {
    this.getFilters();
    this.loaderService.show();
    this.buildFilterForm();
    this.irAlInicio();
    this.getClothes()
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      order: [''],
      sizes: this.fb.array([]),
      categories: this.fb.array([])
    });
  }

  getClothes() {
    const url = window.location.pathname.includes('/shop/women') ? constantes.FILTER_WOMEN : constantes.FILTER_MEN; 
    this.subs.add(this.shopServices.getAllClothes(url).subscribe(respuesta => {
      this.allClothes = respuesta.payload;
      this.loaderService.hide();
      if(url === constantes.FILTER_WOMEN) {
        this.filterMode = constantes.FILTER_WOMEN;
        this.titleModdule = 'Ropa para mujer';
      } else {
        this.filterMode = constantes.FILTER_MEN;
        this.titleModdule = 'Ropa para hombre';
      }
      this.changeFilter();
    }));
  }

  hasAnyStock(product: CarItem): boolean {
    return Object.values(product.stock || {}).some((qty: any) => qty > 0);
  }

  getAvailableSizes(item: any): string[] {
    return Object.entries(item.stock || {})
      .filter(([size, qty]: any) => qty > 0)
      .map(([size]) => size);
  }


  getFilters() {
    this.subs.add(this.shopServices.getFilters().subscribe(respuesta => {
      this.allFilters = respuesta.payload;
    }));
  }

  changeFilter() {
    this.headFilters = this.filterMode === constantes.FILTER_WOMEN ?
      this.allFilters.filter((item: CarItem) => item.gender !== "M"):
      this.allFilters.filter((item: CarItem) => item.gender !== "F");
  }

  onChangeCategory(event: any) {
    const categoriesArray: FormArray = this.filterForm!.get('categories') as FormArray;

    if (event.checked) 
      categoriesArray.push(this.fb.control(event.source.value.id));
    else {
      const index = categoriesArray.controls.findIndex(x => x.value === event.source.value);
      categoriesArray.removeAt(index);
    }
  }

  onCheckboxChange(event: any) {
    const tallasArray: FormArray = this.filterForm!.get('sizes') as FormArray;

    if (event.checked) {
      tallasArray.push(this.fb.control(event.source.value));
    } else {
      const index = tallasArray.controls.findIndex(x => x.value === event.source.value);
      tallasArray.removeAt(index);
    }
  }

  irAlInicio() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  addCarItem(item:any) {
    if(item.sizeSelected.length) this.carStoreService.addNewItem(item);
  }

  seleccionarTalla(item: any, sizeSelected: string): void {
    this.allClothes.map((element: any) => {
      if(element.id === item.id) element.sizeSelected = sizeSelected;
      return element;
    });
  }

  calcPrice(price: number, offSale: number): number {
    return price - (price * offSale / 100);
  }
  
  openFilter() {
    this.filtrar = true;
    document.body.classList.add('no-scroll');
  }

  closeFilter() {
    this.filtrar = false;
    this.filterForm!.reset();
    const tallasArray = this.filterForm.get('sizes') as FormArray;
    const cayegoriesArray = this.filterForm.get('categories') as FormArray;
    while(tallasArray.length) tallasArray.removeAt(0);
    while(cayegoriesArray.length) cayegoriesArray.removeAt(0);
    document.body.classList.remove('no-scroll');
  }

  aplyFilter() {
    this.loaderService.show();
    this.getClothesFiltered(this.filterForm!.value);
    this.closeFilter();
  }

  filterByCategory(category: any):void {
    this.loaderService.show();
    this.getClothesFiltered({'categories':[category.id]});
  }

  getClothesFiltered(filters: any) {
    this.subs.add(this.shopServices.aplyFilters(filters, this.filterMode).subscribe(resp => {
      this.allClothes = resp.payload;
      this.loaderService.hide();
    }));
  }

  openDetail(id: string) {
    this.loaderService.show();
    this.router.navigate(['/shop/detail/' + id]);
  }
}
