export interface LearningPath {
  id?: string;
  imgUrl?: string;
  title: string;
  lastAcitivty?: string;
  comletedActivities?: number;
  inProgressActivities?: number;
  notStartedActivities?: number;
  classId: string;
  subjectId: string;
  sectionsId: string[];
  description?: string[];
  lessonExpectedDuration?: number;
  startDate?: Date;
  endDate?: Date;
  published?: boolean;
}
