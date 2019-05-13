import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ToDoItem} from '../interfaces/basic';

@Component({
    selector: 'app-to-do-item',
    templateUrl: './to-do-item.component.html',
    styleUrls: ['./to-do-item.component.scss']
})
export class ToDoItemComponent implements OnInit {

    @Input() task: ToDoItem;

    @Output() changeTaskEmitter = new EventEmitter<ToDoItem>();
    @Output() removeTaskEmitter = new EventEmitter<number>();

    @ViewChild('editInput') editInput: ElementRef;

    public editStatus: boolean;

    constructor() {
        this.editStatus = false;
    }

    ngOnInit() {
    }

    changeTask(action: string): void {
        switch (action) {
            case 'editText': {
                this.editStatus = !this.editStatus;
                break;
            }
            case 'changeStatus': {
                this.task.active = !this.task.active;
                break;
            }
            default: {
                break;
            }
        }
        this.changeTaskEmitter.emit({
            id: this.task.id,
            active: this.task.active,
            text: this.task.text
        });
    }

    removeTask(): void {
        this.removeTaskEmitter.emit(this.task.id);
    }

    startEditingTask(): void {
        this.editStatus = !this.editStatus;
        setTimeout(() => { // this will make the execution after the above boolean has changed ¯\_(ツ)_/¯
            this.editInput.nativeElement.focus();
        }, 0);
    }
}
