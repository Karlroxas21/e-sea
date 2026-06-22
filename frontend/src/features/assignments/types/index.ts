export type Vessel = {
    id: string;
    name: string;
    imoNumber: string;
    type: string;
    flag: string;
};

export type Position = {
    id: string;
    title: string;
};

export type Principal = {
    id: string;
    name: string;
};

export type Assignment = {
    id: string;
    status: string;
    signOnDate: string;
    warning: string;
    signOffDate: string;
    signOnPort: string;
    signOffPort: string;
    durationDays: number;
    vessel: Vessel;
    position: Position;
};

export type SeaTime = {
    days: number;
    totalSeaDays?: number;
};

export type AssignmentStats = {
    totalActive: number;
    totalUpcoming: number;
    totalHistory: number;
    all: number;
};

export type PaginatedResponse<T> = {
    items: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
};
