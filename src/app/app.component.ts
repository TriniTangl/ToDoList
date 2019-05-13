import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from './services/local-storage.service';
import {InitializationService} from './services/initialization.service';
import {ErrorResponse, FilterStatus, ToDoItem} from './interfaces/basic';
import {MatCheckboxChange} from '@angular/material';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public taskList: Array<ToDoItem>;
    public renderList: Array<ToDoItem>;
    public filters: FilterStatus;
    public newTaskText: string;
    public activeTasksCounter: number;
    public mainCheckboxStatus: boolean;

    constructor(private initializationService: InitializationService) {
        this.taskList = [];
        this.renderList = this.taskList;
        this.activeTasksCounter = 0;
        this.mainCheckboxStatus = false;
        this.newTaskText = '';
        this.filters = {
            all: true,
            active: false,
            completed: false
        };
    }

    ngOnInit(): void {
        if (LocalStorageService.checkData('TasksDB') === false) {
            this.initializationService.getInitialTasksList()
                .subscribe(
                    (data: ToDoItem) => {
                        LocalStorageService.setData('TasksDB', data);
                        this.updateTasksList();
                        this.updateRenderList();
                    },
                    (error: ErrorResponse) => {
                        alert(`Status: ${error.status}\nMessage: ${error.message}`);
                        console.log(error);
                    }
                );
        }
        this.updateTasksList();
        this.updateRenderList();
    }

    get activeTasksCount(): number {
        return this.taskList.filter(item => item.active === false).length;
    }

    createNewTask(): void {
        if (this.newTaskText.length > 0) {
            const item: ToDoItem = {
                id: new Date().getTime(),
                active: false,
                text: this.newTaskText
            };
            this.taskList.push(item);
            this.newTaskText = '';
            this.updateLocalstorageData();
            this.updateRenderList();
        }
    }

    updateTasksList(): void {
        if (LocalStorageService.checkData('TasksDB')) {
            this.taskList = LocalStorageService.getData('TasksDB');
            this.updateMainCheckbox();
        }
    }

    updateRenderList(): void {
        if (this.filters.active) {
            this.filterTasks('active');
        } else if (this.filters.completed) {
            this.filterTasks('completed');
        } else {
            this.filterTasks('all');
        }
        this.updateMainCheckbox();
    }

    updateLocalstorageData(): void {
        LocalStorageService.setData('TasksDB', this.taskList);
    }

    updateMainCheckbox(): void {
        this.mainCheckboxStatus = this.taskList.every(item => item.active === true) && this.taskList.length > 0;
    }

    filterTasks(type: string): void {
        this.filters = {
            all: false,
            active: false,
            completed: false
        };
        switch (type) {
            case 'all': {
                this.renderList = this.taskList;
                this.filters.all = true;
                break;
            }
            case 'active': {
                this.renderList = this.taskList.filter(item => item.active === false);
                this.filters.active = true;
                break;
            }
            case 'completed': {
                this.renderList = this.taskList.filter(item => item.active === true);
                this.filters.completed = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    changeAllTasksStatus(event: MatCheckboxChange): void {
        this.taskList.forEach(item => item.active = event.checked);
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    clearCompletedTasks(): void {
        this.taskList = this.taskList.filter(item => item.active === false);
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    changeTask(task: ToDoItem): void {
        const index: number = this.findTaskIndex(task.id);
        this.taskList[index].active = task.active;
        this.taskList[index].text = task.text;
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    removeTask(id: number): void {
        this.taskList.splice(this.findTaskIndex(id), 1);
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    findTaskIndex(id: number): number {
        return this.taskList.findIndex(item => item.id === id);
    }
}
