export class LearningPathActivities {
  id?: number;
  learningPathStepsId?: number;
  lessonSubtitleResourceId?: number;
  activityCategory?: string;
  activityType?: string;
  title?: string;
  reference?: string;
  attachementDetails?: string;
  url?: string;
  description?: string;
  assignmentId?: number;
  assessmentId?: number;
  messageGoupId?: number;
  full?: number;
  dueDate?: Date;
  expectedDuration?: {
    duration: number;
    unitOfTime: string;
  };
}
