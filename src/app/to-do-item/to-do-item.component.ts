import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ToDoItem} from '../interfaces/basic';

@Component({
    selector: 'app-to-do-item',
    templateUrl: './to-do-item.component.html',
    styleUrls: ['./to-do-item.component.scss']
})
export class ToDoItemComponent implements OnInit {

    @Input() taskId: number;
    @Input() taskIsActive: boolean;
    @Input() taskText: string;

    @Output() changeStatusTaskEmitter = new EventEmitter<ToDoItem>();
    @Output() editTaskTextEmitter = new EventEmitter<ToDoItem>();
    @Output() removeTaskEmitter = new EventEmitter<number>();

    public editStatus: boolean;

    @ViewChild('editInput') editInput: ElementRef;

    constructor() {
        this.editStatus = false;
    }

    ngOnInit() {
    }

    changeStatusTask(): void {
        let temp: ToDoItem;
        this.taskIsActive = !this.taskIsActive;
        temp = {
            id: this.taskId,
            active: this.taskIsActive
        };
        this.changeStatusTaskEmitter.emit(temp);
    }

    removeTask(): void {
        this.removeTaskEmitter.emit(this.taskId);
    }

    editTaskText(): void {
        this.editStatus = !this.editStatus;
        setTimeout(() => { // this will make the execution after the above boolean has changed
            this.editInput.nativeElement.focus();
        }, 0);
    }

    saveEditTaskText(): void {
        let temp: ToDoItem;
        this.editStatus = !this.editStatus;
        temp = {
            id: this.taskId,
            text: this.taskText
        };
        this.editTaskTextEmitter.emit(temp);
    }
}
