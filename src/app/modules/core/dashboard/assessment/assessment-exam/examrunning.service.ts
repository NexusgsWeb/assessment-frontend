import { Injectable } from '@angular/core';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';

@Injectable({
  providedIn: 'root',
})
export class ExamrunningService {
  answers: any[] = []
  constructor(private questionsManager: QuestionmanagerService) {}

  ngOnInit() {}

  PrepareQuestionForStarting(questions) {
    console.log(questions);

    for (var i = 0; i < questions.length; i++) {
      if (
        questions[i].questionType ===
          'FillInTheBlanks' ||
        questions[i].questionType === 'Number'
      ) {
        console.log(questions[i]);
        for (
          var j = 0;
          j < questions[i].answers.length;
          j++
        ) {
          questions[i].answers[j].answerText = '';
        }
      } else if (questions[i].questionType === 'Date') {
        for (
          var j = 0;
          j < questions[i].answers.length;
          j++
        ) {
          questions[i].answers[j].answerText =
            '';
        }
      }
    }
    console.log(questions);
    return questions;
  }

  PrepareQuestionForResuming(questions) {
    try {
      questions = questions.questions

      for(let ques of questions){
        ques.questionType = ques.question_type
        ques.questionText = ques.question_text
        for(let answer of ques.answers){
          answer.answerText = answer.answer_text
        }
        for(let answer of ques.studentAnswers){
          answer.answerValue = answer.answer_text
        }
      }
      console.log(questions);
      // let tempQ = []
      // for(let q of questions){
      //   if(q.studentAnswers.length > 0 && q.studentAnswers != null && q.studentAnswers != undefined){
      //     tempQ.push(q)
      //   }
      // }
      // questions = tempQ
      // console.log('maher maher')
      // console.log(questions)


      for (var i = 0; i < questions.length; i++) {
        console.log('im entering...');
        console.log(i);
        console.log(questions[i].questionType);
        if (questions[i].questionType === 'MCQ') {
          console.log(
            `it is ${questions[i].questionType} `
          );
          var AnswersValues = [];
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          for (
            var j = 0;
            j < questions[i].answers.length;
            j++
          ) {
            if (
              AnswersValues.includes(
                questions[i].answers[j].answerText
              )
            ) {
              questions[i].answers[j].isSelected = true;
            } else {
              questions[i].answers[j].isSelected = false;
            }
          }
          console.log(questions);
        } else if (questions[i].questionType === 'T/F') {
          var AnswersValues = [];
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          for (
            var j = 0;
            j < questions[i].answers.length;
            j++
          ) {
            if (AnswersValues.includes('True')) {
              questions[i].answers[0].isSelected = true;
              questions[i].answers[1].isSelected = false;
            } else {
              questions[i].answers[0].isSelected = false;
              questions[i].answers[1].isSelected = true;
            }
          }
          console.log(questions);
        } else if (
          questions[i].questionType === 'Descriptive'
        ) {
          var AnswersValues = [];
          questions[i].answers.push({
            answerText: '',
          });
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          console.log(AnswersValues);
          questions[i].answers[0].answerText =
            AnswersValues[0];
          console.log(questions);
          //Number, Text
        } else if (
          questions[i].questionType === 'FillInTheBlanks'
        ) {
          var AnswersValues = [];
          //Count how many blanks
          var count = questions[i].answers.length;
          for (var j = 0; j < questions[i].studentAnswers.length; j++) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          for (var j = 0; j < count; j++) {
            questions[i].answers[j].answerText =
              AnswersValues[j];
          }
          console.log('FILLIN THE BLANKS');
          console.log('FILLIN THE BLANKS');
        } else if (
          questions[i].questionType === 'Date'
        ) {
          var AnswersValues = [];
          // questions.questions[i].cq.questions.answers.push({
          //   answerText: '',
          // });
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          console.log(AnswersValues);
          questions[i].answers[0].answerText =
            AnswersValues[0];
          console.log(questions);
        } else if (
          questions[i].questionType === 'Text'
        ) {
          var AnswersValues = [];

          questions[i].answers.push({
            answerText: '',
          });
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          console.log(AnswersValues);
          questions[i].answers[0].answerText =
            AnswersValues[0];
          console.log(questions);
        } else if (
          questions[i].questionType === 'Number'
        ) {
          var AnswersValues = [];

          // questions.questions[i].cq.questions.answers.push({
          //   answerText: '',
          // });
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          console.log(AnswersValues);
          questions[i].answers[0].answerText =
            AnswersValues[0];
          console.log(questions);
        } else if (questions[i].questionType === 'SCQ') {
          console.log(
            `it is ${questions[i].questionType} `
          );
          var AnswersValues = [];
          for (
            var j = 0;
            j < questions[i].studentAnswers.length;
            j++
          ) {
            AnswersValues.push(
              questions[i].studentAnswers[j].answerValue
            );
          }
          for (
            var j = 0;
            j < questions[i].answers.length;
            j++
          ) {
            if (
              AnswersValues.includes(
                questions[i].answers[j].answerText
              )
            ) {
            questions[i].answers[j].isSelected = true;
            } else {
              questions[i].answers[j].isSelected = false;
            }
          }
          console.log(questions);
        } else {
          console.log(
            'THERE WAS A FATAL PROBLEM? YOUR ARRAYS ARE NOT EVEN STRUCTURED.'
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      return questions;
    }
  }
  MixResumingQuestionsWithOldQuestions(AllQuestions, ResumingQuestions: any) {
    const AllQuestionsArr = AllQuestions;
    const ResumingQuestionsArr = ResumingQuestions;
    console.log('resume resume')
    console.log(AllQuestionsArr)
    console.log(ResumingQuestions)
    try {
      var newQuestions = [];
      var ResumingQuestionsIDs = [];
      ResumingQuestionsArr.forEach((element) => {
        element.questionType = element.question_type
        ResumingQuestionsIDs.push(element.id);
      });
      for (var i = 0; i < AllQuestionsArr.length; i++) {
        AllQuestionsArr[i].questionType = AllQuestionsArr[i].question_type

        if (ResumingQuestionsIDs.includes(AllQuestionsArr[i].id)) {
          continue;
        }
        newQuestions.push(AllQuestionsArr[i]);
      }
      console.log('old old')
      console.log(ResumingQuestionsIDs)
      console.log(AllQuestionsArr)
      console.log(newQuestions)
      console.log(ResumingQuestions.questions)
      // newQuestions = newQuestions.concat(ResumingQuestions.questions);
      newQuestions = ResumingQuestionsArr
      return newQuestions;
    } catch (err) {
      console.log(err);
    }
  }
}
