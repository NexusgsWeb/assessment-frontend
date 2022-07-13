import { Cycle } from './Cycle';

export class AcademicClass{
    id: string;
    name: string;
    code: string;
    schoolId: string;
    cycleId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    second_language_name: string;
    Cycle = new Cycle();
}