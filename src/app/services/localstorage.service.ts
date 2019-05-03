import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {

    constructor() {
    }

    getData(name: string) {
        return localStorage.getItem(name);
    }

    setData(name: string, data: string) {
        localStorage.setItem(name, data);
    }

    clearData(name: string) {
        localStorage.removeItem(name);
    }
}
