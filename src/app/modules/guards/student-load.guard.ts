import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { StudentManagerService } from '../_services/student-manager.service';

@Injectable({
  providedIn: 'root',
})
export class StudentLoadGuard implements Resolve<any> {
  constructor(private studentService: StudentManagerService) {}
  async resolve(route: ActivatedRouteSnapshot) {
    return await this.studentService.getStudentByIDDittofi(
      route.params['SchoolID'],
      route.params['StudentID']
    );
  }
}
