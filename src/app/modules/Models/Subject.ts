import { AcademicClass } from './AcademicClass';
import { Section } from './Section';
import { Curriculum } from './Curriculum';

export class Subject {
  id: string;
  name: string;
  code: string;
  weight: number;
  sectionName: string;
  sectionId: string;
  expand: boolean;
  subjectOrder: number;
  sections: Section[];
  classId: string;
  edit: boolean;
  displayName: string;
  curriculumId: string;
  subjectCode: string;
  gradeCode: string;
  curriculum: Curriculum;
}
