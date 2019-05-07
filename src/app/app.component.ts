import {Component, OnInit} from '@angular/core';
import {LocalstorageService} from './services/localstorage.service';
import {InitializationService} from './services/initialization.service';
import {FilterStatus, StatusTask, ToDoItem} from './interfaces/basic';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public tasksList: Array<ToDoItem>;
    public filters: FilterStatus;
    public textNewTask: string;
    public counterActiveTasks: number;
    public mainCheckboxStatus: boolean;

    constructor(
        private localstorageService: LocalstorageService,
        private initializationService: InitializationService) {
        this.tasksList = [];
        this.counterActiveTasks = 0;
        this.mainCheckboxStatus = false;
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
        if (this.textNewTask) {
            const item: ToDoItem = {
                id: new Date().getTime(),
                active: false,
                text: this.textNewTask
            };
            this.showAllTasks();
            this.tasksList.push(item);
            this.textNewTask = '';
            this.updateLocalstorageData();
            this.updateMainCheckbox();
        }
    }

    updateTasksListVariable(): void {
        if (Boolean(this.localstorageService.getData('TaskObject'))) {
            this.tasksList = JSON.parse(this.localstorageService.getData('TaskObject'));
            this.getCountActiveTasks();
            this.updateMainCheckbox();
        }
    }

    updateLocalstorageData(): void {
        this.localstorageService.setData(
            'TaskObject',
            JSON.stringify(this.tasksList));
        this.getCountActiveTasks();
    }

    updateMainCheckbox(): void {
        this.mainCheckboxStatus = this.tasksList.every(item => item.active === true) && this.tasksList.length > 0;
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
        this.showAllTasks();
        this.updateMainCheckbox();
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

    rememberStatusTask(task: StatusTask): void {
        let index: number;
        index = this.tasksList.findIndex(item => item.id === task.id);
        this.tasksList[index].active = task.status;
        this.updateLocalstorageData();
        this.updateMainCheckbox();
    }

    removeTask(id: number): void {
        let index: number;
        index = this.tasksList.findIndex(item => item.id === id);
        this.tasksList.splice(index, 1);
        this.updateLocalstorageData();
        this.updateMainCheckbox();
    }
}
