import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }

    public static getData(name: string): any {
        return JSON.parse(localStorage.getItem(name));
    }

    public static setData(name: string, data: any): void {
        localStorage.setItem(name, JSON.stringify(data));
    }

    public static clearData(name: string): void {
        localStorage.removeItem(name);
    }

    public static checkData(name: string): boolean {
        return Boolean(localStorage.getItem(name));
    }
}
