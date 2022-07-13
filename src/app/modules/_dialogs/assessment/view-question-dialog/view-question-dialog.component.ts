import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { reduce } from 'rxjs/operators';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-view-question-dialog',
  templateUrl: './view-question-dialog.component.html',
  styleUrls: ['./view-question-dialog.component.css'],
})
export class ViewQuestionDialogComponent implements OnInit {
  question1: any;
  question2: any;
  chapterIds: string = "";
  sectionIds: string = "";
  chapterTitles: string = "";
  sectionTitles: string = "";
  curriculum: any;
  public curriculumsList: any[] = []
  unit: any;
  book: any;
  answers: [];
  answerKey: string = '';
  questionText: any;
  bloomsTaxonomy: any;
  LS: any[] = [];
  lo: any[] = [];
  sections: any[] = []
  chapters :any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewQuestionDialogComponent>,
    private sanitizer: DomSanitizer,
    private questionManager: QuestionmanagerService,
    private authManager: AuthManagerService
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.question1 = this.data.question;
    this.getQuestionById(this.question1.id)
 
  }
  didClickClose() {
    this.dialogRef.close();
  }

  getQuestionById(questionId){
    console.log(questionId)
    this.questionManager.previewQuestionDittofi(questionId).then((res : any) =>{
      console.log(res);
      // console.log(this.question1);
      console.log(res)
      let tempAns = [];
      for(let ans of res.data.answers){
        let temp = tempAns.find((item) => item.id == ans.id);
        if(temp == undefined || temp == null){
          tempAns.push(ans);
        }
      }
      res.data.answers = tempAns

      let lsTemp = [];
      for(let ls of res.data.learning_standards){
        let temp = lsTemp.find((item) => item.id == ls.id);
        if(temp == undefined || temp == null){
          lsTemp.push(ls);
        }
      }
      res.data.learning_standards = lsTemp
      let unitTemp = [];
      for(let unit of res.data.units){
        let temp = unitTemp.find((item) => item.id == unit.id);
        if(temp == undefined || temp == null){
          unitTemp.push(unit);
        }
      }
      res.data.units = unitTemp

      this.question2 = res.data;
      console.log(this.question2)
      
      if(this.question2.answers == undefined ||
        (this.question2.answers.length == 1 && this.question2.answers[0].id == 0)){
          this.answers = []
        }
        else{
          this.answers = this.question2.answers;
        }
      this.answerKey = this.question2.answer_key;

      console.log('blooms')
      if(this.question2.blooms_taxonomy != null && this.question2.blooms_taxonomy != undefined){
        this.bloomsTaxonomy = {knowledgeCategory : res.data.blooms_taxonomy[0].knowledge_category, knowledgeLevel : res.data.blooms_taxonomy[0].knowledge_dimension}
        console.log(this.bloomsTaxonomy)

        // this.bloomsTaxonomy = res.data.blooms_taxonomy[0].knowledge_category + '-' + res.data.blooms_taxonomy[0].knowledge_dimension
      }
      let cur = 2;
      this.curriculum = this.question2.curriculum_name;
      if(this.authManager.getTypeOfUser() == 'teacher'){
        for(let c of this.question2.curriculums){
          if(c.id == cur){
            let found = this.curriculumsList.find((item) => item.id == c.id);
            if(found == undefined){
              this.curriculumsList.push(c);
            }
          }
        }
      }
      else{
        for(let c of this.question2.curriculums){
            let found = this.curriculumsList.find((item) => item.id == c.id);
            if(found == undefined){
              this.curriculumsList.push(c);
            }
        }
      }
        this.questionText = this.question2.question_text
     
      console.log(this.questionText);
      console.log(this.question2)
      this.sections = this.question2.sections;
      this.chapters = this.question2.chapters;
      this.LS = this.question2.learning_standards;
      this.lo = this.question2.los

      this.unit = ''
      if(this.question2.units != undefined){
        for(let u of this.question2.units){
          this.unit += u.name + ', ';
        }
      }
    
      const tempChapters = [];
      for(let chapter of this.chapters){
        const foundChapter = tempChapters.findIndex(item => item.id == chapter.id);
        if(foundChapter == -1){
          tempChapters.push(chapter);
          this.chapterIds = this.chapterIds + chapter.number + ', ';
          this.chapterTitles = this.chapterTitles + chapter.title + ', ';
        }

       
      }
  

      const tempSections = [];
      for(let section of this.sections){
        const foundSection = tempSections.findIndex(item => item.id == section.id);
        if(foundSection == -1){
          tempSections.push(section);
          this.sectionIds = this.sectionIds + section.number + ', ';
          this.sectionTitles = this.sectionTitles + section.title + ', ';
        }   
      }

      const tempLO = []
      console.log(this.lo);
      for(let l of this.lo){
        const foundLO = tempLO.findIndex(item => item.id == l.id);
        if(foundLO == -1){
          tempLO.push(l);
         
        }   
      }
  
      const tempLS = []
      for(let ls of this.LS){
        const foundLS = tempLS.findIndex(item => item.id == ls.id);
        if(foundLS == -1){
          tempLS.push(ls);
         
        }   
      }

      this.lo = tempLO
      this.LS = tempLS
      console.log(this.LS);
      console.log(this.lo);
    }).catch((res) => {
      console.log(res);
    })
  }
  handleEditorToggle(){}
  analyzeQuestionText(questionText: string) {
    console.log(questionText)
    const questionArray = questionText.split(' ');
    let newQuestion = '';
    console.log(questionArray);
    for (let letter of questionArray) {
      if (letter.includes('{$$') && letter.includes('$$}')) {
        const imageName = letter.replace('{$$', '').replace('$$}', '');
        const newImage = '<img src="' + imageName + '" />';

        newQuestion = newQuestion + newImage + ' ';
      } else {
        newQuestion = newQuestion + letter + ' ';
      }
    }

    console.log(newQuestion);
    return newQuestion;
  }

  containsNBSP(questionText : string){

    if(questionText == undefined || questionText == ''){
      return false
    }
    else if(questionText.includes('&nbsp')){
      return true;
    }
    else{
      return false;
    }
  }
}
