import {Component, OnInit} from '@angular/core';
import {LocalstorageService} from './services/localstorage.service';
import {InitializationService} from './services/initialization.service';
import {FilterStatus, ToDoItem} from './interfaces/basic';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public tasksList: Array<ToDoItem>;
    public textNewTask: string;
    public counterActiveTasks: number;
    public filters: FilterStatus;

    constructor(
        private localstorageService: LocalstorageService,
        private initializationService: InitializationService) {
        this.tasksList = [];
        this.counterActiveTasks = 0;
        this.filters = {
            allFilter: true,
            activeFilter: false,
            completedFilter: false
        };
    }

    ngOnInit(): void {
        if (Boolean(this.localstorageService.getData('TaskObject')) === false) {
            this.initializationService.getInitialTasksList()
                .subscribe(
                    (data: ToDoItem) => {
                        this.localstorageService.setData(
                            'TaskObject',
                            JSON.stringify(data));
                        this.updateTasksListVariable();
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        }
        this.updateTasksListVariable();
    }

    onSubmit(): void {
        const item: ToDoItem = {
            id: new Date().getTime(),
            active: false,
            text: this.textNewTask
        };
        this.tasksList.push(item);
        this.textNewTask = '';
        this.updateLocalstorageData();
    }

    updateTasksListVariable(): void {
        if (Boolean(this.localstorageService.getData('TaskObject'))) {
            this.tasksList = JSON.parse(this.localstorageService.getData('TaskObject'));
            this.getCountActiveTasks();
        }
    }

    updateLocalstorageData(): void {
        this.localstorageService.setData(
            'TaskObject',
            JSON.stringify(this.tasksList));
    }

    getCountActiveTasks(): void {
        this.counterActiveTasks = 0;
        for (const item of this.tasksList) {
            if (item.active === false) {
                this.counterActiveTasks++;
            }
        }
    }

    changeStatusAllTask(event): void {
        for (const item of this.tasksList) {
            item.active = event.checked;
        }
        this.updateLocalstorageData();
    }

    clearCompletedTasks(): void {
        let temp: any;
        this.updateTasksListVariable();
        temp = this.tasksList.filter(item => item.active === false);
        this.tasksList = temp;
        this.updateLocalstorageData();
    }

    showAllTasks(): void {
        this.updateTasksListVariable();
        this.filters = {
            allFilter: true,
            activeFilter: false,
            completedFilter: false
        };
    }

    showActiveTasks(): void {
        let temp: any;
        this.updateTasksListVariable();
        temp = this.tasksList.filter(item => item.active === false);
        this.tasksList = temp;
        this.filters = {
            allFilter: false,
            activeFilter: true,
            completedFilter: false
        };
    }

    showCompletedTasks(): void {
        let temp: any;
        this.updateTasksListVariable();
        temp = this.tasksList.filter(item => item.active === true);
        this.tasksList = temp;
        this.filters = {
            allFilter: false,
            activeFilter: false,
            completedFilter: true
        };
    }
}
