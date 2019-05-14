import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InitializationService {
    private dataLink: string = './assets/api/tasks.json';

    constructor(private http: HttpClient) { }

    public getInitialTasksList(): any {
        return this.http.get(this.dataLink, {});
    }
}
