import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {

    constructor() { }

    static getData(name: string): any {
        return JSON.parse(localStorage.getItem(name));
    }

    static setData(name: string, data: any): void {
        localStorage.setItem(name, JSON.stringify(data));
    }

    static clearData(name: string): void {
        localStorage.removeItem(name);
    }

    static checkData(name: string): boolean {
        return Boolean(localStorage.getItem(name));
    }
}
