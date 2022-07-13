import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthManagerService } from './auth-manager.service';
import { getUnits } from 'src/app/shared/static_data/apiURL';

@Injectable({
  providedIn: 'root',
})
export class SubjectsManagerService {
  constructor(
    private http: HttpClient,
    private authService: AuthManagerService
  ) {}




}
