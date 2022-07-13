import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getDomainsByCurriculumURL } from 'src/app/shared/static_data/apiURL';
import { AuthManagerService } from './auth-manager.service';

@Injectable({
  providedIn: 'root',
})
export class DomainManagerService {
  constructor(
    private authService: AuthManagerService,
    private http: HttpClient
  ) {}


}
