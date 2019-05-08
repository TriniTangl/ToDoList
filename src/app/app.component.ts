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
            this.taskFiltration('all');
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
        this.tasksList.forEach(item => {
            if (item.active === false) {
                this.counterActiveTasks++;
            }
        });
    }

    changeStatusAllTask(event): void {
        this.taskFiltration('all');
        this.tasksList.forEach(item => {
            item.active = event.checked;
        });
        this.updateMainCheckbox();
        this.updateLocalstorageData();
    }

    clearCompletedTasks(): void {
        this.taskFiltration('active', false);
        this.updateLocalstorageData();
        this.taskFiltration('all');
        this.updateMainCheckbox();
    }

    taskFiltration(type: string, subject?: boolean) {
        let temp: any;
        this.updateTasksListVariable();
        this.filters = {
            allFilter: false,
            activeFilter: false,
            completedFilter: false
        };
        switch (type) {
            case 'all': {
                this.filters.allFilter = true;
                break;
            }
            case 'active': case 'completed': {
                temp = this.tasksList.filter(item => item.active === subject);
                this.tasksList = temp;
                switch (type) {
                    case 'active': {
                        this.filters.activeFilter = true;
                        break;
                    }
                    case 'completed': {
                        this.filters.completedFilter = true;
                        break;
                    }
                    default: {
                        break;
                    }
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    changeStatusTask(task: ToDoItem): void {
        this.tasksList[this.findIndexTask(task.id)].active = task.active;
        this.updateLocalstorageData();
        this.updateMainCheckbox();
    }

    editTaskText(task: ToDoItem): void {
        this.tasksList[this.findIndexTask(task.id)].text = task.text;
        this.updateLocalstorageData();
    }

    removeTask(id: number): void {
        this.tasksList.splice(this.findIndexTask(id), 1);
        this.updateLocalstorageData();
        this.updateMainCheckbox();
    }

    findIndexTask(id: number): number {
        return  this.tasksList.findIndex(item => item.id === id);
    }
}
