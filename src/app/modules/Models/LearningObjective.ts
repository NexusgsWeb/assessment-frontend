import { LearningStandard } from './LearningStandard';

export class LearningObjective{
    id: string;
    learningStandardId: string;
    bloomsTaxonomyId: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    learningStandard: LearningStandard;

}