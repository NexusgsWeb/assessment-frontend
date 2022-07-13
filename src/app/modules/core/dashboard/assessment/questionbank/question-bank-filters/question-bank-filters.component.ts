import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-question-bank-filters',
  templateUrl: './question-bank-filters.component.html',
  styleUrls: ['./question-bank-filters.component.css']
})
export class QuestionBankFiltersComponent implements OnInit {
  @Input() filterComponents;
  @Input() chosenSubject;

  @Output() onFilterSelected = new EventEmitter<any>();

  curSelected: any;
  gradeSelected: any;
  domainSelected: any;
  loSelected: any;
  statusSelected: any;
  clearSelected: any;




  statues: any[] = []
  selectedStatus: any;

  curriculums: any[] = []
  selectedCurriculum: any;
  tempSelectedCurriculums: any[] =[];

  grades: any[] = [];
  allGrades: any[] =[];
  selectedGrade: any;

  domains: any[] = [];
  selectedDomain: any;
  tempSelectedDomains = [];

  learningObjectives: any[] =[];
  selectedLearningObjective: any;


  constructor(private questionManager: QuestionmanagerService) { }

  ngOnInit(): void {

    this.statues = [{name: 'Pending', value: 'Pending'},
               {name: 'Approved', value: 'Approved'}, ]
    // console.log('filtered1')
    // console.log(this.filterComponents)
    // if(this.filterComponents != undefined){
    //   console.log('filtered2')

    //   console.log(this.filterComponents)
    // }




  }

  ngOnChanges(): void{
    console.log('filtered3')
    console.log(this.filterComponents)
    console.log(this.chosenSubject)

    if(this.filterComponents != undefined){
      console.log(this.filterComponents.subjectMap[this.chosenSubject.code]);

      const tempCurMap = this.filterComponents.subjectMap[this.chosenSubject.code]
      console.log(tempCurMap)
      let temp = []
      for(let cur of tempCurMap){
        let c = temp.find((item) => item.id == cur.id);
        if(c == undefined){
          temp.push(cur)
        }
      }
      this.curriculums = [... temp];
      this.allGrades = [... this.filterComponents.grades];

    }


  }

  onSelectCurriculum(event){
    console.log(event)
    const curriculumGrades = this.allGrades.filter((item) => {return item.curriculumName == event.name})
    console.log(curriculumGrades)
    this.grades = [...curriculumGrades]

    this.curSelected = {type: "curriculum", data: event}
    this.selectedGrade = null;
    this.selectedDomain = null;
    this.selectedLearningObjective = null;

    this.gradeSelected = this.selectedGrade
    this.domainSelected = this.selectedDomain
    this.loSelected = this.selectedLearningObjective
    this.clearSelected = null

    const obj = {
      curriculum: this.curSelected,
      grade: this.gradeSelected,
      domain: this.domainSelected,
      lo: this.loSelected,
      status: this.statusSelected,
      clear: this.clearSelected
    }

    this.onFilterSelected.emit(obj);





    // const curriculum = this.notFoundCurriculum(this.selectedCurriculums, this.tempSelectedCurriculums);
    // if(this.selectedCurriculums.length > this.tempSelectedCurriculums.length){
    //   this.getCurriculumDomains(curriculum.id);
    // }
    // else{
    //   const tempDomains = this.domains.filter((item) => {
    //     return(item.curriculumId == curriculum.id);
    //   })

      // for(let domain of tempDomains){
      //   this.selectedLearningObjectives = this.selectedLearningObjectives.filter((item) => {
      //     return (item.domainId != domain.id);
      //   })
      // }
      // this.domains = this.domains.filter((item) => {
      //   return(item.curriculumId != curriculum.id);
      // })
    // }
    // this.tempSelectedCurriculums = this.selectedCurriculums;
  }
  onSelectGrade(event){
    console.log('test test')
    console.log(event)
    console.log(this.curSelected)
    this.getCurriculumDomains(this.curSelected.data.id, event.name);

    this.selectedDomain = null;
    this.selectedLearningObjective = null;

    this.domainSelected = this.selectedDomain
    this.loSelected = this.selectedLearningObjective

    this.clearSelected = null
    this.gradeSelected = {type: "grade", data: event}

    const obj = {
      curriculum: this.curSelected,
      grade: this.gradeSelected,
      domain: this.domainSelected,
      lo: this.loSelected,
      status: this.statusSelected,
      clear: this.clearSelected
    }

    this.onFilterSelected.emit(obj);

  }
  onSelectDomain(event){
    console.log(event)
    console.log(this.selectedGrade)
    console.log(this.chosenSubject)
    this.getDomainLOs(event.id, this.selectedGrade.name, this.chosenSubject.code);
    this.domainSelected = {type: "domain", data: event}

    this.selectedLearningObjective = null;
    this.loSelected = this.selectedLearningObjective
    this.clearSelected = null

    const obj = {
      curriculum: this.curSelected,
      grade: this.gradeSelected,
      domain: this.domainSelected,
      lo: this.loSelected,
      status: this.statusSelected,
      clear: this.clearSelected
    }

    this.onFilterSelected.emit(obj);

    // const domain = this.notFoundDomain(this.selectedDomains, this.tempSelectedDomains);
    // if(this.selectedDomains.length > this.tempSelectedDomains.length){
    //   this.getDomainLOs(domain.curriculumId);
    // }
    // else{
    //   this.selectedLearningObjectives = this.selectedLearningObjectives.filter((item) => {
    //     return (item.domainId != domain.id);
    //   });
    // }
    // this.tempSelectedDomains = this.selectedDomains;
  }
  onSelectLO(event){
    this.clearSelected = null
    this.loSelected = {type: "lo", data: event}
    const obj = {
      curriculum: this.curSelected,
      grade: this.gradeSelected,
      domain: this.domainSelected,
      lo: this.loSelected,
      status: this.statusSelected,
      clear: this.clearSelected
    }

    this.onFilterSelected.emit(obj);
  }

  onSelectStatus(event){
    console.log(event)
    this.clearSelected = null
    this.statusSelected = {type: "status", data: event}

    const obj = {
      curriculum: this.curSelected,
      grade: this.gradeSelected,
      domain: this.domainSelected,
      lo: this.loSelected,
      status: this.statusSelected,
      clear: this.clearSelected
    }

    this.onFilterSelected.emit(obj);

  }
  clearFilters(){
    this.selectedCurriculum = null;
    this.selectedDomain = null;
    this.selectedGrade = null;
    this.selectedLearningObjective = null;
    this.selectedStatus = null
    this.clearSelected = {type: '', data: null}

    this.curSelected = this.selectedCurriculum
    this.gradeSelected = this.selectedGrade
    this.domainSelected = this.selectedDomain
    this.loSelected = this.selectedLearningObjective
    this.statusSelected = this.selectedStatus


    const obj = {
      curriculum: this.curSelected,
      grade: this.gradeSelected,
      domain: this.domainSelected,
      lo: this.loSelected,
      status: this.statusSelected,
      clear: this.clearSelected
    }
    this.onFilterSelected.emit(obj);
  }
  getCurriculumDomains(curriculumId, gradeCode){
    this.questionManager.getCurriculumDomainsDittofi(curriculumId, gradeCode).then((res: any) =>{
      console.log(res);
      this.domains = res.data;
    }).catch((res)=>{
      console.log(res);
    });
  }

  getDomainLOs(domainId, gradeCode, subjectCode){
   console.log(gradeCode)
   console.log(subjectCode)
   console.log(this.selectedCurriculum)
    this.questionManager.getLObyDomainDittofi(this.selectedCurriculum.id, gradeCode ,domainId).then((res: any) =>{
      const lo = res.data;
      for(let l of lo){
        l.displayName = l.code + ' ' + l.description;
      }
      this.learningObjectives = lo
      console.log(res);
    }).catch((res)=>{
      console.log(res);
    });
  }

  notFoundCurriculum(selectedCurriculums: any[], tempCurriculums: any[]){
    let pressedCur = null;
    if(selectedCurriculums.length > tempCurriculums.length){
      for(let cur of selectedCurriculums){
        let curriculum = tempCurriculums.find(item => item.id == cur.id)
          if(curriculum == undefined){
            pressedCur = curriculum;
        }
      }

    }
    else{
      for(let cur of tempCurriculums){
        let curriculum = selectedCurriculums.find(item => item.id == cur.id);
        if(curriculum == undefined){
          pressedCur = curriculum;
        }
      }
    }

    return pressedCur;

  }

  notFoundDomain(selectedDomains, tempDomains){
    let pressedDomain = null;
    if(selectedDomains.length > tempDomains.length){
      for(let dom of selectedDomains){
        let domain = tempDomains.find(item => item.id == dom.id)
          if(domain == undefined){
            pressedDomain = domain;
        }
      }

    }
    else{
      for(let dom of tempDomains){
        let domain = selectedDomains.find(item => item.id == dom.id);
        if(domain == undefined){
          pressedDomain = domain;
        }
      }
    }

    return pressedDomain;
  }

}
