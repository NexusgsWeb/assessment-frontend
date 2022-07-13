import { Subject } from './Subject';
import { UnitLearningObjectives } from './UnitLearningObjectives';

export class Unit{
    id: string;
    subjectId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    weight: number;
    selected: boolean;
    // subject: Subject;
    // unitLearningObjectives: UnitLearningObjectives[];

}