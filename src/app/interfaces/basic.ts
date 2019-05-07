export interface ToDoItem {
    id: number;
    active: boolean;
    text: string;
}

export interface FilterStatus {
    allFilter: boolean;
    activeFilter: boolean;
    completedFilter: boolean;
}

export interface StatusTask {
    id: number;
    status: boolean;
}
