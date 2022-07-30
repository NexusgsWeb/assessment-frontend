import { LearningStandard, Unit } from './Curriculum';

export class LearningPathSteps {
  id?: number;
  learningPathId?: number;
  title?: string;
  expectedDuration?: {
    duration: number;
    unitOfTime: string;
  };
  startDate?: Date;
  endDate?: Date;
  description?: string;
  domains: Unit[];
  learningStandrds: LearningStandard[];
  prereqDomains: Unit[];
  prereqLs: LearningStandard[];
}
