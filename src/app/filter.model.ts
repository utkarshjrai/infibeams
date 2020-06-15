export class ProductFilter {
    storage: Array<any>;
    ram: Array<number>;
    hardDisk: Array<string>;
    location: Array<string>;

    constructor(data?) {
        this.storage = (data && data.dateRange.length > 0) ? data.dateRange : [];
        this.ram = (data && data.accounts.length > 0) ? data.accounts : [];
        this.hardDisk = (data && data.cityAndStates.length > 0) ? data.cityAndStates : [];
        this.location = (data && data.workSites.length > 0) ? data.workSites : [];
    }
}
