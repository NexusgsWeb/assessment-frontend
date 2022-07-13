import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-review-questions',
  templateUrl: './review-questions.component.html',
  styleUrls: ['./review-questions.component.css'],
})
export class ReviewQuestionsComponent implements OnInit {
  @Output() QuestionDoneEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {}
  destroyQuestion() {
    this.host.nativeElement.remove();
  }
}
