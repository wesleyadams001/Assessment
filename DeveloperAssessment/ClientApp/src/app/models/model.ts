//a data model for our grid
export interface DataModel {
    id: string;
    title: string;
    section: string;
    link: string;
    value: string;
}

//a visualization model
export interface VisModel{
    name: string;
    value: number;
    color?: string;
}