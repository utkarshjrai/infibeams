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
  original: any;
  productFilter: ProductFilter = new ProductFilter();
  storageRange = ['0', '250GB', '500GB', '1TB', '2TB', '3TB', '4TB', '8TB', '12TB', '24TB', '48TB', '72TB'];
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
      this.productList = res.Products;
      this.original = res.Products;
    });
  }

  // NEEDS REFACTORING
  applyFilter(value, filterFor) {
    console.log(value, filterFor);
    this.productList = this.original;
    let filterValue;
    if (filterFor === 'hardDisk') {
      filterValue = [value.detail.value];
    }
    else {
      filterValue = this.ram.filter(r => r.isChecked);
      filterValue = filterValue.map(s => s.value);
    }
    this.productFilter[filterFor] = filterValue;
    if (this.productFilter.hardDisk.length > 0) {
      this.productList = this.productList.filter(x => x.HDD.match(/[SATA || SAS || SSD]{2,}/)[0] === this.productFilter.hardDisk[0]);
    }
    if (this.productFilter.ram.length > 0) {
      this.productList = this.productList.filter(x => this.productFilter.ram.includes(x.RAM.match(/[4GB || 8GB || 16GB || 12GB || 24GB || 32GB || 48GB || 96GB]{2,}/)[0]));
    }
  }

  getRange(rangeValue) {
    console.log(rangeValue);
  }
}

