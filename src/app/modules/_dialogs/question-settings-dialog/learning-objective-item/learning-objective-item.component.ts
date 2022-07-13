import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BloomstaxonomyManagerService } from 'src/app/modules/_services/bloomstaxonomy-manager.service';
import { LearningobjectiveManagerService } from 'src/app/modules/_services/learningobjective-manager.service';

@Component({
  selector: 'app-learning-objective-item',
  templateUrl: './learning-objective-item.component.html',
  styleUrls: ['./learning-objective-item.component.css'],
})
export class LearningObjectiveItemComponent {
  /* The original LO list - used for Deletion */
  @Input() LOReference: BehaviorSubject<any>;
  @Input() domainLOMap: BehaviorSubject<Map<string, string>>;

  /* The Specific LO Object */
  @Input() LearningObjectiveDetails;
  /* The API data - used for LO List and Domain List */
  @Input() LOsFullList: BehaviorSubject<any>;
  /* Domain List to Be Created After ViewInits */
  @Input() LearningObjectivesFinal: BehaviorSubject<any>;
  DomainList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  LearningObjectiveList: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  /* SelectedValues */
  SelectedLearningObjective;
  SelectedDomains;
  @Input() editedLearningObjectives: BehaviorSubject<any>;
  @Input() selectedD: string;
  @Input() selectedLO: string; 


  constructor() {}
  ngOnInit() {
    // console.log('hello hello')

    // console.log(this.editedLearningObjectives)
    // for(let lo of this.editedLearningObjectives.getValue()){
    //   this.SelectedLearningObjective
    //   this.SelectedDomains
    // }
    this.LOsFullList.subscribe((res: any) => {
      if (res.length === 0) {
      } else {
        console.log(res);
        var uniqueSetObjects = new Set();
        var tempDomains = new Set();
        res.forEach((LO) => {
          uniqueSetObjects.add(LO.domain.name);
          tempDomains.add(LO.domain)
        });
        uniqueSetObjects.forEach((element) => {
          var state = this.DomainList.getValue();
          state.push(element);
          this.DomainList.next(state);
        });

        tempDomains.forEach((element : any) => {
          console.log(this.selectedD);
          console.log(element)
          if(this.selectedD == element.id){
            this.SelectedDomains = element.name;
            this.domainDidChange();
          }
        });

   
      }
    });

  }
  generateDomainList = () => {
   
    var uniqueSetObjects = new Set();
    this.LOsFullList.forEach((LO) => {
      uniqueSetObjects.add(LO.domain.id);
    });
    console.log(uniqueSetObjects);
  };
  domainDidChange = () => {

    this.LearningObjectiveList.next([]);
    console.log(this.SelectedDomains);
    const LORefState = this.LOReference.getValue();
    console.log(this.LOsFullList)
    this.LOsFullList.getValue().forEach((element) => {
     
      // console.log(element)
      // console.log(this.SelectedDomains)
      // console.log(element.domain.name)
      // console.log(element.domain.name === this.SelectedDomains)
      // console.log('-----------------------')
      if (element.domain.name === this.SelectedDomains) {
      

        var state = this.LearningObjectiveList.getValue();

        if (LORefState.filter((e) => e === element.id)) {
          state.push(element);
          return;
        }
        this.LearningObjectiveList.next(state);
      }
    });

  
    for(let lo of this.LearningObjectiveList.getValue()){
     
      if(this.selectedLO == lo.id){
        this.SelectedLearningObjective = lo
      }
    }
  };
  LOdidChange() {
    //We will push the data to the external Final Array
    console.log(this.LearningObjectiveDetails);
    this.LearningObjectiveDetails.id = this.SelectedLearningObjective.id;
    console.log(this.LearningObjectiveDetails);
    console.log(this.LOReference);
    const tempMap = new Map<string, string>();
    for(let lo of this.LOReference.getValue()){
     const domain = this.LOsFullList.getValue().find(item => item.id == lo.id)
     if(domain != undefined){
      tempMap.set(lo.id, domain.domain.id)
     }
    }
    this.domainLOMap.next(tempMap)
    console.log(this.domainLOMap)


  }
  RequestDeleteQuestion() {
    try {
      var LORef = this.LOReference.getValue();
      if (LORef.length === 1) return;
      for (var i = 0; i <= LORef.length; i++) {
        if (this.SelectedLearningObjective)
          if (LORef[i].id === this.SelectedLearningObjective.id) {
            LORef.splice(i, 1);
          }
      }
      this.LOReference.next(LORef);
    } catch (err) {
      console.log('There was an error deleting');
    }
  }
}
