export interface ToDoItem {
    id: number;
    active: boolean;
    text: string;
}

export interface ToDoItemTransfer {
    id: number;
    active?: boolean;
    text?: string;
}

export interface FilterStatus {
    allFilter: boolean;
    activeFilter: boolean;
    completedFilter: boolean;
}
