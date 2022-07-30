import { Section } from './Section';

export interface LearningPath {
  id?: number;
  imgUrl?: string;
  title: string;
  lastActivity?: string;
  comletedActivities?: number;
  inProgressActivities?: number;
  notStartedActivities?: number;
  classId: string;
  subjectId: string;
  sectionsId: Section[];
  description?: string;
  lessonExpectedDuration?: number;
  startDate?: Date;
  endDate?: Date;
  published?: boolean;
}
