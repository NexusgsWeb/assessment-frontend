import { Component, Input, OnInit } from '@angular/core';
import { School } from 'src/app/modules/Models/school';
import { Organization } from 'src/app/modules/Models/organization';

@Component({
  selector: 'app-view-schools',
  templateUrl: './view-schools.component.html',
  styleUrls: ['./view-schools.component.css'],
})
export class ViewSchoolsComponent implements OnInit {
  @Input() SelectedOrganization;
  @Input() schoolId;
  constructor() {}

  ngOnInit(): void {
    console.log('schoolId: '+ this.schoolId)
    console.log('organization: '+ this.SelectedOrganization)

  }
  handleEditSchool(school_id) {
    console.log('editing id for school ' + school_id);
  }
  handleDeleteSchool(school_id) {
    console.log('deleting id for school ' + school_id);
  }
  didDeleteSchool(event){
   
    console.log("school deleted: "+ event)
    console.log(this.SelectedOrganization.organization.schools)
      const ElementToBeDeleted : School = this.SelectedOrganization.organization.schools.find(({id})=> id == event.id)
      this.SelectedOrganization.organization.schools.splice(this.SelectedOrganization.organization.schools.findIndex(a => a.id == ElementToBeDeleted.id),1)
      console.log('school with name ' + event.name + ' has been deleted.')
  }

  didAddSchool(event){
    console.log("function called: "+ event)
    this.SelectedOrganization.organization.school.push(event);
  }
}
