import { Component, OnInit, Input } from '@angular/core';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from 'src/app/modules/_dialogs/assessment/feedback-dialog/feedback-dialog.component';

@Component({
  selector: 'app-display-assessment-answers',
  templateUrl: './display-assessment-answers.component.html',
  styleUrls: ['./display-assessment-answers.component.css']
})
export class DisplayAssessmentAnswersComponent implements OnInit {
  assessmentResults: any[] = [];
  tempAssessmentResults: any[] =[];
  students: any [] = [];
  assessment: any;

  studentAnswers: any[] =[];

  questions: any[] = [];
  constructor(private assessmentManager: AssessmentManagerService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.assessment = this.assessmentManager.assessmentData$.getValue()
    this.assessmentResults = this.assessmentManager.results$.getValue();
    console.log('assessment results')
    console.log(this.assessmentResults)
    this.tempAssessmentResults = this.assessmentResults;
    const selectedResult = this.assessmentResults.find(item => item.selected == true);

  }

  searchStudents(input){
    console.log(input.value.toLocaleLowerCase())
    this.assessmentResults = this.tempAssessmentResults;
    if (input.value != '') {
      this.assessmentResults = this.assessmentResults.filter((res) => {
        console.log(res.studentId)
        return res.studentId
          .toLocaleLowerCase()
          .match(input.value.toLocaleLowerCase());
      });
    }
  }

  getStudentResults(assessmentId, studentId){

    console.log(assessmentId)
    this.assessmentManager.viewTeacherResultDittofi(assessmentId, studentId).then((res : any) => {
      console.log(res)

      let temp = []
      for(let ques of res.data){
        let found = temp.find((item) => item.id == ques.id);
        if(found == undefined){
          if(ques.attempt_mark == null){
            ques.graded = false
          }
          else{
            ques.graded = true
          }
          temp.push(ques)
        }
      }
      this.questions = temp

    }).catch((res) => {
      console.log(res)
    })
  }

  onSelectStudent(index){
    console.log(index)
    console.log(this.assessmentResults)
    console.log(this.assessment)

    for(let result of this.assessmentResults){
      result.selected = false;
    }
    this.assessmentResults[index].selected = true;

    for(let result of this.tempAssessmentResults){
      result.selected = false;
    }
    this.tempAssessmentResults.find(item => item.id == this.assessmentResults[index].id).selected = true;
    this.getStudentResults(this.assessment.id, this.assessmentResults[index].student_id);

  }

  openFeedback(index: number){
    const selectedStudent = this.assessmentResults.find(item => item.selected == true)
    this.dialog.open(FeedbackDialogComponent, {
      autoFocus: false,
      data: {
        assessmentId: this.questions[index].assessment_id,
        studentId: selectedStudent.student_id,
        answerId: this.questions[index].answer_id
      },
    });
  }

  studentResult(assessment){
    if(assessment.is_completed){
      let passed = assessment.total_mark/2
      if(assessment.mark >= passed){
        return 'Passed'
      }
      else{
        return 'Failed'
      }
    }
    else{
      return 'Incomplete'
    }
  }

  submitGrade(event, index){
    console.log('entered')
    console.log(event)
    const selectedStudent = this.assessmentResults.find(item => item.selected == true)

    this.assessmentManager.gradeQuestionsDittofi(selectedStudent.student_id, this.questions[index].assessment_id, this.questions[index].answer_id, event).then((item) => {
      console.log(item)
      this.questions[index].graded = true
      this.questions[index].attempt_mark = event

    }).catch((item) => {
      console.log(item)
    })

  }
}
