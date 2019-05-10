import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ToDoItemTransfer} from '../interfaces/basic';

@Component({
    selector: 'app-to-do-item',
    templateUrl: './to-do-item.component.html',
    styleUrls: ['./to-do-item.component.scss']
})
export class ToDoItemComponent implements OnInit {

    @Input() taskId: number;
    @Input() taskIsActive: boolean;
    @Input() taskText: string;

    @Output() changeTaskStatusEmitter = new EventEmitter<ToDoItemTransfer>();
    @Output() editTaskTextEmitter = new EventEmitter<ToDoItemTransfer>();
    @Output() removeTaskEmitter = new EventEmitter<number>();

    @ViewChild('editInput') editInput: ElementRef;

    public editStatus: boolean;

    constructor() {
        this.editStatus = false;
    }

    ngOnInit() {
    }

    changeTaskStatus(): void {
        let temp: ToDoItemTransfer;
        this.taskIsActive = !this.taskIsActive;
        temp = {
            id: this.taskId,
            active: this.taskIsActive
        };
        this.changeTaskStatusEmitter.emit(temp);
    }

    removeTask(): void {
        this.removeTaskEmitter.emit(this.taskId);
    }

    editTaskText(): void {
        this.editStatus = !this.editStatus;
        setTimeout(() => { // this will make the execution after the above boolean has changed ¯\_(ツ)_/¯
            this.editInput.nativeElement.focus();
        }, 0);
    }

    saveEditTaskText(): void {
        let temp: ToDoItemTransfer;
        this.editStatus = !this.editStatus;
        temp = {
            id: this.taskId,
            text: this.taskText
        };
        this.editTaskTextEmitter.emit(temp);
    }
}
