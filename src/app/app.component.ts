import {Component, OnInit} from '@angular/core';
import {LocalstorageService} from './services/localstorage.service';
import {InitializationService} from './services/initialization.service';
import {FilterStatus, ToDoItem, ToDoItemTransfer} from './interfaces/basic';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public taskList: Array<ToDoItem>;
    public renderList: Array<ToDoItem>;
    public filters: FilterStatus;
    public textNewTask: string;
    public counterActiveTasks: number;
    public mainCheckboxStatus: boolean;

    constructor(private initializationService: InitializationService) {
        this.taskList = [];
        this.renderList = this.taskList;
        this.counterActiveTasks = 0;
        this.mainCheckboxStatus = false;
        this.filters = {
            allFilter: true,
            activeFilter: false,
            completedFilter: false
        };
    }

    ngOnInit(): void {
        if (LocalstorageService.checkData('TasksDB') === false) {
            this.initializationService.getInitialTasksList()
                .subscribe(
                    (data: ToDoItem) => {
                        LocalstorageService.setData('TasksDB', data);
                        this.updateTasksList();
                        this.updateRenderList();
                    },
                    (error: any) => {
                        console.log(error);
                    }
                );
        }
        this.updateTasksList();
        this.updateRenderList();
    }

    createNewTask(): void {
        if (this.textNewTask.length > 0) {
            const item: ToDoItem = {
                id: new Date().getTime(),
                active: false,
                text: this.textNewTask
            };
            this.taskList.push(item);
            this.textNewTask = '';
            this.updateLocalstorageData();
            this.updateRenderList();
        }
    }

    updateTasksList(): void {
        if (LocalstorageService.checkData('TasksDB')) {
            this.taskList = LocalstorageService.getData('TasksDB');
            this.getCountActiveTasks();
            this.updateMainCheckbox();
        }
    }

    updateRenderList(): void {
        if (this.filters.activeFilter) {
            this.taskFiltration('active', false);
        } else if (this.filters.completedFilter) {
            this.taskFiltration('completed', true);
        } else {
            this.taskFiltration('all');
        }
        this.getCountActiveTasks();
        this.updateMainCheckbox();
    }

    updateLocalstorageData(): void {
        LocalstorageService.setData('TasksDB', this.taskList);
    }

    updateMainCheckbox(): void {
        this.mainCheckboxStatus = this.taskList.every(item => item.active === true) && this.taskList.length > 0;
    }

    getCountActiveTasks(): void {
        this.counterActiveTasks = 0;
        this.taskList.forEach(item => {
            if (item.active === false) {
                this.counterActiveTasks++;
            }
        });
    }

    taskFiltration(type: string, subject?: boolean): void {
        this.filters = {
            allFilter: false,
            activeFilter: false,
            completedFilter: false
        };
        switch (type) {
            case 'all': {
                this.renderList = this.taskList;
                this.filters.allFilter = true;
                break;
            }
            case 'active': {
                this.renderList = this.taskList.filter(item => item.active === subject);
                this.filters.activeFilter = true;
                break;
            }
            case 'completed': {
                this.renderList = this.taskList.filter(item => item.active === subject);
                this.filters.completedFilter = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    changeStatusAllTask(event: any): void {
        this.taskList.forEach(item => item.active = event.checked);
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    clearCompletedTasks(): void {
        let temp: Array<ToDoItem>;
        temp = this.taskList.filter(item => item.active === false);
        this.taskList = temp;
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    changeStatusTask(task: ToDoItemTransfer): void {
        this.taskList[this.findIndexTask(task.id)].active = task.active;
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    editTaskText(task: ToDoItemTransfer): void {
        this.taskList[this.findIndexTask(task.id)].text = task.text;
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    removeTask(id: number): void {
        this.taskList.splice(this.findIndexTask(id), 1);
        this.updateLocalstorageData();
        this.updateRenderList();
    }

    findIndexTask(id: number): number {
        return this.taskList.findIndex(item => item.id === id);
    }
}
