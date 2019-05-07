import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StatusTask} from '../interfaces/basic';

@Component({
    selector: 'app-to-do-item',
    templateUrl: './to-do-item.component.html',
    styleUrls: ['./to-do-item.component.scss']
})
export class ToDoItemComponent implements OnInit {

    @Input() taskId: number;
    @Input() taskIsActive: boolean;
    @Input() taskText: string;

    @Output() getStatusTaskEmitter = new EventEmitter<StatusTask>();
    @Output() removeTaskEmitter = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

    changeStatusTask(): void {
        let temp: StatusTask;
        this.taskIsActive = !this.taskIsActive;
        temp = {
            id: this.taskId,
            status: this.taskIsActive
        };
        this.getStatusTaskEmitter.emit(temp);
    }

    removeTask(): void {
        this.removeTaskEmitter.emit(this.taskId);
    }
}
