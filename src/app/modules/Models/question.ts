import { answer } from './answer';

export interface question {
  id?: string;
  questionText: string;
  questionType: string;
  status?: string;
  isPublished?: boolean;
  answers: answer[];
}
