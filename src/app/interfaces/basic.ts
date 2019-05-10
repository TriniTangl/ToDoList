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
    all: boolean;
    active: boolean;
    completed: boolean;
}
