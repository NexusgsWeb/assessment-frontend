import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { BloomstaxonomyManagerService } from 'src/app/modules/_services/bloomstaxonomy-manager.service';
import { DialogServiceService } from '../../shared/dialog-service.service';
import { BehaviorSubject } from 'rxjs';
import { threadId } from 'worker_threads';
import { LearningObjective } from 'src/app/modules/Models/LearningObjective';

@Component({
  selector: 'app-question-settings-lebcir',
  templateUrl: './question-settings-lebcir.component.html',
  styleUrls: ['./question-settings-lebcir.component.css'],
})
export class QuestionSettingsLebcirComponent implements OnInit {
  @Output() closeDialogLebanese: EventEmitter<boolean> = new EventEmitter();
  @Output() changeCurriculum: EventEmitter<string> = new EventEmitter();
  @Output() submitLebaneseData: EventEmitter<any> = new EventEmitter();



  @Input() dataSelected: any;
  @Input() lebaneseData: any;
  domainLoMap = [];

  question: any;
  grades: any;
  curriculumName: string = 'Lebanese';

  curriculumGrades: any;
  selectedGrade: any;
  domains: any = [];
  selectedDomain;

  learningObjectives: any[];
  selectedLO: any;

  selectedSubject: any;
  questionBloomsTaxanomy: any;

  bloomsTaxonomy: any[] = [];
  tempBT: any[] = [];
  selectedBloomTaxonomy: any;
  selectedDOK: any;
  doks: any[] = [];
  SelectedCir: BehaviorSubject<string> = new BehaviorSubject<string>('');

  chosenLebanese: any[] = [];
  constructor(
    private questionManager: QuestionmanagerService,
    private bloomsTaxonomyManager: BloomstaxonomyManagerService,
    private serviceDialog: DialogServiceService
  ) {}

  ngOnInit(): void {
    console.log(this.dataSelected)
    console.log(this.selectedDOK)
    this.SelectedCir.next('Lebanese')
    console.log(this.SelectedCir.getValue())
    console.log(this.dataSelected);
    this.question = this.dataSelected.data.question;
    this.grades = this.dataSelected.data.allGrades;
    this.selectedSubject = this.dataSelected.data.subject;

    this.curriculumGrades = this.grades.filter((item) => {
      return item.curriculumName == this.curriculumName;
    });

    // console.log(this.question.cq[0].qLOs[0].LO.learningStandard.gradeCode);
    // const selectedGradeCode =
    //   this.question.cq[0].qLOs[0].LO.learningStandard.gradeCode;
    // console.log(this.curriculumGrades);
    // this.selectedGrade = this.curriculumGrades.find((item) => {
    //   return item.name === selectedGradeCode;
    // });




    console.log("lebanese data")
    console.log(this.lebaneseData)

    if(this.lebaneseData != undefined){
      this.grades = this.lebaneseData.grades;
      this.domains = this.lebaneseData.domains;
      this.bloomsTaxonomy = this.lebaneseData.bloomsTaxonomy;
      let tempBlooms = this.bloomsTaxonomy.find((item) => item.Id == this.lebaneseData.bloomsTaxonomyId)
      console.log(this.bloomsTaxonomy)
      console.log(this.lebaneseData.bloomsTaxonomyId)
      console.log(tempBlooms)
      this.selectedBloomTaxonomy = tempBlooms.knowledge_category
      this.selectedDOK = tempBlooms.knowledge_dimension
      this.getBloomsTaxonomy();

      this.learningObjectives = this.lebaneseData.learningObjectives;

      this.domainLoMap =this.lebaneseData.domainLoMap;

      this.curriculumGrades = this.grades.filter((item) => {
        return item.curriculumName == this.curriculumName;
      });

      this.selectedGrade = this.grades.find(item => item.name == this.lebaneseData.gradeCode)
      this.selectedBloomTaxonomy = this.bloomsTaxonomy.find((item) => item.Id == this.lebaneseData.bloomsTaxonomyId)

      console.log(this.bloomsTaxonomy)
      console.log(this.lebaneseData)
      this.doks = this.bloomsTaxonomy.filter((item) => {
        return item.knowledge_category == this.selectedBloomTaxonomy.knowledge_category;
      });

      this.selectedDOK = this.selectedBloomTaxonomy
      console.log('++++++++++++++++++++++++++')
      console.log(this.selectedBloomTaxonomy);
      console.log(this.selectedDOK)

      console.log(this.lebaneseData)
      for(let i =0; i< this.lebaneseData.learningObjectiveIds.length; i++){


        const lo = this.domainLoMap[i].los.find((item)=> item.id == this.lebaneseData.learningObjectiveIds[i])
        const dom = this.domains.find((item)=> item.id == lo.domain_id)

        this.chosenLebanese.push({domain: dom, learningObjective: lo})

      }
    }
    else{

      this.addLearningObjective();
    if(this.dataSelected != undefined){
      this.questionBloomsTaxanomy = this.question.blooms_taxonomy[0];

      console.log(this.curriculumGrades)
      console.log(this.question)
      const tempGrade = this.curriculumGrades.find((item) => item.name == this.question.curriculum_questions.find((item1) => item1.curriculum_id == 2).gradeCode);
     console.log(tempGrade)
      if(tempGrade != undefined){
        this.selectedGrade = tempGrade
        console.log(this.selectedGrade)
        this.onSelectGrade(this.selectedGrade)
      }
    }



    //blooms taxonomy
    this.getBloomsTaxonomy();


    }
  }

  getCurriculumDomains(curriculumId, gradeCode) {
    console.log(curriculumId);
    this.questionManager
      .getCurriculumDomainsDittofi(curriculumId, gradeCode)
      .then((res: any) => {
        console.log(res);
        this.domains = res.data;

        // const dom = this.question.cq[0].qLOs[0].LO.domain;
        // this.selectedDomain = this.domains.find((item) => item.id == dom.id);
        console.log(this.selectedGrade)
        console.log(this.selectedSubject)
        console.log(this.selectedDomain)

        console.log(this.chosenLebanese)
        if(this.domains != null){

        if( this.chosenLebanese[0].domain == undefined && this.chosenLebanese[0].learningObjective == undefined){
          this.chosenLebanese = []
          let i =0;
          for(let lo of this.question.learning_standards){
            lo.displayName = lo.code + ' ' + lo.description;
            let domain = this.domains.find((item) => item.id == lo.domain_id)
            if(domain != undefined){
              this.getDomainLOs(2, this.selectedGrade.name, domain, i)
              i++
              this.chosenLebanese.push({domain: domain, learningObjective: lo})
            }

            console.log('maher maher')
            console.log(this.chosenLebanese)
            this.submitChanges()

          }


          if(this.chosenLebanese.length == 0){
            console.log('entered addLearningObjective')
            console.log(this.chosenLebanese)
            this.addLearningObjective()
          }
        }
      }
      })
      .catch((res) => {
        console.log(res);
      });
  }

  getDomainLOs(curriculumId, gradeCode, domain, index) {
    console.log(curriculumId);
    console.log(gradeCode)
    console.log(domain)
    this.questionManager
      .getLObyDomainDittofi(curriculumId, gradeCode, domain.id)
      .then((res: any) => {
        console.log(res)
        const lo = res.data;
        if(lo != null){
          for (let l of lo) {
            l.displayName = l.code + ' ' + l.description;
          }
          this.learningObjectives = lo;
          // this.domainLoMap.push({domain: this.domains, los: lo});

          this.domainLoMap[index] = {domain: domain, los: this.learningObjectives};
          console.log('test111')
          console.log(this.domainLoMap)


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

  addLearningObjective() {
    console.log('addLearningObjective')
    this.chosenLebanese.push({ domain: null, learningObjective: null });
    this.domainLoMap.push({domain: null, los: null})

  }

  removeRow(index) {
    this.chosenLebanese.splice(index, 1);
    this.domainLoMap.splice(index, 1);
    this.submitChanges()
  }

  onSelectGrade(event) {
    // this.chosenLebanese = [{ domain: null, learningObjective: null }];
    //curriculum domains
    this.getCurriculumDomains(2, event.name);
    console.log(event)
    this.selectedGrade = event;
  }
  onSelectDomain(event, index) {
    console.log(event);
    this.selectedDomain = event;
    console.log(this.selectedDomain)
    this.getDomainLOs(2, this.selectedGrade.name, this.selectedDomain, index)

    // this.submitChanges()
  }
  onChangeLO(){
    this.submitChanges()
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

  onSelectCL(event) {
    console.log(event);
    this.doks = this.bloomsTaxonomy.filter((item) => {

      return item.knowledge_category == event.knowledge_category;
    });
    console.log(this.doks)
    this.submitChanges()
  }
  onSelectDoks(){
    this.submitChanges()
  }

  submitChanges() {

    console.log('submit changes')
    console.log(this.chosenLebanese)
    if(this.selectedBloomTaxonomy != undefined && this.selectedGrade != undefined
      && this.selectedSubject != undefined && this.chosenLebanese.length > 0){
        console.log('entered entered')
        const loIds = [];
        console.log(this.chosenLebanese);
        for (let lebanese of this.chosenLebanese) {
          const index = loIds.findIndex(
            (item) => item == lebanese.learningObjective.id
          );
          console.log(index);
          if (index == -1) {
            loIds.push(lebanese.learningObjective.id);
          }
        }

        const domainIds = [];
        console.log(this.chosenLebanese);
        for (let lebanese of this.chosenLebanese) {
          const index = domainIds.findIndex(
            (item) => item == lebanese.domain.id
          );
          console.log(index);
          if (index == -1) {
            domainIds.push(lebanese.domain.id);
          }
        }


        console.log('test test test')
        console.log(this.selectedDOK)
        console.log(loIds)
        console.log(this.selectedGrade)
        const changes = {
          grade_id: this.selectedGrade.id,
          grades: this.grades,
          bloomsTaxonomy: this.bloomsTaxonomy,
          domains: this.domains,
          learningObjectives: this.learningObjectives,
          bloomsTaxonomyId: this.selectedDOK.Id,
          domainLoMap: this.domainLoMap,
          curriculumId: 2,
          gradeCode: this.selectedGrade.name,
          subjectCode: this.selectedSubject.code,
          learningObjectiveIds: loIds,
          domainIds: domainIds
        };
        console.log(changes)
        this.submitLebaneseData.emit(changes);
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
  onSelectkn(event){
    console.log(event)
    console.log(this.selectedDOK)
  }
}
