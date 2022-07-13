import { AcademicClass } from './AcademicClass';

export class Cycle{
    id: string;
    name: string;
    code: string;
    schoolId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    classes: AcademicClass[];
    edit: boolean = false;
}