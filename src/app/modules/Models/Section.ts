import { AcademicClass } from './AcademicClass';
import { School } from './school';

export class Section{
    id: string;
    code: string;
    classOfAcademicYearId: string;
    schoolId: string;
    maxNumberOfStudents: number;
    minNumberOfStudents: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    classOfAcademicYear: AcademicClass;
    school: School;
    displayName: string;

}