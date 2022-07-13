import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Book } from 'src/app/modules/Models/Book';
import { Chapter } from 'src/app/modules/Models/Chapter';
import { ChapterSection } from 'src/app/modules/Models/ChapterSection';
import { Assessment } from 'src/app/modules/Models/Assessment';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { BookManagerService } from 'src/app/modules/_services/book-manager.service';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { SectionManagerService } from 'src/app/modules/_services/section-manager.service';
import { findIndex } from 'rxjs/operators';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { ViewQuestionDialogComponent } from 'src/app/modules/_dialogs/assessment/view-question-dialog/view-question-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ImgURL } from 'src/app/shared/static_data/apiURL';

@Component({
  selector: 'app-assessment-questions',
  templateUrl: './assessment-questions.component.html',
  styleUrls: ['./assessment-questions.component.css'],

})


export class AssessmentQuestionsComponent implements OnInit {
  @Input() chosenLearningObjectives!: any;
  @Input() createdAssessment!: Assessment;
  @Output() onChooseQuestions = new EventEmitter<number>();

  actualWeights: any[] = [];
  questionDifficulties: any[] = [];
  averageDifficulty: any[] = [{name: "Difficulty", value: 0}];
  testTime: any[] = [];
  navbarfixed: boolean = false;
  expanded: boolean = true;
  allQuestions: boolean = false;
  book: boolean;

  weightingGraphBool: boolean = true;
  testTimeBool: boolean = true
  tempSelected: any[] = [];

  enteredOnce = true;
  access = 1;
  //test time
  remainingTime: string = '';
  actualTime: string = '';
  plannedTime: string = '';

  //questions

  questions: any[];
  filteredQuestions: any[];
  tempQuestions: any[];

  //filters
  questionBanks: string[] = []
  selectedBooks: any[] = [];
  selectedChapters: any[] = [];
  selectedSections: any[] = [];
  selectedUnits: any[] = [];
  selectedLearningObjectives: any[] = [];
  selectedLearningStandards: any[] =[];
  selectedQuestionTypes: any[] = []
  units: any[] = [];
  learningObjectives: any[] = [];
  learningStandards: any[] = [];

  //temp filters
  tempBooks: any[] = [];
  tempchapters: any[] = [];
  tempSections: any[] = [];
  tempUnits: any[] =[];
  tempLOs: any[] = [];
  tempLS: any[] = [];
  tempQuestionTypes: any[] = []

  //selected filters
  filteredBooks: any;
  filteredChapters: any;
  filteredSections: any;

  //curriculum filter

  filteredUnits: any;
  filteredLOs: any;
  filteredLS: any;

  difficulty: any[] = [];

  chosenBook: Book;
  chosenChapter: Chapter;
  chosenSection: ChapterSection;
  chosenUnit: any;
  chosenLO: any;
  chosenDifficulty: any;
  chosenQuestionType: any;
  currentPage = 1;
  testAverageDifficultyList: any[] = [];
  selectedQuestions: any[] = [];
  xLabel: string = ''
  domains: any[] = [];
  filteredDomain: any;
  tempDomains: any[] = [];

  time: any;

  productSales: any[];
  productSalesMulti: any[];

  //chart settings
  colorScheme = {
    domain: ['#FEC623', '#FF5B55']
  };
  // options
  distributionGraphProperties = {
    view: [innerWidth / 2, 400],
    showXAxis:  true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel:true,
    yAxisLabel: 'Weight',
    showYAxisLabel: true,
    xAxisLabel: 'Test',
    maxRadius:  20,
    minRadius:  5,
    yScaleMin: 70,
    yScaleMax: 85,
    schemeType: "ordinal",
    xAxis: true,
    yAxis: true,
    legend: true,
    legendTitle: "",
    legendTitleMulti: "Months",
    legendPosition: 'below',
    animations: true,
    showGridLines: true,
    showDataLabel: true,
    barPadding: 20,
    tooltipDisabled: false,
    roundEdges: true,

  }
  averageDifficultyGraphProperties = {
    view: [innerWidth / 2, 400],
    showXAxis:  true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel:true,
    yAxisLabel: 'Difficulty',
    showYAxisLabel: true,
    xAxisLabel: 'Test',
    maxRadius:  20,
    minRadius:  5,
    yScaleMin: 70,
    yScaleMax: 85,
    schemeType: "ordinal",
    xAxis: true,
    yAxis: true,
    legend: true,
    legendTitle: "",
    legendTitleMulti: "Months",
    legendPosition: 'below',
    animations: true,
    showGridLines: true,
    showDataLabel: true,
    barPadding: 20,
    tooltipDisabled: false,
    roundEdges: true,

  }
  testTimeGraphProperties = {
    view: [innerWidth / 2.5, 400],
    showXAxis:  true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel:true,
    yAxisLabel: 'Time(min)',
    showYAxisLabel: true,
    xAxisLabel: this.xLabel,
    maxRadius:  20,
    minRadius:  5,
    yScaleMin: 70,
    yScaleMax: 85,
    schemeType: "ordinal",
    xAxis: true,
    yAxis: true,
    legend: true,
    legendTitle: "",
    legendTitleMulti: "Months",
    legendPosition: 'below',
    animations: true,
    showGridLines: true,
    showDataLabel: false,
    barPadding: 20,
    tooltipDisabled: false,
    roundEdges: true,

  }
  testDifficultyGraphProperties = {
    view: [innerWidth / 2.5, 400],
    showXAxis:  true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel:true,
    yAxisLabel: 'Difficulty',
    showYAxisLabel: true,
    xAxisLabel: this.xLabel,
    maxRadius:  20,
    minRadius:  5,
    yScaleMin: 70,
    yScaleMax: 85,
    schemeType: "ordinal",
    xAxis: true,
    yAxis: true,
    legend: true,
    legendTitle: "",
    legendTitleMulti: "Months",
    legendPosition: 'below',
    animations: true,
    showGridLines: true,
    showDataLabel: true,
    barPadding: 20,
    tooltipDisabled: false,
    roundEdges: true,

  }

  filterObject : any;



  constructor(private assessmentManagerService: AssessmentManagerService,
              private bookService: BookManagerService, private DialogService: DialogServiceService,
              public dialog: MatDialog, private sanitizer:DomSanitizer) {
   }

  ngOnInit(): void {
    this.filterObject = {
      booksFilter: '',
      chapterFilters: '',
      sectionsFilter: '',
      unitsFilter: '',
      loFilter: '',
      lsFilter: '',
      difficultyFilter: '',
      questionTypeFilter: ''
    }
    this.createdAssessment = this.assessmentManagerService.newAssessment$.getValue();
    console.log(this.chosenLearningObjectives)
    if(this.chosenLearningObjectives != undefined){
      if(this.chosenLearningObjectives.selectedBooks != undefined){
        for(let book of this.chosenLearningObjectives.selectedBooks){
          book.title = book.book_title
        }
        this.selectedBooks = this.chosenLearningObjectives.selectedBooks;
        this.tempBooks = this.selectedBooks
      }
      if(this.chosenLearningObjectives.selectedChapters != undefined){
        const ch = this.chosenLearningObjectives.selectedChapters;
        for(let c of ch){
          c.displayName = c.number + ' ' + c.title;
        }

        this.selectedChapters = ch;
        this.tempchapters = this.selectedChapters
      }
      if(this.chosenLearningObjectives.selectedSections != undefined){
        const sec = this.chosenLearningObjectives.selectedSections;
        for(let s of sec){
          s.displayName = s.code;
        }
        this.selectedSections = sec
        this.tempSections = this.selectedSections;
      }
      if(this.chosenLearningObjectives.selectedUnits != undefined){
        this.selectedUnits = this.chosenLearningObjectives.selectedUnits;
        this.tempUnits = this.selectedUnits
      }
      if(this.chosenLearningObjectives.selectedLearningObjectives != undefined){
        this.selectedLearningObjectives = this.chosenLearningObjectives.selectedLearningObjectives;
        this.tempLOs = this.selectedLearningObjectives
      }

      if(this.chosenLearningObjectives.selectedLearningStandards != undefined){
        this.selectedLearningStandards = this.chosenLearningObjectives.selectedLearningStandards;
        this.tempLS = this.selectedLearningStandards;
      }
      if(this.chosenLearningObjectives.book != undefined){
        this.book = this.chosenLearningObjectives.book;
        if(this.book){
          this.xLabel = 'Sections';
        }
        else{
          this.xLabel = 'Learning Objectives';
        }
      }
      this.units = this.chosenLearningObjectives.units;
      this.learningObjectives = this.chosenLearningObjectives.learningObjectives;
      this.learningStandards = this.chosenLearningObjectives.learningStandards;
    }

    this.getQuestionsByBook();

  }

  onChooseFilter(event, type){

    console.log(type)
    console.log(event)
    this.questions = this.tempQuestions
    if(type == 'book'){
      this.filterObject.booksFilter = event
    }
    if(type == 'chapter'){
      this.filterObject.chapterFilters = event
    }
    if(type == 'section'){
      this.filterObject.sectionsFilter = event
    }
    if(type == 'unit'){
      this.filterObject.unitsFilter = event
    }
    if(type == 'lo'){
      this.filterObject.loFilter = event
    }
    if(type == 'ls'){
      this.filterObject.lsFilter = event
    }
    if(type == 'difficulty'){
      this.filterObject.difficultyFilter = event
    }
    if(type == 'questionType'){
      this.filterObject.questionTypeFilter = event
    }

    console.log(this.filterObject)
    if(this.filterObject.booksFilter != ''){
      this.onFilterBook1(this.filterObject.booksFilter)
    }
    if(this.filterObject.chapterFilters != ''){
      this.onFilterChapter(this.filterObject.chapterFilters)
    }
    if(this.filterObject.sectionsFilter != ''){
      this.onFilterSection(this.filterObject.sectionsFilter)
    }
    if(this.filterObject.unitsFilter != ''){
      this.onFilterUnit1(this.filterObject.unitsFilter)
    }
    if(this.filterObject.loFilter != ''){
      this.onFilterLO(this.filterObject.loFilter)
    }
    if(this.filterObject.lsFilter != ''){
      this.onFilterLS(this.filterObject.lsFilter)
    }
    if(this.filterObject.difficultyFilter != ''){
      this.onFilterDifficulty(this.filterObject.difficultyFilter)
    }
    if(this.filterObject.questionTypeFilter != ''){
      this.onFilterQuestionType(this.filterObject.questionTypeFilter)
    }
  }
  calcTestAvgDifficulty(questions: any[]){
    let totalDifficulty = 0;
    if(questions.length > 0){
      for(let question of questions){
          totalDifficulty = totalDifficulty + question.difficulty;
      }
      const averageDiff = Number((totalDifficulty / questions.length).toFixed(2))
      const list = [{name: "Difficulty", value: averageDiff}];

     return list
    }
    else{
      const list2 = [{name: "Difficulty", value: 0}];
      return list2;
    }

  }
  calcTotalTestTime(questions: any[], selectedQuestions: any[]){
    let totalTime = 0;
    // for(let question of questions){
    //   for(let cq of question.cq){
    //     totalTime = totalTime + cq.time
    //   }
    // }
    totalTime = Number(this.createdAssessment.testDurationInMinuets) * 60 ;
    let actualTime = 0;
    for(let question of selectedQuestions){
        console.log(question.time)
        actualTime = actualTime + Number(question.time)

    }


    const list = [{
      name: "Time",
      series: [
        {
          name: "Planned test time",
          value: totalTime
        }, {
          name: "Actual Test Time",
          value: Number(actualTime)
        }
      ]

      }];


    return list;
  }
calcAverageDifficulty(secs: any[]){

  const averageDifs = [];

  for(let sec of secs){

    // const tempQuestions = this.selectedQuestions.filter((item) => { return (item.sectionId === sec.id) });
    const tempQuestions = [];
    for(let q of this.selectedQuestions){
      for(let s of q.sections){
        if(s.id == sec.id){
          tempQuestions.push(q);
        }
      }


    }
    let difficulty = 0;
    for(let q of tempQuestions){
        difficulty = difficulty + q.difficulty

    }
    if(tempQuestions.length == 0){
      averageDifs.push({name: sec.code, value: 0, extra: {
        "code": sec.displayName
      }});
    }
    else{
      const averageDifficulty = Number((difficulty / tempQuestions.length).toFixed(2));
      averageDifs.push({name: sec.code, value: averageDifficulty, extra: {
        "code": sec.displayName
      }});
    }

  }

  return averageDifs;
}

calcAverageDistribution(secs: any[], selectedQuestions: any[]){
  const secTemp = [];


  for(let section of secs){

    const averageWeight = [];
    const questionCount = [];

    for(let q of this.questions){
      for(let s of q.sections){
        if(s.id == section.id){
          averageWeight.push(q);
        }
      }
    }

    for(let q of selectedQuestions){
      for(let s of q.sections){
        if(s.id == section.id){
          questionCount.push(q);
        }
      }
    }
    let actualDistribution  = 0;
    if(selectedQuestions.length == 0 || questionCount.length == 0){
      actualDistribution = 0


      // actualDistribution = Number(((lo.weight / averageWeight.length) * questionCount.length).toFixed(2));
    }
    else{
      actualDistribution = Number(((questionCount.length * 100) /selectedQuestions.length).toFixed(2))

    }
    const newSectionDistribution =
      {
        name: section.code,
        series: [
          {
            name: "Planned weight distribution",
            value: section.weight
            , extra: {
              "code": section.displayName
            }
          }, {
            name: "Actual weight distribution",
            value: actualDistribution
            , extra: {
              "code": section.displayName
            }
          }
        ]}


    secTemp.push(newSectionDistribution)

  }



  return secTemp;
}

calcAverageDistributionCurriculum(los: any[], selectedQuestions: any[]){
  const loTemp = [];

  console.log('entered entered: ' + this.access)
  console.log(los)
  console.log(selectedQuestions)
  this.access = this.access + 1;
  console.log(los)

  for(let ques of selectedQuestions){
    let temp = [];
    for(let lo of ques.los){
      let found = temp.find((item) => item.id == lo.id);
      if(found == undefined){
        temp.push(lo)
      }
    }
    ques.los = temp
  }
  for(let lo of los){
    const averageWeight = [];
    const questionCount = [];

    for(let q of this.questions){
      for(let l of q.los){

        if(lo.id == l.id){
          averageWeight.push(q);
      }
      }

    }

    for(let q of selectedQuestions){
      console.log(q.los)
      console.log('----------------------------')
        for(let lo2 of q.los){
          // console.log(lo)
          // console.log(lo2)
            if(lo.id == lo2.id){
              questionCount.push(q);
          }

      }
    }

    let actualDistribution  = 0;
    if(selectedQuestions.length == 0 || questionCount.length == 0){
      actualDistribution = 0



      // actualDistribution = Number(((lo.weight / averageWeight.length) * questionCount.length).toFixed(2));
    }
    else{
      actualDistribution = Number(((questionCount.length * 100) /selectedQuestions.length).toFixed(2))

    }
    const newSectionDistribution =
      {
        name: lo.displayName,
        series: [
          {
            name: "Planned weight distribution",
            value: lo.weight,
            extra: {
              "code": lo.displayName
            }
          }, {
            name: "Actual weight distribution",
            value: actualDistribution,
            extra: {
              "code": lo.displayName
            }
          }
        ]}


    loTemp.push(newSectionDistribution)

  }

  console.log(loTemp)



  return loTemp;
}

calcAverageDifficultyCurriculum(los: any[]){

  const averageDifs = [];

  for(let lo of los){

    // const tempQuestions = this.selectedQuestions.filter((item) => { return (item.sectionId === sec.id) });
    const tempQuestions = [];

    for(let q of this.selectedQuestions){
      for(let l of q.los){
        if(lo.id == l.id){
          tempQuestions.push(q);
        }
      }

    }




    let difficulty = 0;
    for(let q of tempQuestions){
        difficulty = difficulty + q.difficulty

    }
    console.log(lo)
    if(tempQuestions.length == 0){
      averageDifs.push({name: lo.code, value: 0,extra: {
        "code": lo.displayName
      }
    });
    }
    else{
      const averageDifficulty = Number((difficulty / tempQuestions.length).toFixed(2));
      averageDifs.push({name: lo.code, value: averageDifficulty,extra: {
        "code": lo.displayName
      }});
    }

  }

  return averageDifs;
}


setUpViewsCurriculum(){

  this.actualWeights = [...this.calcAverageDistributionCurriculum(this.tempLOs, this.selectedQuestions)]
  this.questionDifficulties = [...this.calcAverageDifficultyCurriculum(this.tempLOs)];
  this.testTime = [...this.calcTotalTestTime(this.questions, this.selectedQuestions)];
  this.averageDifficulty = [...this.calcTestAvgDifficulty(this.selectedQuestions)];

  this.plannedTime = this.createdAssessment.testDurationInMinuets + 'min'
  this.actualTime = this.dateConversion(this.testTime[0].series[1].value)

  console.log(this.actualWeights)
  console.log(this.questionDifficulties)
  console.log(this.testTime)
  console.log(this.averageDifficulty)
  const rem = this.dateConversion(Number(this.createdAssessment.testDurationInMinuets) * 60  - this.testTime[0].series[1].value)
  console.log(this.testTime)
  this.remainingTime = rem ;


  this.time = {
    plannedTime: this.plannedTime,
    actualTime: this.actualTime,
    remainingTime: this.remainingTime
  }
  this.assessmentManagerService.time$.next(this.time)

}
setUpViews(){

  this.actualWeights = [...this.calcAverageDistribution(this.tempSections, this.selectedQuestions)]
  this.questionDifficulties = [...this.calcAverageDifficulty(this.tempSections)];
  this.testTime = [...this.calcTotalTestTime(this.questions, this.selectedQuestions)];
  this.averageDifficulty = [...this.calcTestAvgDifficulty(this.selectedQuestions)];





 this.plannedTime = this.createdAssessment.testDurationInMinuets + 'min'
 this.actualTime = this.dateConversion(this.testTime[0].series[1].value)
 const rem = this.dateConversion(Number(this.createdAssessment.testDurationInMinuets) * 60  - this.testTime[0].series[1].value)

 this.remainingTime = rem ;

 this.time = {
   plannedTime: this.plannedTime,
   actualTime: this.actualTime,
   remainingTime: this.remainingTime
 }
 this.assessmentManagerService.time$.next(this.time)
}

onScroll(event){
  console.log(event)
}

expandCollapseFilters(){
  this.expanded = !this.expanded;

}

actualWeightingClicked(){
  this.weightingGraphBool = true;
}
averageDifficultyClicked(){
  this.weightingGraphBool = false;
}
testTimeClicked(){
  this.testTimeBool = true;
}
testDifficultyClicked(){
  this.testTimeBool = false;
}

getQuestionsByBook(){
  const bookIds: string[] = []
  for(let book of this.selectedBooks){
    bookIds.push(book.book_id);
  }
  const chapterIds: string[]  = []
  for(let chapter of this.selectedChapters){
    chapterIds.push(chapter.id);
  }
  const sectionIds: string[]  = []
  for(let section of this.selectedSections){
    sectionIds.push(section.id);
  }
  const unitIds: string[]  = []
  const domainIds: string[]  = []

  for(let unit of this.selectedUnits){
    unitIds.push(unit.id);
    domainIds.push(unit.id);
  }
  const learningObjectiveIds: string[] = []
  console.log(this.selectedLearningObjectives)
  for(let lo of this.selectedLearningObjectives){
    console.log(lo)
    learningObjectiveIds.push(lo.id);
  }
  const learningStandardIds: string[] = []
  for(let ls of this.selectedLearningStandards){
    learningStandardIds.push(ls.id);
  }

  this.bookService.getQuestionsFilterDittofi(bookIds, chapterIds, sectionIds, unitIds, learningObjectiveIds, learningStandardIds, domainIds).then((res : any) => {
    console.log('returned questions')
    this.questions = res.data;
    if(res.data != null){
      let temp = []
      for(let question of res.data){
        let found = temp.find((item) => item.id == question.id);
        if(found == undefined){
          temp.push(question)
        }
      }

      res.data = temp
      for(let question of res.data){
        question.answerKey = question.answer_key
        question.questionText = question.question_text
        question.questionType = question.question_type
        if(question.exposure == undefined){
          question.exposure = 0
        }
       }
        this.questions = res.data;
        console.log(this.questions)
        // for(let question of this.questions){
        //   question.questionText = this.sanitizer.bypassSecurityTrustHtml(this.analyzeQuestionText(question.questionText));
        // }

        const selectQ = this.assessmentManagerService.questions$.getValue();
        if(selectQ != undefined){
          this.selectedQuestions = selectQ;
          for(let q of selectQ){
            const index = this.questions.findIndex(item => item.id == q.id);
            if(index != -1){
              this.questions[index].selected = true;
            }
            else{
              this.questions[index].selected = false;
            }
          }
        }
        this.tempQuestions = this.questions;

        const tempSections = this.selectedSections;




       if(this.book){
          this.selectedUnits = [];
          this.selectedLearningObjectives = [];
          this.selectedLearningStandards = [];
          this.domains = [];
          for(let q of this.questions){
            for(let unit of q.units){
              const tempD = this.domains.find((item) => item.id == unit.id);
              if(tempD == undefined || tempD == null){
                this.domains.push(unit);
                this.selectedUnits = [...this.selectedUnits, unit];

              }
            }

                const tempLS = q.learning_standards;
                for(let ls of tempLS){
                  ls.learningObjectiveId = ls.learning_objective_id
                }
                const sectionIds = [];
                for(let section of q.sections){
                  sectionIds.push(section.id);

                  const findSection = this.selectedSections.findIndex(item => item.id == section.id);
                  if(findSection != -1){
                    tempSections[findSection].learningObjectiveId = q.los[0].id;
                    tempSections[findSection].learningStandardId = q.learning_standards[0].id
                  }
                }
                tempLS.sectionIds = sectionIds;
                console.log('selected learning standards')
                console.log(tempLS)
                this.selectedLearningStandards.push(tempLS);


                for(let lo of q.los){
                  const tempLearningObjective = lo;
                  tempLearningObjective.sectionIds = sectionIds;
                  tempLearningObjective.displayName = tempLearningObjective.code + ' ' + tempLearningObjective.description;
                  this.selectedLearningObjectives.push(tempLearningObjective);
                }

                for(let ls of q.learning_standards){
                  const tempLearningS = ls;
                  tempLearningS.sectionIds = sectionIds;
                  this.selectedLearningObjectives.push(tempLearningS);
                }



          }
          const tempObjectives = [];
          const tempStandards = [];
          const tempUnits = [];

          for(let lo of this.selectedLearningObjectives){
            const ind = tempObjectives.findIndex(item => item.id == lo.id);
            if(ind == -1){
              tempObjectives.push(lo);
            }
          }
          console.log('selected learning standards')
          console.log(this.selectedLearningStandards)
          for(let ls of this.selectedLearningStandards){
            const ind = tempStandards.findIndex(item => item.id == ls.id);
            if(ind == -1){
              tempStandards.push(ls);
            }
          }
          for(let unit of this.selectedUnits){
            const ind = tempUnits.findIndex(item => item.id == unit.id);
            if(ind == -1){
              tempUnits.push(unit);
            }
          }

          this.selectedLearningObjectives = tempObjectives
          this.tempLOs = this.selectedLearningObjectives
          this.selectedLearningStandards = tempStandards;
          this.tempLS = this.selectedLearningStandards;
          this.selectedUnits = tempUnits;
          this.tempUnits = this.selectedUnits;

          console.log(this.selectedLearningObjectives)
          console.log('selected learning standards')
          console.log(this.selectedLearningStandards)
          console.log(this.selectedUnits)
        }
        else{
          this.selectedBooks = [];
          this.selectedChapters = [];
          this.selectedSections = [];
          this.domains = [];
          for(let q of this.questions){
            for(let book of q.question_books){
              console.log(book)
              if(book.id != null){
                this.selectedBooks.push(book);
              }
            }
                const sectionIds = []
                for(let sec of q.sections){
                  if(sec.id  != null){
                  sectionIds.push(sec.id);
                  const tempSec = sec;
                  tempSec.learningObjectiveId = q.los[0].id;
                  tempSec.learningStandardId = q.learning_standards[0].id;
                  tempSec.displayName = tempSec.title;
                  this.selectedSections.push(tempSec);
                  }

                }
                    for(let chapter of q.chapters){
                      if(chapter.id != null){
                        const tempCh = chapter;
                        tempCh.displayName = tempCh.number + ' ' +tempCh.title;
                        this.selectedChapters.push(tempCh);
                      }


                }




              // for(let l of q.los){
              //   l.sectionIds = sectionIds
              //   this.selectedLearningObjectives.push(l)

              //   console.log(l)
              // }
              // console.log(this.selectedLearningObjectives)


              // for(let ls of q.learning_standards){
              //   const learningS = ls
              //   learningS.learningObjectiveId = learningS.learning_objective_id;
              //   learningS.sectionIds = sectionIds
              //   this.selectedLearningStandards.push(learningS)
              // }

              for(let l of q.los){
                const indexLO = this.selectedLearningObjectives.filter((item) => {
                  return item.id == l.id
                })

                 for(let lo of indexLO){
                  const findLO = this.selectedLearningObjectives.findIndex(item => item.id == lo.id);
                  this.selectedLearningObjectives[findLO].sectionIds = sectionIds;
                }

              }

              for(let ls of q.learning_standards){
                const indexLS = this.selectedLearningStandards.filter((item) => {
                  return item.id == ls.id
                });

                for(let ls of indexLS){
                    const findLS = this.selectedLearningStandards.findIndex(item => item.id == ls.id);
                    this.selectedLearningStandards[findLS].sectionIds = sectionIds;
                  }
              }
              console.log('selected learning standards')
              console.log(this.selectedLearningStandards)







          }
          const tempBooks = [];
          const tempChapters = [];
          const tempSections = [];

          if(this.selectedBooks.length > 0){
            console.log(this.selectedBooks)
            for(let book of this.selectedBooks){
              if(book != null){
                const ind = tempBooks.findIndex(item => item.id == book.id);
                if(ind == -1){
                  tempBooks.push(book);
                }
              }

            }
          }


          for(let chapter of this.selectedChapters){
            const ind = tempChapters.findIndex(item => item.id == chapter.id);
            if(ind == -1){
              tempChapters.push(chapter);
            }
          }
          for(let section of this.selectedSections){

            const ind = tempSections.findIndex(item => item.id == section.id);
            if(ind == -1){
              section.displayName = section.number + ' - ' + section.title;
              tempSections.push(section);
            }
          }



          this.selectedBooks = tempBooks
          this.selectedChapters = tempChapters;
          this.selectedSections = tempSections;
          this.tempBooks = this.selectedBooks;
          this.tempchapters = this.selectedChapters;
          this.tempSections = this.selectedSections;


          const tempLS = []
          for(let ls of this.selectedLearningStandards){

            const ind = tempLS.findIndex(item => item.id == ls.id);
            if(ind == -1){
              tempLS.push(ls);
            }
          }
          this.selectedLearningStandards = tempLS;
          this.tempLS = this.selectedLearningStandards;

          console.log(this.selectedBooks)
          console.log(this.selectedChapters)
          console.log(this.selectedSections)
          console.log(this.selectedUnits)
          console.log(this.selectedLearningObjectives)
          console.log(this.selectedLearningStandards)
        }

        const tempDomains = [];

          for(let domain of this.domains){
            const ind = tempDomains.findIndex(item => item.id == domain.id);
            if(ind == -1){
              tempDomains.push(domain);
            }
          }

          this.domains = tempDomains
          this.tempDomains = this.domains;
        this.difficulty = this.getDifficulty(this.questions);

        this.selectedQuestionTypes = this.getQuestionTypes(this.questions);

        if(this.book){
          this.setUpViews();
        }
        else{
          this.setUpViewsCurriculum();
        }
    }

    else{
      this.questions = []
      this.DialogService.openDialog({
        title: 'No questions found',
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {

        }
      });
    }

  })
  .catch((res) => {
    console.log('returned questions1')
    console.log(res)

    let finalErr = 'Internal Server Error'
    if(res.error.error != undefined){
      finalErr = res.error.error.message;
    }
    console.log(res);

    console.log(res.error.error.message);
    this.DialogService.openDialog({
      title: finalErr,
      message: 'test',
      confirmText: 'Okay',
      cancelText: 'Cancel',
      oneButton: true,
      DidConfirm: () => {

      }
    });
  })
}
allQuestionsSelected(){
  console.log(this.allQuestions)
  if(this.allQuestions){
    this.allQuestions = false;
    this.selectedQuestions = this.tempSelected;
    console.log(this.tempSelected)
    console.log(this.selectedQuestions)

    for(let question of this.questions){
      const selQ = this.selectedQuestions.find(item => item.id == question.id);
      console.log(selQ)
      if(selQ != null || selQ != undefined){
        question.selected = true;

      }
      else{
        question.selected = false;

      }
    }

  }
  else{
    this.allQuestions = true;
    this.tempSelected = this.selectedQuestions;
    console.log(this.tempSelected)

    this.selectedQuestions = this.questions;
    for(let question of this.questions){
      question.selected = true;
    }
  }
  console.log(this.selectedQuestions)

  if(this.book){
    this.setUpViews();
  }
  else{
    this.setUpViewsCurriculum();
  }
}
questionSelected(index){
  const newIndex = (this.currentPage - 1)*10 + index;
  const questionIndex = this.selectedQuestions.findIndex(item => item.id === this.questions[newIndex].id);

  if(questionIndex === -1){
    this.questions[newIndex].selected = true
    this.selectedQuestions.push(this.questions[newIndex]);
  }
  else{
    this.questions[newIndex].selected = false
    this.selectedQuestions.splice(questionIndex, 1);
  }

  console.log(this.questions[newIndex]);

  if(this.book){
    this.setUpViews();
  }
  else{
    this.setUpViewsCurriculum();
  }

}
onFilterBook1(event){
  // this.questions = this.tempQuestions;

  if(event == undefined){
    this.questions = this.tempQuestions;
    this.selectedLearningObjectives = this.tempLOs
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;




  }
  else{
  //restore all values
  this.currentPage = 1;
  this.selectedChapters = this.tempchapters;
  this.selectedSections = this.tempSections;
  this.selectedUnits = this.tempUnits;
  this.selectedLearningObjectives = this.tempLOs;
  this.selectedLearningStandards = this.tempLS;


  // set the selected book
  this.filteredBooks = event;
  console.log(this.filteredBooks)
  console.log(this.selectedChapters)
  console.log(this.selectedSections)
  console.log(this.selectedUnits)
  console.log(this.selectedLearningObjectives)
  console.log(this.selectedLearningStandards)

  //chapters
  this.selectedChapters = this.selectedChapters.filter((item) => {
    return(item.book_id == this.filteredBooks.id);
  });

  //sections;
  let allSections = [];
  for(let chapter of this.selectedChapters){
    const chapterSections = this.selectedSections.filter((item) => {
      return (item.chapter_id == chapter.id);
    });

    allSections = allSections.concat(chapterSections);
  }
  this.selectedSections = allSections;

  //learning standards
  let allLS = [];

  for(let section of this.selectedSections){
    for(let ls of this.selectedLearningStandards){
      if(ls.sectionIds != undefined){
        for(let sec of ls.sectionIds){
          if(sec == section.id){
            allLS.push(ls);
          }
        }
      }
    }
    }
    console.log(this.selectedSections)
    console.log(this.selectedLearningStandards)
    console.log(allLS)

  this.selectedLearningStandards = allLS;

  //learning objectives

  let allLO = [];
  for(let lo of this.selectedLearningObjectives){
    if(lo.sectionIds != undefined){
      for(let sec of lo.sectionIds){
        const sectionIndex = this.selectedSections.findIndex(item => item.id == sec);
        if(sectionIndex != -1){
          allLO.push(lo);
        }
      }
    }
  }

  this.selectedLearningObjectives = allLO
  for(let section of this.selectedSections){
    const lo = this.selectedLearningObjectives.filter((item) => {
      const loSections = item.sectionIds.findIndex(item1 => item1  == section.id);
      return (loSections != -1);
    });
    allLO = allLO.concat(lo);
  }
  this.selectedLearningObjectives = allLO;

  console.log("selected Los")
  console.log(this.selectedLearningObjectives)
  console.log(this.selectedUnits)
  // units

  let allUnits = [];
  for(let lo of this.selectedLearningObjectives){
    const unit = this.selectedUnits.filter((item) => {
      return(item.id == lo.unitId);
    })
    console.log(unit)
    allUnits = allUnits.concat(unit);
    console.log(allUnits)
  }

  this.selectedUnits = allUnits;

  const unitsDup = [];
  const loDup = [];
  const lsDup = [];
  for(let unit of this.selectedUnits){
    const ind = unitsDup.findIndex(item => item.id == unit.id);
    if(ind == -1){
      unitsDup.push(unit);
    }
  }
  for(let lo of this.selectedLearningObjectives){
    const ind = loDup.findIndex(item => item.learningObjectiveId == lo.learningObjectiveId);
    if(ind == -1){
      loDup.push(lo);
    }
  }
  for(let ls of this.selectedLearningStandards){
    const ind = lsDup.findIndex(item => item.id == ls.id);
    if(ind == -1){
      lsDup.push(ls);
    }
  }

  this.selectedUnits = unitsDup;
  this.selectedLearningObjectives = loDup;
  this.selectedLearningStandards = lsDup;

  console.log(this.filteredBooks)
  let qt = [];
      const questionsViewed = [];
      for(let q of this.questions){
        console.log(q)
        console.log('--------------------------------------------')
        for(let book of q.question_books){
          if(book.id == this.filteredBooks.id){
            questionsViewed.push(q);
          }
        }

      }
      qt = qt.concat(questionsViewed);


    qt = [...new Set(qt)];
    console.log(qt);
    this.questions = qt;

  }
  if(this.enteredOnce){

    this.enteredOnce = false;

  if(this.filteredUnits != null){
    this.onFilterUnit1(this.filteredUnits)
  }
  if(this.filteredLOs != null){
    this.onFilterLO(this.filteredLOs)
  }
  if(this.filteredLS != null){
    this.onFilterLS(this.filteredLS)
  }
  if(this.filteredChapters != null){
    this.onFilterChapter(this.filteredChapters)
  }
  if(this.filteredSections != null){
    this.onFilterSection(this.filteredSections)
  }
  this.enteredOnce = true;
}


}


onFilterChapter(event){
  // this.questions = this.tempQuestions;

  if(event == undefined){
    this.selectedLearningObjectives = this.tempLOs
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;




  }
  else{
    console.log(event)
  //restore all values
  this.currentPage = 1;
  this.selectedBooks = this.tempBooks;
  this.selectedSections = this.tempSections;
  this.selectedUnits = this.tempUnits;
  this.selectedLearningObjectives = this.tempLOs;
  this.selectedLearningStandards = this.tempLS;


  // set the selected chapter
  this.filteredChapters = event;

  //chapters
  this.selectedBooks = this.selectedBooks.filter((item) => {
    return(item.id == this.filteredChapters.book_id);
  });

  //sections;
  let allSections = [];
    const chapterSections = this.selectedSections.filter((item) => {
      return (item.chapter_id == this.filteredChapters.id);
    });

    allSections = allSections.concat(chapterSections);

  this.selectedSections = allSections;

  //learning standards
  let allLS = [];

  for(let section of this.selectedSections){
    for(let ls of this.selectedLearningStandards){
      if(ls.sectionIds != undefined){
        for(let sec of ls.sectionIds){
          if(sec == section.id){
            allLS.push(ls);
          }
        }
      }
    }
  }
  this.selectedLearningStandards = allLS;

  //learning objectives

  let allLO = [];
  for(let lo of this.selectedLearningObjectives){
    if(lo.sectionIds != undefined){
      for(let sec of lo.sectionIds){
        const sectionIndex = this.selectedSections.findIndex(item => item.id == sec);
        if(sectionIndex != -1){
          allLO.push(lo);
        }
      }
    }
  }

  this.selectedLearningObjectives = allLO
  for(let section of this.selectedSections){
    const lo = this.selectedLearningObjectives.filter((item) => {
      const loSections = item.sectionIds.findIndex(item1 => item1  == section.id);
      return (loSections != -1);
    });
    allLO = allLO.concat(lo);
  }
  this.selectedLearningObjectives = allLO;

  // units

  let allUnits = [];
  for(let lo of this.selectedLearningObjectives){
    const unit = this.selectedUnits.filter((item) => {
      return(item.id == lo.unitId);
    })
    allUnits = allUnits.concat(unit);
  }

  this.selectedUnits = allUnits;


  const unitsDup = [];
  const loDup = [];
  const lsDup = [];
  for(let unit of this.selectedUnits){
    const ind = unitsDup.findIndex(item => item.id == unit.id);
    if(ind == -1){
      unitsDup.push(unit);
    }
  }
  for(let lo of this.selectedLearningObjectives){
    const ind = loDup.findIndex(item => item.learningObjectiveId == lo.learningObjectiveId);
    if(ind == -1){
      loDup.push(lo);
    }
  }
  for(let ls of this.selectedLearningStandards){
    const ind = lsDup.findIndex(item => item.id == ls.id);
    if(ind == -1){
      lsDup.push(ls);
    }
  }

  this.selectedUnits = unitsDup;
  this.selectedLearningObjectives = loDup;
  this.selectedLearningStandards = lsDup;

    // this.filterQuestionsCurriculum(this.filteredLOs)
    // this.filterQuestions(this.selectedSections);

    let qt = [];
    const questionsViewed = [];
    for(let q of this.questions){
      for(let chap of q.chapters){
        if(chap.id == this.filteredChapters.id){
          questionsViewed.push(q);
        }
      }

    }
    qt = qt.concat(questionsViewed);


  qt = [...new Set(qt)];
  console.log(qt);
  this.questions = qt;

  }

  if(this.enteredOnce){
    this.enteredOnce = false;
    if(this.filteredUnits != null){
      this.onFilterUnit1(this.filteredUnits)
    }
    if(this.filteredLOs != null){
      this.onFilterLO(this.filteredLOs)
    }
    if(this.filteredLS != null){
      this.onFilterLS(this.filteredLS)
    }

    if(this.filteredSections != null){
      this.onFilterSection(this.filteredSections)
    }
    this.enteredOnce = true;

  }


}

onFilterSection(event){
  // this.questions = this.tempQuestions;

  if(event == undefined){
    this.selectedLearningObjectives = this.tempLOs
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;




  }
  else{
    console.log(event)
  //restore all values
  this.currentPage = 1;
  this.selectedBooks = this.tempBooks;
  this.selectedChapters = this.tempchapters;
  this.selectedUnits = this.tempUnits;
  this.selectedLearningObjectives = this.tempLOs;
  this.selectedLearningStandards = this.tempLS;


  // set the selected sections
  this.filteredSections = event;

  //chapters
  this.selectedChapters = this.selectedChapters.filter((item) => {
    return(item.id == this.filteredSections.chapter_id);
  });

  //sections;
  let allBooks = [];
  for(let chapter of this.selectedChapters){
    const bookchapters = this.selectedBooks.filter((item) => {
      return (item.id == chapter.book_id);
    });

    allBooks = allBooks.concat(bookchapters);
  }
  this.selectedBooks = allBooks;

  //learning standards
  let allLS = [];


    for(let ls of this.selectedLearningStandards){
      if(ls.sectionIds != undefined){
        for(let sec of ls.sectionIds){
          if(sec == this.filteredSections.id){
            allLS.push(ls);
          }
        }
      }
    }

  this.selectedLearningStandards = allLS;


  //learning objectives

  console.log("loooooooo")
  let allLO = [];
  for(let lo of this.selectedLearningObjectives){
    console.log(lo.sectionIds)
    console.log(this.filteredSections.id)

    if(lo.sectionIds != undefined){
      for(let sec of lo.sectionIds){
        if(sec == this.filteredSections.id){
          allLO.push(lo);

        }

      }
    }
  }

  this.selectedLearningObjectives = allLO


  // units

  console.log(this.selectedLearningObjectives)
  let allUnits = [];
  for(let lo of this.selectedLearningObjectives){
    const unit = this.selectedUnits.filter((item) => {
      return(item.id == lo.unitId);
    })
    allUnits = allUnits.concat(unit);
  }

  this.selectedUnits = allUnits;


  const unitsDup = [];
  const loDup = [];
  const lsDup = [];
  for(let unit of this.selectedUnits){
    const ind = unitsDup.findIndex(item => item.id == unit.id);
    if(ind == -1){
      unitsDup.push(unit);
    }
  }
  for(let lo of this.selectedLearningObjectives){
    const ind = loDup.findIndex(item => item.learningObjectiveId == lo.learningObjectiveId);
    if(ind == -1){
      loDup.push(lo);
    }
  }
  for(let ls of this.selectedLearningStandards){
    const ind = lsDup.findIndex(item => item.id == ls.id);
    if(ind == -1){
      lsDup.push(ls);
    }
  }

  this.selectedUnits = unitsDup;
  this.selectedLearningObjectives = loDup;
  this.selectedLearningStandards = lsDup;

    // this.filterQuestionsCurriculum(this.filteredLOs)

    // this.filterQuestions(this.selectedSections);

    let qt = [];
      const questionsViewed = [];
      for(let q of this.questions){
        for(let sec of q.sections){
          if(sec.id == this.filteredSections.id){
            questionsViewed.push(q);
          }
        }

      }
      qt = qt.concat(questionsViewed);


    qt = [...new Set(qt)];
    console.log(qt);
    this.questions = qt;

  }
  if(this.enteredOnce){
    this.enteredOnce = false;
    if(this.filteredUnits != null){
      this.onFilterUnit1(this.filteredUnits)
    }
    if(this.filteredLOs != null){
      this.onFilterLO(this.filteredLOs)
    }
    if(this.filteredLS != null){
      this.onFilterLS(this.filteredLS)
    }
    this.enteredOnce = true

  }

}

onFilterUnit1(event){
  // this.questions = this.tempQuestions;

  if(event == undefined){
    this.selectedLearningObjectives = this.tempLOs
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;




  }
  else{
    this.currentPage = 1;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;
    this.selectedLearningObjectives = this.tempLOs;
    this.selectedLearningStandards = this.tempLS;

    console.log(this.filteredUnits)
    console.log(event)

    this.filteredUnits = event;

    console.log(this.filteredUnits)
    console.log(this.selectedLearningObjectives)
    console.log(this.selectedLearningStandards)
    console.log(this.selectedBooks)
    console.log(this.selectedChapters)
    console.log(this.selectedSections)

    //learning objectives
    this.selectedLearningObjectives = this.selectedLearningObjectives.filter((item)=> {
      return(this.filteredUnits.id == item.unitId);
    });

    //learning standards

    let allLS = [];
    for(let lo of this.selectedLearningObjectives){
      const ls = this.selectedLearningStandards.filter((item) => {
        return (item.lo_id == lo.id);
      });
      allLS = allLS.concat(ls);
    }
    this.selectedLearningStandards = allLS;

    //sections;
    let allSections = [];

    for(let lo of this.selectedLearningObjectives){
      if(lo.sectionIds != undefined){
        for(let section of lo.sectionIds){
          const s = this.selectedSections.filter((item) => {
            return (item.id == section);
          });
          allSections = allSections.concat(s);
        }

      }
    }

    this.selectedSections = allSections;

    //chapters
    let allChapters = [];

    for(let section of this.selectedSections){
      const ch = this.selectedChapters.filter((item) => {
        console.log(item)
        console.log(section)
        return (item.id == section.chapter_id);
      });

      allChapters = allChapters.concat(ch);
    }
    this.selectedChapters = allChapters;

    //books
    let allBooks = [];

    for(let chapter of this.selectedChapters){
      const book = this.selectedBooks.filter((item) => {
        return (item.id == chapter.book_id);
      });

      allBooks = allBooks.concat(book);
    }

    this.selectedBooks = allBooks;

    const booksDup = [];
    const chapterDup = [];
    const sectionDup = [];
    const lsDup = [];
    for(let book of this.selectedBooks){
      const ind = booksDup.findIndex(item => item.id == book.id);
      if(ind == -1){
        booksDup.push(book);
      }
    }
    for(let chapter of this.selectedChapters){
      const ind = chapterDup.findIndex(item => item.id == chapter.id);
      if(ind == -1){
        chapterDup.push(chapter);
      }
    }
    for(let section of this.selectedSections){
      const ind = sectionDup.findIndex(item => item.id == section.id);
      if(ind == -1){
        sectionDup.push(section);
      }
    }

    for(let ls of this.selectedLearningStandards){
      const ind = lsDup.findIndex(item => item.id == ls.id);
      if(ind == -1){
        lsDup.push(ls);
      }
    }

    this.selectedBooks = booksDup;
    this.selectedChapters = chapterDup;
    this.selectedSections = sectionDup;
    this.selectedLearningStandards = lsDup
    // this.filterQuestions(this.selectedSections)

    let qt = [];
      const questionsViewed = [];
      for(let q of this.questions){
        for(let unit of q.units){
          if(unit.id == this.filteredUnits.id){
            questionsViewed.push(q);
          }
        }

      }
      qt = qt.concat(questionsViewed);


    qt = [...new Set(qt)];
    console.log(qt);
    this.questions = qt;

  }

  if(this.enteredOnce){
    this.enteredOnce = false;
    if(this.filteredSections != null){
      this.onFilterSection(this.filteredSections)
    }
    if(this.filteredLOs != null){
      this.onFilterLO(this.filteredLOs)
    }
    if(this.filteredLS != null){
      this.onFilterLS(this.filteredLS)
    }
    if(this.filteredChapters != null){
      this.onFilterChapter(this.filteredChapters)
    }
    if(this.filteredBooks != null){
      this.onFilterBook1(this.filteredBooks)
    }
    this.enteredOnce = true

  }

}
// curriculum filter





onFilterLO(event){
  // this.questions = this.tempQuestions;

  if(event == undefined){
    this.selectedLearningObjectives = this.tempLOs
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;




  }
  else{
    this.currentPage = 1;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;

    this.filteredLOs = event;

    //units
      this.selectedUnits = this.selectedUnits.filter((item) => {
        return (item.id == this.filteredLOs.unitId);
      });

    //learning standards

    let allLS = [];

      const ls = this.selectedLearningStandards.filter((item) => {

        return (item.lo_id == this.filteredLOs.id);
      });
      allLS = allLS.concat(ls);

    this.selectedLearningStandards = allLS;

    //sections;
    let allSections = [];

      if(this.filteredLOs.sectionIds != undefined){
        for(let section of this.filteredLOs.sectionIds){
          const s = this.selectedSections.filter((item) => {
            return (item.id == section);
          });
          allSections = allSections.concat(s);
        }

      }


    this.selectedSections = allSections;

    //chapters
    let allChapters = [];

    for(let section of this.selectedSections){
      const ch = this.selectedChapters.filter((item) => {
        return (item.id == section.chapter_id);
      });

      allChapters = allChapters.concat(ch);
    }
    this.selectedChapters = allChapters;

    //books
    let allBooks = [];

    for(let chapter of this.selectedChapters){
      const book = this.selectedBooks.filter((item) => {
        return (item.id == chapter.book_id);
      });

      allBooks = allBooks.concat(book);
    }

    this.selectedBooks = allBooks;
    // this.filterQuestionsCurriculum(this.filteredLOs);

    const booksDup = [];
    const chapterDup = [];
    const sectionDup = [];
    for(let book of this.selectedBooks){
      const ind = booksDup.findIndex(item => item.id == book.id);
      if(ind == -1){
        booksDup.push(book);
      }
    }
    for(let chapter of this.selectedChapters){
      const ind = chapterDup.findIndex(item => item.id == chapter.id);
      if(ind == -1){
        chapterDup.push(chapter);
      }
    }
    for(let section of this.selectedSections){
      const ind = sectionDup.findIndex(item => item.id == section.id);
      if(ind == -1){
        sectionDup.push(section);
      }
    }

    this.selectedBooks = booksDup;
    this.selectedChapters = chapterDup;
    this.selectedSections = sectionDup;

    // this.filterQuestions(this.selectedSections)

    let qt = [];
      const questionsViewed = [];
      for(let q of this.questions){
        for(let lo of q.los){
          if(lo.id == this.filteredLOs.id){
            questionsViewed.push(q);
          }
        }

      }
      qt = qt.concat(questionsViewed);


    qt = [...new Set(qt)];
    console.log(qt);
    this.questions = qt;


  }

if(this.enteredOnce){
  this.enteredOnce = false;

  if(this.filteredLS != null){
    this.onFilterLS(this.filteredLS)
  }
  if(this.filteredBooks != null){
    this.onFilterBook1(this.filteredBooks)
  }
  if(this.filteredChapters != null){
    this.onFilterChapter(this.filteredChapters)
  }
  if(this.filteredSections != null){
    this.onFilterSection(this.filteredSections)
  }
  this.enteredOnce = true
}

}

onFilterLS(event){
      // this.questions = this.tempQuestions;

  if(event == undefined){
    this.selectedLearningObjectives = this.tempLOs
    this.selectedUnits = this.tempUnits;
    this.selectedLearningStandards = this.tempLS;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;




  }
  else{
    this.currentPage = 1;
    this.selectedBooks = this.tempBooks;
    this.selectedChapters = this.tempchapters;
    this.selectedSections = this.tempSections;
    this.selectedUnits = this.tempUnits;
    this.selectedLearningObjectives = this.tempLOs;

    this.filteredLS = event;

    //learning objectiives
      this.selectedLearningObjectives = this.selectedLearningObjectives.filter((item) => {

        return (item.id == this.filteredLS.lo_id);
      });

    //learning standards

    let allUnits = [];
    for(let lo of this.selectedLearningObjectives){
      const unit= this.selectedUnits.filter((item) => {
        console.log(item)
        console.log(lo)
        return (item.id == lo.unitId);
      });
      allUnits = allUnits.concat(unit);
    }
    this.selectedUnits = allUnits;

    //sections;
    let allSections = [];

    for(let lo of this.selectedLearningObjectives){
      if(lo.sectionIds != undefined){
        for(let section of lo.sectionIds){
          const s = this.selectedSections.filter((item) => {
            return (item.id == section);
          });
          allSections = allSections.concat(s);
        }

      }
    }

    this.selectedSections = allSections;

    //chapters
    let allChapters = [];

    for(let section of this.selectedSections){
      const ch = this.selectedChapters.filter((item) => {
        return (item.id == section.chapter_id);
      });

      allChapters = allChapters.concat(ch);
    }
    this.selectedChapters = allChapters;

    //books
    let allBooks = [];

    for(let chapter of this.selectedChapters){
      const book = this.selectedBooks.filter((item) => {
        return (item.id == chapter.book_id);
      });

      allBooks = allBooks.concat(book);
    }

    this.selectedBooks = allBooks;

    // this.filterQuestionsCurriculum(this.filteredLOs);
    const booksDup = [];
    const chapterDup = [];
    const sectionDup = [];
    const unitDup = [];
    for(let unit of this.selectedUnits){

      const ind = unitDup.findIndex(item => item.id == unit.id);
      if(ind == -1){
        unitDup.push(unit);
      }
    }

    for(let book of this.selectedBooks){
      const ind = booksDup.findIndex(item => item.id == book.id);
      if(ind == -1){
        booksDup.push(book);
      }
    }
    for(let chapter of this.selectedChapters){
      const ind = chapterDup.findIndex(item => item.id == chapter.id);
      if(ind == -1){
        chapterDup.push(chapter);
      }
    }
    for(let section of this.selectedSections){
      const ind = sectionDup.findIndex(item => item.id == section.id);
      if(ind == -1){
        sectionDup.push(section);
      }
    }

    this.selectedUnits = unitDup
    this.selectedBooks = booksDup;
    this.selectedChapters = chapterDup;
    this.selectedSections = sectionDup;

    // this.filterQuestions(this.selectedSections)

    let qt = [];
      const questionsViewed = [];
      for(let q of this.questions){
        for(let ls of q.learning_standards){
          if(ls.id == this.filteredLS.id){
            questionsViewed.push(q);
          }
        }

      }
      qt = qt.concat(questionsViewed);


    qt = [...new Set(qt)];
    console.log(qt);
    this.questions = qt;

  }

  if(this.enteredOnce){
    this.enteredOnce = false;

    if(this.filteredBooks != null){
      this.onFilterBook1(this.filteredBooks)
    }
    if(this.filteredChapters != null){
      this.onFilterChapter(this.filteredChapters)
    }
    if(this.filteredSections != null){
      this.onFilterSection(this.filteredSections)
    }
    this.enteredOnce = true
  }


}

onFilterDomain(event){
  this.currentPage = 1;
  console.log(event)
  this.domains = [];

  let allBooks = [];
  let allChapters = [];
  let allSections = [];

  let allUnits = [];
  let allLOs = [];
  let allLS = [];
  this.domains.push(event)
  const tempQ = this.questions;
  this.questions = [];
  for(let question of tempQ){
    for(let cq of question.cq){
      for(let qlo of cq.qLOs){
        if(qlo.LO.domain != undefined){
          const d = qlo.LO.domain;
          if(d.id == event.id){
            this.questions.push(question);

              const book = this.selectedBooks.filter((item) => {
                return (item.id == question.book.id);
              });
              if(book!= undefined){
                allBooks = allBooks.concat(book)
              }
            for(let sec of qlo.LO.sectionLO){

              const chapter = this.selectedChapters.filter((item) => {
                return (item.id == sec.section.chapter_id);
              });
              if(chapter!= undefined){
                allChapters = allChapters.concat(chapter)
              }

              const section = this.selectedSections.filter((item) => {
                return (item.id == sec.sectionId);
              });
              if(section!= undefined){
                allSections = allSections.concat(section)
              }

              const chapterIndex = this.selectedChapters.findIndex(item => item.id == sec.section.chapter_id)
              if(chapterIndex == -1){
                this.selectedChapters.push(sec.section.chapter);
              }
              const sectionIndex = this.selectedSections.findIndex(item => item.id == sec.sectionId);
              if(sectionIndex == -1){
                this.selectedSections.push(sec.section)
              }

            }

            for(let u of qlo.LO.unitLO){
              const unit = this.selectedUnits.filter((item) => {
                return (item.id == u.id);
              });
              if(unit!= undefined){
                allUnits = allUnits.concat(unit)
              }
            }

            const ls = this.selectedLearningStandards.filter((item) => {
              return (item.id == qlo.LO.learningStandardId);
            });
            if(ls!= undefined){
              allLS = allLS.concat(ls)
            }

            const lo = this.selectedLearningObjectives.filter((item) => {
              return (item.learningObjectiveId == qlo.LO.id);
            });
            if(lo!= undefined){
              allLOs = allLOs.concat(lo);
            }

          }
        }
      }

    }
  }

  this.selectedBooks = [...new Set(allBooks)];
  this.selectedChapters = [...new Set(allChapters)];
  this.selectedSections = [... new Set(allSections)];
  this.selectedUnits = [... new Set(allUnits)];
  this.selectedLearningObjectives = [... new Set(allLOs)];
  this.selectedLearningStandards = [... new Set(allLS)];

}

filterQuestions(sections: ChapterSection[]){

  let qt = [];
  for(let section of sections){
    const questionsViewed = [];
    for(let q of this.questions){
      for(let s of q.sections){
        if(s.id == section.id){
          questionsViewed.push(q);
        }
      }
    }
    qt = qt.concat(questionsViewed);
  }

  qt = [...new Set(qt)];
  console.log(qt);
  this.questions = qt;

  if(this.filteredUnits != null){
    this.onFilterUnit1(this.filteredUnits)
  }
  if(this.filteredLOs != null){
    this.onFilterLO(this.filteredLOs)
  }
  if(this.filteredBooks != null){
    this.onFilterBook1(this.filteredBooks)
  }
  if(this.filteredChapters != null){
    this.onFilterChapter(this.filteredChapters)
  }
  if(this.filteredSections != null){
    this.onFilterSection(this.filteredSections)
  }
}

filterQuestionsCurriculum(los: any[]){

  let qt = [];
  for(let lo of los){
    const questionsViewed = [];
    for(let q of this.questions){
      for(let question of q.cq){
        for(let lo2 of question.qLOs){
            if(lo.learningObjectiveId == lo2.LO.id){
              questionsViewed.push(q);
          }
        }
      }
    }

    qt = qt.concat(questionsViewed);
  }
  qt = [...new Set(qt)];
  this.questions = qt;
}


clearFilters(){
  this.filterObject = {
    booksFilter: '',
    chapterFilters: '',
    sectionsFilter: '',
    unitsFilter: '',
    loFilter: '',
    lsFilter: '',
    difficultyFilter: '',
    questionTypeFilter: ''
  }
  this.currentPage = 1;
  console.log('temp questions')
  console.log(this.tempQuestions)
  console.log(this.tempchapters)
  this.questions = this.tempQuestions;
  this.filteredBooks = null;
    this.filteredChapters = null;
    this.filteredSections = null;
  this.filteredUnits = null;
  this.filteredLOs = null;
  this.filteredLS = null;
  this.filteredDomain = null;
  this.chosenDifficulty = null;
  this.chosenQuestionType = null;
  this.domains = this.tempDomains;
  this.selectedBooks = this.tempBooks;
  this.selectedChapters = this.tempchapters;
  this.selectedSections = this.tempSections;
  this.selectedUnits = this.tempUnits;
  this.selectedLearningObjectives = this.tempLOs;
  this.selectedLearningStandards = this.tempLS;

}

submitQuestions(){
  console.log(this.selectedQuestions)
  this.assessmentManagerService.questions$.next(this.selectedQuestions);
  this.assessmentManagerService.time$.next(this.time);
  this.onChooseQuestions.emit(4);


}

getDifficulty(questions: any[]){
  const difficultiesSet = new Set<number>();
  for(let question of questions){

      difficultiesSet.add(question.difficulty);


  }


  const difficulties = [];
  for(let diff of difficultiesSet){
    difficulties.push({'name': diff});
  }

  return difficulties
}

getQuestionTypes(questions: any[]){
  const questiontypesSet = new Set<string>();
    for(let ques of questions){
      questiontypesSet.add(ques.questionType)
    }
    const tempTypes = []
    for(let type of questiontypesSet){
      tempTypes.push({'name': type});

    }
    console.log('question types')
    console.log(tempTypes)
    return tempTypes
}

onFilterDifficulty(event){

  console.log(event)
  if(event == undefined){
    this.questions = this.tempQuestions
  }
  else{
    this.currentPage = 1;
    const tempQ = []
    for(let question of this.questions){
        if(question.difficulty === event.name){
          const findQ = tempQ.find((item) => item.id == question.id);
          if(findQ == undefined){
            tempQ.push(question);
          }
        }

    }
    this.questions = tempQ
  }


}

onFilterQuestionType(event){
  if(event == undefined){
    this.questions = this.tempQuestions
  }
  else{
    this.currentPage = 1;
    const tempQ = [];
    for(let question of this.questions){
        if(question.questionType === event.name){
          tempQ.push(question);
        }

    }
    this.questions = tempQ
  }

}

viewQuestion(question){
  this.dialog.open(ViewQuestionDialogComponent, {
    autoFocus: false,
    data: {
      question: question,
    },
  });
}

analyzeQuestionText(questionText: string){
  const questionArray = questionText.split(' ');
  let newQuestion = ''
  for(let letter of questionArray){
    if(letter.includes('{$$') &&  letter.includes('$$}')){
      const imageName = letter.replace('{$$', '').replace('$$}', '');
      const newImage = '<img src="'+ ImgURL + imageName+'" />'

      newQuestion = newQuestion + newImage + ' ';
    }
    else{
      newQuestion = newQuestion + letter + ' ';
    }

  }

  return newQuestion;
}
dateConversion(seconds: number){
  var minutes = Math.floor(seconds / 60);
  var sec = seconds - (minutes * 60);

  if(minutes == 0 && sec == 0){
    return '0min'
  }
  else if(minutes == 0){
    return sec + 'sec';
  }
  else if(sec == 0){
    return minutes + 'min'
  }
  else{
    return minutes + 'min ' + sec + 'sec'
  }

}

yAxisTickFormattingFn(value) {
  var minutes = Math.floor(value / 60);
  var sec = value - (minutes * 60);

  return minutes + 'min'
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
