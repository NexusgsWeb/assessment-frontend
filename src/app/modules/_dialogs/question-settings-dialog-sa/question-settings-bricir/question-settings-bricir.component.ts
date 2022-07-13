import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { BehaviorSubject } from 'rxjs';
import { BloomstaxonomyManagerService } from 'src/app/modules/_services/bloomstaxonomy-manager.service';

@Component({
  selector: 'app-question-settings-bricir',
  templateUrl: './question-settings-bricir.component.html',
  styleUrls: ['./question-settings-bricir.component.css']
})
export class QuestionSettingsBricirComponent implements OnInit {
  
  @Input() dataSelected : any;
  @Input() britishData: any;
  @Output() changeCurriculum: EventEmitter<string> = new EventEmitter();
  @Output() submitBritishData: EventEmitter<any> = new EventEmitter();

  SelectedCir: BehaviorSubject<string> = new BehaviorSubject<string>('');
  chosenBritish = [];
  question: any;
  grades: any;
  selectedSubject: any;
  domains: any = [];
  selectedDomain: any;
  first = true;


  curriculumName: string = 'British';

  curriculumGrades: any;

  selectedGrade: any;
  learningObjectives: any[];
  selectedLO: any;
  domainLoMap = [];
  selectedBloomTaxonomy: any;
  questionBloomsTaxanomy: any;
  bloomsTaxonomy: any[] = [];
  tempBT: any[] = [];
  selectedDOK: any;

  doks: any[] = []
  selectedDomains: any[] = []
  selectedLOs: any[] = []

  doksDomain: any[] = []
  doksLO: any[] = []
  selectedDokDomain: any;
  selectedDokLO: any;

  constructor(private questionManager: QuestionmanagerService, 
    private bloomsTaxonomyManager: BloomstaxonomyManagerService) { }

ngOnInit(): void {
console.log('american access')
this.SelectedCir.next('American')
for(let i = 1; i <= 10; i++){
this.doksDomain.push({name: i});
this.doksLO.push({name: i});

}


console.log(this.dataSelected)
this.question = this.dataSelected.data.question;
this.grades = this.dataSelected.data.allGrades;
this.selectedSubject = this.dataSelected.data.subject;

this.curriculumGrades = this.grades.filter((item) => {
return item.curriculumName == this.curriculumName;
});

// const selectedGradeCode =
// this.question.cq[0].qLOs[0].LO.learningStandard.gradeCode;
// console.log(this.curriculumGrades);
// this.selectedGrade = this.curriculumGrades.find((item) => {
//   return item.name === selectedGradeCode;
// });

console.log(this.britishData)
if(this.britishData != undefined){

this.grades = this.britishData.grades;
// this.domains = this.britishData.domains;
this.bloomsTaxonomy = this.britishData.bloomsTaxonomy;
// this.learningObjectives = this.britishData.learningObjectives;

this.curriculumGrades = this.grades.filter((item) => {
return item.curriculumName == this.curriculumName;
});

this.domains = this.britishData.domains
this.selectedGrade = this.grades.find(item => item.name == this.britishData.gradeCode)
this.selectedBloomTaxonomy = this.bloomsTaxonomy.find((item) => item.id == this.britishData.bloomsTaxonomyId)
// this.selectedDOK = this.selectedBloomTaxonomy.knowledgeLevel
// for(let i =0; i< this.britishData.domainIds.length; i++){
//   const dom = this.domains.find((item)=> item.id == this.britishData.domainIds[i])
//   this.selectedDomains.push({domain: dom, dok: null})

// }
this.domainLoMap =this.britishData.domainLoMap;

for(let i =0; i< this.britishData.learningObjectiveIds.length; i++){


const lo = this.domainLoMap[i].los.find((item)=> item.id == this.britishData.learningObjectiveIds[i])
const dom = this.domains.find((item)=> item.id == lo.domain_id)

this.chosenBritish.push({domain: dom, learningObjective: lo})

}

}
else{
  if(this.dataSelected != undefined){

    console.log(this.curriculumGrades)
    console.log(this.question)
    if(this.question.curriculum_questions.find((item1) => item1.curriculum_id == 3) != undefined){
      const tempGrade = this.curriculumGrades.find((item) => item.name == this.question.curriculum_questions.find((item1) => item1.curriculum_id == 3).gradeCode);
      console.log(tempGrade)
       if(tempGrade != undefined){
         this.selectedGrade = tempGrade
         this.onSelectGrade(this.selectedGrade)
       }
    }
    
  }



//blooms taxonomy
this.getBloomsTaxonomy(); 
this.addLO();

}


}

getBloomsTaxonomy() {
this.bloomsTaxonomyManager
.getBloomsTaxonomyDittofi()
.then((res: any) => {
console.log(res);
this.bloomsTaxonomy = res.data;
this.tempBT = [];
for (let bt of this.bloomsTaxonomy) {
const found = this.tempBT.find(
  (item) => item.knowledge_category == bt.knowledge_category
);
if (found == undefined) {
  this.tempBT.push(bt);
}
}

if (this.questionBloomsTaxanomy != null) {
this.selectedBloomTaxonomy = this.bloomsTaxonomy.find(
  (item) =>
    item.knowledge_category ==
    this.questionBloomsTaxanomy.knowledge_category
);
this.selectedDOK = this.bloomsTaxonomy.find(
  (item) =>
    item.knowledge_dimension == this.questionBloomsTaxanomy.knowledge_dimension
);
this.onSelectCL(this.selectedBloomTaxonomy)

}
})
.catch((err) => console.log(err));
}


getCurriculumDomains(curriculumId, gradeCode) {
console.log(this.selectedGrade);
this.questionManager
.getCurriculumDomainsDittofi(curriculumId, gradeCode)
.then((res: any) => {
console.log(res);

this.domains = res.data;

if(this.domains != null){

if( this.chosenBritish[0].domain == undefined && this.chosenBritish[0].learningObjective == undefined){
  this.chosenBritish = []
  let i =0;
  for(let lo of this.question.learning_standards){
    lo.displayName = lo.code + ' ' + lo.description;
    let domain = this.domains.find((item) => item.id == lo.domain_id)
    if(domain != undefined){
      this.getDomainLOs(3, this.selectedGrade.name, domain, i)
      i++
      this.chosenBritish.push({domain: domain, learningObjective: lo})
    }
    
  }
  if(this.chosenBritish.length == 0){
    this.addLO()
  }
  this.submitChanges()
}
}
// const dom = this.question.cq[0].qLOs[0].LO.domain;
// this.selectedDomain = this.domains.find((item) => item.id == dom.id);
// if (this.selectedDomain != undefined) {
//   this.getDomainLOs(
//     this.selectedDomain.id,
//   );
// }
})
.catch((res) => {
console.log(res);
});
}

onSelectGrade(event) {
// this.chosenBritish = [{ domain: null, learningObjective: null }];
//curriculum domains
this.getCurriculumDomains(3, event.name);
this.selectedGrade = event;
}
onSelectDomain(event, index) {
console.log(event);
this.selectedDomain = event;
this.chosenBritish[index].learningObjective = undefined
this.getDomainLOs(3, this.selectedGrade.name,
event, index
);
}

getDomainLOs(curriculumId, gradeCode, domain, index) {


console.log(this.selectedSubject);
this.questionManager
.getLObyDomainDittofi(curriculumId, gradeCode, domain.id)
.then((res: any) => {
console.log(res)
if(res.data != null){
  const lo = res.data;
  for (let l of lo) {
  l.displayName = l.code + ' ' + l.description;
  }
  this.learningObjectives = lo;
  
  this.domainLoMap[index] = {domain: domain, los: this.learningObjectives};
  
  
  console.log(res);

}
else{
  this.domainLoMap[index] = {domain: domain, los: []};

}
})
.catch((res) => {
console.log(res);
});
}
switchToAmerican() {
this.SelectedCir.next('American');
this.changeCurriculum.emit('American')
}
switchToLebanese() {
this.SelectedCir.next('Lebanese');
this.changeCurriculum.emit('Lebanese')

}
switchToBritish() {
this.SelectedCir.next('British');
this.changeCurriculum.emit('British')

}
onChangeLO(){
console.log("submit changes")
this.submitChanges()
}

addLO(){
this.chosenBritish.push({lo: null, dok: null})
this.domainLoMap.push({domain: null, los: null})
}

onSelectCL(event) {
console.log(event);
this.doks = this.bloomsTaxonomy.filter((item) => {
console.log(item.knowledgeCategory);
console.log(event.knowledgeCategory);
console.log('----------------------------------');
return item.knowledgeCategory == event.knowledgeCategory;
});
this.submitChanges()
}
// onSelectDoks(){
//   this.submitChanges()
// }

submitChanges() {

console.log('submit changes called')
if(this.selectedGrade != undefined 
&& this.selectedSubject != undefined && this.chosenBritish.length > 0 ){
const loIds = [];
const domainIds = [];

for (let american of this.chosenBritish) {
const index = loIds.findIndex(
  (item) => item == american.learningObjective.id
);
console.log(index);
if (index == -1) {
  loIds.push(american.learningObjective.id);
}


const index1 = domainIds.findIndex(
  (item) => item == american.domain.id
);
console.log(index1);
if (index1 == -1) {
  domainIds.push(american.domain.id);
}


}

const changes = {
grade_id: this.selectedGrade.id,
grades: this.grades,
bloomsTaxonomy: this.bloomsTaxonomy,
domains: this.domains,
learningObjectives: this.learningObjectives,
curriculumId: 3,
gradeCode: this.selectedGrade.name,
subjectCode: this.selectedSubject.code,
learningObjectiveIds: loIds,
domainIds: domainIds,
domainLoMap: this.domainLoMap
// dokDomain: this.selectedDokDomain,
// doksLO: this.selectedDokLO
};
console.log(changes)
this.submitBritishData.emit(changes);
}


// this.questionManager
//   .submitQuestionChanges(this.question.id, changes)
//   .then((res) => {
//     console.log(res);
//     this.closeDialog.emit(true);
//   })
//   .catch((res) => {
//     console.log(res);

//     this.serviceDialog.openDialog({
//       title: res.error.error.message,
//       message: 'MESSAGE DIALOG',
//       confirmText: 'Cancel',
//       cancelText: 'Okay',
//       oneButton: false,
//       DidConfirm: () => {},
//     });
//   });

}

removeRow(index) {
this.chosenBritish.splice(index, 1);
this.domainLoMap.splice(index, 1);
this.submitChanges()


}
}
