import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ProductFilter } from '../filter.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  productList: any;
  singleValue4: any;
  dualValue2 = {lower: 0, upper: 72};
  original: any;
  productFilter: ProductFilter = new ProductFilter();
  storageRange = [0, 250, 500, 1000, 2000, 3000, 4000, 8000, 12000, 24000, 48000, 72000];
  hardDisk = ['SAS', 'SSD', 'SATA'];
  ram = [{ value: '2GB', isChecked: false },
  { value: '4GB', isChecked: false },
  { value: '8GB', isChecked: false },
  { value: '12GB', isChecked: false },
  { value: '16GB', isChecked: false },
  { value: '24GB', isChecked: false },
  { value: '32GB', isChecked: false },
  { value: '48GB', isChecked: false },
  { value: '96GB', isChecked: false }];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
    this.apiService.getProductData().subscribe((res: any) => {
      res.Products.map(x => {
        x.storageSize = this.getStorageValue(x.HDD);
      });
      this.productList = res.Products;
      this.original = res.Products;
    });
  }

  // NEEDS REFACTORING
  applyFilter(value, filterFor) {
    console.log(value, filterFor);
    this.productList = this.original;
    let filterValue;
    if (filterFor === 'hardDisk' || filterFor === 'storage') {
      filterValue = [value.detail.value];
    }
    else {
      filterValue = this.ram.filter(r => r.isChecked);
      filterValue = filterValue.map(s => s.value);
    }
    this.productFilter[filterFor] = filterValue;
    console.log(this.productFilter, 'filter');
    if (this.productFilter.hardDisk.length > 0) {
      this.productList = this.productList.filter(x => x.HDD.match(/[SATA || SAS || SSD]{2,}/)[0] === this.productFilter.hardDisk[0]);
    }
    if (this.productFilter.ram.length > 0) {
      this.productList = this.productList.filter(x => this.productFilter.ram.includes(x.RAM.match(/[4GB || 8GB || 16GB || 12GB || 24GB || 32GB || 48GB || 96GB]{2,}/)[0]));
    }
    if (this.productFilter.storage.length > 0) {
      this.productList = this.productList.filter(x => this.storageRange[this.productFilter.storage[0].lower] <= x.storageSize &&
         this.storageRange[this.productFilter.storage[0].upper] >= x.storageSize);
    }
  }


  getStorageValue(val) {
    const str = val.replace(/[SATA2 | SSD | SAS]{3,}/, '');
    let finalValue;
    if (str.slice(-2) === 'GB') {
      const value = str.slice(0, -2);
      const splitter = value.split('x');
      finalValue = Number(splitter[0]) * Number(splitter[1]);
    } else if (str.slice(-2) === 'TB') {
      const value = str.slice(0, -2);
      const splitter = value.split('x');
      finalValue = (Number(splitter[0]) * Number(splitter[1])) * 1000;
    }
    return finalValue;
  }
}

