export interface ToDoItem {
    id: number;
    active: boolean;
    text: string;
}

export interface FilterStatus {
    all: boolean;
    active: boolean;
    completed: boolean;
}

export interface ErrorResponse {
    status: number;
    message: string;
}
