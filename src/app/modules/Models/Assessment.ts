import { AcademicClass } from './AcademicClass';
import { Subject } from './Subject';
import { Class } from './Class';

export class Assessment{
    id: string;
    title: string;
    startsAtDateTime : string;
    endsAtDateTime: string;
    startTime: string;
    endTime: string;
    status: string;
    class: string;
    sectionID: string;
    subjectID: string;
    edit: boolean;
    isPublished: boolean;
    testDurationInMinuets: string;
    instruction: string;
    createdAt: string;
    updatedAt: string;
    createdByEmployeeID: string
    startDate: string;
    endDate: string;
    subject: Subject;
    selectedClass: Class;

}