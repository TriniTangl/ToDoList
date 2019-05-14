import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material/angular-material.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ToDoItemComponent} from './to-do-item/to-do-item.component';

@NgModule({
    declarations: [
        AppComponent,
        ToDoItemComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularMaterialModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
