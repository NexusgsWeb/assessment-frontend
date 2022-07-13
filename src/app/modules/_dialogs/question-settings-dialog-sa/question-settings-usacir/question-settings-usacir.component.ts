import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { BehaviorSubject } from 'rxjs';
import { BloomstaxonomyManagerService } from 'src/app/modules/_services/bloomstaxonomy-manager.service';

@Component({
  selector: 'app-question-settings-usacir',
  templateUrl: './question-settings-usacir.component.html',
  styleUrls: ['./question-settings-usacir.component.css']
})
export class QuestionSettingsUsacirComponent implements OnInit {

  @Input() dataSelected : any;
  @Input() americanData: any;
  @Output() changeCurriculum: EventEmitter<string> = new EventEmitter();
  @Output() submitAmericanData: EventEmitter<any> = new EventEmitter();

  SelectedCir: BehaviorSubject<string> = new BehaviorSubject<string>('');

  question: any;
  grades: any;
  selectedSubject: any;
  domains: any = [];
  selectedDomain: any;
  domainLoMap = [];


  curriculumName: string = 'American';

  curriculumGrades: any;

  chosenAmerican = [];
  selectedGrade: any;
  learningObjectives: any[];
  selectedLO: any;

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

  console.log(this.americanData)
  if(this.americanData != undefined){
    
    this.grades = this.americanData.grades;
    // this.domains = this.americanData.domains;
    this.bloomsTaxonomy = this.americanData.bloomsTaxonomy;
    // this.learningObjectives = this.americanData.learningObjectives;

    this.curriculumGrades = this.grades.filter((item) => {
      return item.curriculumName == this.curriculumName;
    });

    this.domains = this.americanData.domains
    this.selectedGrade = this.grades.find(item => item.name == this.americanData.gradeCode)
    this.selectedBloomTaxonomy = this.bloomsTaxonomy.find((item) => item.id == this.americanData.bloomsTaxonomyId)
    // this.selectedDOK = this.selectedBloomTaxonomy.knowledgeLevel
    // for(let i =0; i< this.americanData.domainIds.length; i++){
    //   const dom = this.domains.find((item)=> item.id == this.americanData.domainIds[i])
    //   this.selectedDomains.push({domain: dom, dok: null})

    // }
    this.domainLoMap =this.americanData.domainLoMap;

    for(let i =0; i< this.americanData.learningObjectiveIds.length; i++){
      

      const lo = this.domainLoMap[i].los.find((item)=> item.id == this.americanData.learningObjectiveIds[i])
      const dom = this.domains.find((item)=> item.id == lo.domain_id)

      this.chosenAmerican.push({domain: dom, learningObjective: lo})

    }

  }
  else{
   
    if(this.dataSelected != undefined){
      // this.questionBloomsTaxanomy = this.question.blooms_taxonomy[0];

      console.log(this.curriculumGrades)
      console.log(this.question)
      if(this.question.curriculum_questions.find((item1) => item1.curriculum_id == 1) != undefined){
        const tempGrade = this.curriculumGrades.find((item) => item.name == this.question.curriculum_questions.find((item1) => item1.curriculum_id == 1 ).gradeCode);
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
    console.log(curriculumId);
    console.log(gradeCode)
    this.questionManager
      .getCurriculumDomainsDittofi(curriculumId, gradeCode)
      .then((res: any) => {
        console.log(res);
        this.domains = res.data;

        if(this.domains != null){
          if( this.chosenAmerican[0].domain == undefined && this.chosenAmerican[0].learningObjective == undefined){
            this.chosenAmerican = []
            let i =0;
            for(let lo of this.question.learning_standards){
              lo.displayName = lo.code + ' ' + lo.description;
              let domain = this.domains.find((item) => item.id == lo.domain_id)
              if(domain != undefined){
                this.getDomainLOs(1, this.selectedGrade.name, domain, i)
                
                i++
                this.chosenAmerican.push({domain: domain, learningObjective: lo})
              }
             
            }
            if(this.chosenAmerican.length == 0){
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
    // this.chosenAmerican = [{ domain: null, learningObjective: null }];
    //curriculum domains
    this.getCurriculumDomains(1, event.name);
    this.selectedGrade = event;
  }
  onSelectDomain(event, index) {
    console.log(event);
    this.selectedDomain = event;
    this.chosenAmerican[index].learningObjective = undefined

    this.getDomainLOs(1, this.selectedGrade.name, event, index)
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
    this.chosenAmerican.push({lo: null, dok: null})
    this.domainLoMap.push({domain: null, los: null})
  }

  onSelectCL(event) {
    console.log(event);
    this.doks = this.bloomsTaxonomy.filter((item) => {
      console.log(item.knowledge_category);
      console.log(event.knowledge_category);
      console.log('----------------------------------');
      return item.knowledge_category == event.knowledge_category;
    });
    this.submitChanges()
  }
  // onSelectDoks(){
  //   this.submitChanges()
  // }

  submitChanges() {

    console.log('submit changes called')
    if(this.selectedGrade != undefined 
      && this.selectedSubject != undefined && this.chosenAmerican.length > 0 ){
        const loIds = [];
        const domainIds = [];

        for (let american of this.chosenAmerican) {
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
          curriculumId: 1,
          gradeCode: this.selectedGrade.name,
          subjectCode: this.selectedSubject.code,
          learningObjectiveIds: loIds,
          domainIds: domainIds,
          domainLoMap: this.domainLoMap
          // dokDomain: this.selectedDokDomain,
          // doksLO: this.selectedDokLO
        };
        console.log(changes)
        this.submitAmericanData.emit(changes);
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
    this.chosenAmerican.splice(index, 1);
    this.domainLoMap.splice(index, 1);
    this.submitChanges()

  }
}
