import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { LoadingManagerService } from './loading-manager.service';

@Injectable({
  providedIn: 'root',
})
export class HttpinterceptorService implements HttpInterceptor {
  // small delay for each http request, expressed in milliseconds
  DELAY = 0;

  constructor(private LoadingService: LoadingManagerService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.LoadingService.isLoading.next(true);
    finalize;
    return next.handle(req).pipe(
      finalize(() => {
        setTimeout(() => {
          this.LoadingService.isLoading.next(false);
        }, this.DELAY);
      })
    );
  }
}
