import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject } from 'rxjs';
import { BloomstaxonomyManagerService } from '../../_services/bloomstaxonomy-manager.service';
import { CreateQuestionServiceService } from '../../_services/create-question-service.service';
import { DomainManagerService } from '../../_services/domain-manager.service';
import { QuestionToBeCreatedMetaDataService } from './question-to-be-created-meta-data.service';
import { QuestionmanagerService } from '../../_services/questionmanager.service';
import { DialogServiceService } from '../shared/dialog-service.service';

@Component({
  selector: 'app-question-settings-dialog',
  templateUrl: './question-settings-dialog.component.html',
  styleUrls: ['./question-settings-dialog.component.css'],
})
export class QuestionSettingsDialogComponent implements OnInit {
  /*
          New Update
  */
  // The Object  of the full LO's Present On Screen
  LearningObjectives: BehaviorSubject<any> = new BehaviorSubject<any>([{}]);

  //The Object which holds the Response of the server of LO's
  // LearningObjectivesResults: BehaviorSubject<any> = new BehaviorSubject<any>(
  //   []
  // );
  // The Object  of the full LO's Present On Screen
  LearningObjectivesFinal: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  /*
          New Update - End
  */
  htmlContent = '';
  domains: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Answer Key Preview..',
    translate: 'no',
    sanitize: false,
    fonts: [
      { class: 'Raleway', name: 'Raleway' },
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Raleway',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
      {
        name: 'table',
        class: '<!--',
        tag: 'table class="table"><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table> <!-- ',
      },
    ],
  };
  
  cls = this.createQuestionSerivce.SelectedClass;
  subject = this.createQuestionSerivce.SelectedSubject;
  selectedMap: any[] = []
  SelectedLearningObjectives: any[] = []
  SelectedDomains: any[] = []
  BloomsTaxonomyArray = [];

  CategoryOfLearnings = [];
  DimensionOfKnowledges = [];

  SelectedCategoryOfLearning;
  SelectedDimensionOfKnowledge;
  MetaDataToBeCreated: any;
  editedLS: any[] = []
  

  editedLearningObjectives = new BehaviorSubject<any>(null)
  selectedQuestion;
  modified: boolean = false;
  domainLoMap = [];

  edit: boolean = false;
  constructor(
    private createQuestionSerivce: CreateQuestionServiceService,
    private bloomsTaxonomyManager: BloomstaxonomyManagerService,
    private domainManager: DomainManagerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QuestionSettingsDialogComponent>, 
    public questionManager: QuestionmanagerService,
    public dialogService: DialogServiceService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.intializePage();
  }
  async intializePage() {
    this.addLearningObjective()
    console.log(this.data)
    await this.getDomains();
    await this.getBloomsTaxonomy();
    if(this.selectedMap.length == 0){
      this.selectedMap.push({domain: undefined, lo: undefined})
    }

    this.edit = this.data.edit
    this.modified = this.data.modified
    if(this.edit != undefined && this.edit == true){
      this.modified = this.data.modified
      console.log(this.data)
      this.selectedQuestion = this.data.question;
      this.selectedQuestion.bloomsTaxonomy = this.selectedQuestion.blooms_taxonomy
      this.SelectedCategoryOfLearning = this.selectedQuestion.bloomsTaxonomy[0].knowledge_category
      this.SelectedDimensionOfKnowledge = this.selectedQuestion.bloomsTaxonomy[0].knowledge_dimension
      console.log(this.SelectedCategoryOfLearning)
      console.log(this.SelectedDimensionOfKnowledge)
      this.htmlContent = this.selectedQuestion.answer_key
      let tempDom = [];
      console.log(this.selectedQuestion)
      for(let dom of this.selectedQuestion.domain){
        console.log(tempDom)
        let temp = tempDom.find(item => item.id === dom.id);
        if(temp == undefined){
          tempDom.push(dom)
        }
      }
      this.selectedQuestion.domain = tempDom;

         let tempLO = [];
      for(let lo of this.selectedQuestion.learning_standards){
        lo.displayName = lo.code + ' ' + lo.description
        let temp = tempLO.find((item) => item.id == lo.id);
        if(temp == undefined){
          tempLO.push(lo)
        }
      }
      this.selectedQuestion.learning_standards = tempLO;

      // if(this.edit == true && this.modified == false){
      //   this.selectedMap = []
      //   for(let lo of this.selectedQuestion.learning_standards){
      //     lo.displayName = lo.code + ' ' + lo.description;
      //     let dom = this.selectedQuestion.domain.find((item) => item.id == lo.domain_id);
      //     this.selectedMap.push({domain: dom.name, lo: lo})
      //   }
      // }

      for(let i =0; i< this.selectedQuestion.learning_standards.length; i++){
        let dom = this.selectedQuestion.domain.find((item) => item.id == this.selectedQuestion.learning_standards[i].domain_id);
        this.getDomainLOs(dom, i)
      }
 
      console.log(this.selectedQuestion)
      

      
    // }
   

    }
    
   

    if(this.modified == true){
      console.log('all data')
      console.log(this.data)
      // this.LearningObjectives.next(this.data.lo)
      this.SelectedCategoryOfLearning = this.data.bloomsTaxonomy.knowledge_category
      this.SelectedDimensionOfKnowledge = this.data.bloomsTaxonomy.knowledge_dimension
      console.log(this.LearningObjectives.getValue())
      this.selectedMap = this.data.loMap
      this.htmlContent = this.data.answerKey
      this.domains = this.data.domains
      // this.LearningObjectivesResults.next(this.data.allLOs)
      this.CategoryOfLearnings = this.data.CategoryOfLearnings
      this.DimensionOfKnowledges = this.data.DimensionOfKnowledges
      this.BloomsTaxonomyArray = this.data.allBlooms 
      this.domainLoMap =this.data.domainLoMap;
      console.log('lomap')
      console.log(this.domainLoMap)



    }



  }


  getDomainLOs(domain, i) {

    this.questionManager
      .getLObyDomainDittofi(2, this.cls.code,domain.id)
      .then((res: any) => {
        const lo = res.data;
        if(lo != null){
          for (let l of lo) {
            l.displayName = l.code + ' ' + l.description;
          }
          console.log('lo lo')
          console.log(lo)
          console.log(i)
          console.log(this.domainLoMap)

          if(this.domainLoMap[i] == undefined){
            console.log('entered1')
            this.domainLoMap.push({domain: domain, los: lo});
          }
          else if(this.domainLoMap[i].domain == undefined){
            console.log('entered2')
            this.domainLoMap[i] = {domain: domain, los: lo}
          }
          else if(this.domainLoMap[i].los == undefined){
            console.log('entered3')
            this.domainLoMap[i].los = lo
          }
          else{
            console.log('entered4')
            this.domainLoMap.push({domain: domain, los: lo});
          }

          console.log(this.domainLoMap)
          console.log(this.selectedMap)
          
          // this.LearningObjectivesResults.next(lo)
          if(this.edit == true && this.modified == false){
            console.log('looooo')
            console.log(this.selectedQuestion.learning_standards)
            console.log(this.selectedQuestion.domain)
              // let temp = this.selectedQuestion.learning_standards.findIndex((item) => item.domain_id == domain.id);
              // if(temp != -1){
              //   let templo = lo.find((item) => item.Id == this.selectedQuestion.learning_standards[temp].id)
                this.selectedMap[i] = {domain: domain.name, lo: this.selectedQuestion.learning_standards[i]}
                // this.selectedQuestion.learning_standards.splice(temp, 1)
              // }
              this.selectedMap = this.selectedMap.filter((item) => item.domain != undefined || item.lo != undefined)
            console.log(this.selectedMap)
          }
        }
        else{
          if(this.domainLoMap[i].domain == undefined){
            this.domainLoMap[i] = {domain: domain, los: []}
          }
          else{
            this.domainLoMap.push({domain: domain, los: lo});
          }
        }


        // const tempLO = this.question.cq[0].qLOs[0].LO;
        // this.selectedLO = this.learningObjectives.find(
        //   (item) => (item.id = tempLO.id)
        // );

      
        console.log(res);
      })
      .catch((res) => {
        console.log(res);
      });
  }

  // async getLearningObjective() {
  //   this.createQuestionSerivce
  //     .showDomainsDittofi()
  //     .then((res: any) => {
  //       console.log(res);
  //       this.LearningObjectivesResults.next(res.learningObjective);
  //     })
  //     .catch((err) =>
  //       console.log(err)
  //     );
  // }

  async getDomains() {
    this.createQuestionSerivce
    .showDomainsDittofi()
    .then((res: any) => {
      console.log(res);
      for(let dom of res.data){
        dom.id = dom.Id
      }
      this.domains.next(res.data)

      // this.LearningObjectivesResults.next(res.learningObjective);
    })
    .catch((err) =>
      console.log(err)
    );
  }

  addLearningObjective() {
    console.log('entered entered')
    this.selectedMap.push({domain: undefined, lo: undefined})
    const newArr = this.LearningObjectives.getValue();
    newArr.push({});
    this.LearningObjectives.next(newArr);
    this.domainLoMap.push({domain: undefined, los: []})

  }
  getBloomsTaxonomy() {
    this.bloomsTaxonomyManager
      .getBloomsTaxonomyDittofi()
      .then((res: any) => {
        console.log(res)
        this.BloomsTaxonomyArray = res.data;
        this.divideArrayForCOL();
      })
      .catch((err) => console.log(err));
  }
  divideArrayForCOL() {
    const newArr = [];
    this.BloomsTaxonomyArray.forEach((e) => {
      if(e.knowledge_category != null){
        newArr.push(e.knowledge_category);

      }
    });
    let uniqueChars = [...new Set(newArr)];
    this.CategoryOfLearnings = uniqueChars;

    // console.log(this.CategoryOfLearnings)
    // console.log(uniqueChars)

    if(this.modified == false && this.edit == true){
      console.log(this.selectedQuestion)
      this.SelectedCategoryOfLearning = this.selectedQuestion.bloomsTaxonomy[0].knowledge_category
      // console.log(this.SelectedCategoryOfLearning)
      this.onChangeCategoryOfLearning()
    }

    
  }
  getDOKArrayForSpecificCOL(COLName) {
    const newArr = [];
    this.BloomsTaxonomyArray.forEach((element) => {
      if (element.knowledge_category === COLName) {
        newArr.push(element.knowledge_dimension);
      }
    });
    // console.log(newArr);
    this.DimensionOfKnowledges = newArr;
    if(this.modified == false && this.edit == true){
      this.SelectedDimensionOfKnowledge = this.selectedQuestion.bloomsTaxonomy[0].knowledge_dimension
    }

  }
  onChangeCategoryOfLearning() {
    this.SelectedDimensionOfKnowledge = undefined
    this.getDOKArrayForSpecificCOL(this.SelectedCategoryOfLearning);
  }
  didClickClose() {
    let foundItem = undefined;
    const Taxonomy = this.BloomsTaxonomyArray.forEach((element) => {

      console.log(this.BloomsTaxonomyArray)
      if (
        element.knowledge_category === this.SelectedCategoryOfLearning &&
        element.knowledge_dimension === this.SelectedDimensionOfKnowledge
      ) {
        foundItem = element;
      }
    });
    console.log(foundItem);
    console.log(Taxonomy)
    this.MetaDataToBeCreated = {
      Taxonomy: foundItem,
      LOs: this.LearningObjectives.getValue(),
      answerKey: this.htmlContent,
      modified: true,
      loMap: this.selectedMap,
      domains: this.domains,
      // allLOs: this.LearningObjectivesResults.getValue(),
      CategoryOfLearnings: this.CategoryOfLearnings,
      DimensionOfKnowledges: this.DimensionOfKnowledges,
      allBlooms: this.BloomsTaxonomyArray,
      domainLoMap: this.domainLoMap,


    };
    if(this.edit == true){
      this.selectedQuestion.bloomsTaxonomy = foundItem;
      this.selectedQuestion.answerKey = this.htmlContent
    }

    let tempLOs = []
    for(let lo of this.selectedMap){
      console.log(lo)
      let temp = tempLOs.find((item) => item.lo == lo.lo);
      if(temp == undefined){
        tempLOs.push(lo)
      }
      else{
        this.dialogService.openDialog({
          title: 'You cannot select the same learning objective more than once.',
          message: 'test',
          confirmText: 'Ok',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
        return;
      }
    }
    console.log(this.MetaDataToBeCreated);
    console.log(this.selectedMap)
    if(this.MetaDataToBeCreated.Taxonomy == undefined || this.MetaDataToBeCreated.DimensionOfKnowledges.length ==0 || 
      this.MetaDataToBeCreated.answerKey == '' || this.MetaDataToBeCreated.answerKey == undefined ||
      this.selectedMap == undefined || this.selectedMap.length == 0 ||
      (this.selectedMap.length == 1 &&
        (this.selectedMap[0].domain == undefined || this.selectedMap[0].lo == undefined))){
        this.dialogService.openDialog({
          title: 'Please fill all the required fields',
          message: 'test',
          confirmText: 'Ok',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      }
      else{
        this.dialogRef.close(this.MetaDataToBeCreated);
      }
  }

  RequestDeleteQuestion(index){
    this.selectedMap.splice(index, 1);
    this.domainLoMap.splice(index, 1);

  }

  didSelectDomain(index, i){
    console.log("preview domains")
    console.log(i)
    console.log(index)
    console.log(this.domains.getValue())
    let domTemp = this.domains.getValue().find((item) => item.name == index)
    console.log(i)
    console.log(this.selectedMap)
    this.domainLoMap[i].los = undefined

    // if(this.selectedMap[i] != undefined){
    //   console.log(this.selectedMap[i].lo)
    //   this.selectedMap[i].lo = undefined
    //   console.log(this.selectedMap[i].lo)

    // }

    this.getDomainLOs(domTemp, i);

  }
  didClickClose1(){
    this.dialogRef.close(this.MetaDataToBeCreated);
  }
  deleteDOK(){
    this.SelectedDimensionOfKnowledge = undefined;
  }
  onChangeLO(event){
    console.log(event)
    for(let temp of this.selectedMap){
      console.log(temp.domain)
      console.log(temp.lo)
    }
  }
}
