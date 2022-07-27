/**
 * in most of this service's functions,
 * when using the API these arguments should be removed since the api will return the required data
 * in fact the whole file shoul;d be updated to match the api calls and response
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book, Chapter, Lesson } from '@models/lesson-plan';
import { StorageService } from '@services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class LessonPlanService {
  lessonPlan: any = {}
  lessonPlanData: any = []
  private _myLessonPlans$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  private _lessonPlanPerPeriod$: BehaviorSubject<any> = new BehaviorSubject<any>({})
  private _lessonPlan$: BehaviorSubject<any> = new BehaviorSubject<any>({})
  private _subtitleBeingEditedId$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  private _subtitleBeingDeletedId$: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  private _books$: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([])
  private _chapters$: BehaviorSubject<Chapter[]> = new BehaviorSubject<Chapter[]>([])
  private _lessons$: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([])
  private _resetForms$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private _newSubtitle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  private _validPreview$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public get myLessonPlans$(): Observable<any> {
    return this._myLessonPlans$
  }

  public get lessonPlan$(): Observable<any> {
    return this._lessonPlan$
  }

  public get lessonPlanPerPeriod$(): Observable<any> {
    return this._lessonPlanPerPeriod$
  }

  public get subtitleBeingEditedId$(): Observable<number> {
    return this._subtitleBeingEditedId$
  }

  public get subtitleBeingDeletedId$(): Observable<number> {
    return this._subtitleBeingDeletedId$
  }

  public get books$(): Observable<Book[]> {
    return this._books$
  }

  public get chapters$(): Observable<Book[]> {
    return this._chapters$
  }

  public get lessons$(): Observable<Lesson[]> {
    return this._lessons$
  }

  public get newSubtitle$(): Observable<boolean> {
    return this._newSubtitle$
  }

  public get resetForms$(): Observable<boolean> {
    return this._resetForms$
  }

  public get validPreview$(): Observable<boolean> {
    return this._validPreview$
  }

  constructor(private _http: HttpClient, private _storageService: StorageService) {
    this._http.get<Book[]>(environment.lessonPlanBackEnd).subscribe((lessonPlanData: any) => {
      this.lessonPlanData = lessonPlanData
      this._books$.next(this.lessonPlanData.books)
    })


    /**
     * uncomment this to see an example of the lesson plans list
     */
    this._myLessonPlans$.next([
      {
        "data": [
          {
            "title": "Period 1",
            "duration": "50",
            "subtitles": [
              {
                "id": 1658558514948,
                "title": "subtitle one",
                "duration": "50",
                "startPage": "1",
                "endPage": "10",
                "description": "description one",
                "instructional_strategy": "strategy one",
                "learningStandards": [
                  {
                    "id": 1,
                    "unitId": 1,
                    "code": "1.1",
                    "description": "الدرس الاول",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558514958,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource one",
                    "type": "Content Activity"
                  }
                ],
                "isProcessed": true,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 1,
                  "title": "Grade One"
                },
                "subject": {
                  "id": 1,
                  "title": "Math"
                }
              }
            ]
          },
          {
            "title": "Period 2",
            "duration": "50",
            "subtitles": [
              {
                "id": 1658558534178,
                "title": "subtitle two",
                "duration": 50,
                "startPage": "11",
                "endPage": "25",
                "description": "description two",
                "instructional_strategy": "strategy two",
                "learningStandards": [
                  {
                    "id": 1,
                    "unitId": 1,
                    "code": "1.1",
                    "description": "الدرس الاول",
                    "relatedto": []
                  },
                  {
                    "id": 3,
                    "unitId": 1,
                    "code": "1.3",
                    "description": "الدرس الثالث",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558534156,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource two",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 1,
                  "title": "Grade One"
                },
                "subject": {
                  "id": 1,
                  "title": "Math"
                }
              }
            ]
          },
          {
            "title": "Period 3",
            "duration": "50",
            "subtitles": [
              {
                "id": 1658558534178,
                "title": "subtitle two",
                "duration": 50,
                "startPage": "11",
                "endPage": "25",
                "description": "description two",
                "instructional_strategy": "strategy two",
                "learningStandards": [
                  {
                    "id": 1,
                    "unitId": 1,
                    "code": "1.1",
                    "description": "الدرس الاول",
                    "relatedto": []
                  },
                  {
                    "id": 3,
                    "unitId": 1,
                    "code": "1.3",
                    "description": "الدرس الثالث",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558534156,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource two",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 1,
                  "title": "Grade One"
                },
                "subject": {
                  "id": 1,
                  "title": "Math"
                }
              }
            ]
          },
          {
            "title": "Period 4",
            "duration": "50",
            "subtitles": [
              {
                "id": 1658558534178,
                "title": "subtitle two",
                "duration": 20,
                "startPage": "11",
                "endPage": "25",
                "description": "description two",
                "instructional_strategy": "strategy two",
                "learningStandards": [
                  {
                    "id": 1,
                    "unitId": 1,
                    "code": "1.1",
                    "description": "الدرس الاول",
                    "relatedto": []
                  },
                  {
                    "id": 3,
                    "unitId": 1,
                    "code": "1.3",
                    "description": "الدرس الثالث",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558534156,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource two",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 1,
                  "title": "Grade One"
                },
                "subject": {
                  "id": 1,
                  "title": "Math"
                }
              }
            ]
          }
        ],
        "id": 1658558587018,
        "info": {
          "id": 1658558511631,
          "reference": "lesson plan one",
          "isPublished": false,
          "status": {
            "id": 1,
            "title": "Pending"
          },
          "class": {
            "id": 1,
            "title": "Grade One"
          },
          "section": [
            {
              "id": 1,
              "classId": 1,
              "title": "A"
            },
            {
              "id": 2,
              "classId": 1,
              "title": "B"
            }
          ],
          "subject": {
            "id": 1,
            "title": "Math"
          },
          "duration": "5 days",
          "startDate": "2022-08-25",
          "endDate": "2022-09-30",
          "book": {
            "id": 1,
            "title": "book 1",
            "publisher": "publisher 1",
            "author": "author 1",
            "edition": "edition 1"
          },
          "chapter": {
            "id": 1,
            "bookId": 1,
            "title": "chapter 1",
            "number": 1111,
            "startPage": 1,
            "endPage": 10,
            "briefIntroduction": "intro"
          },
          "lesson": {
            "id": 1,
            "chapterId": 1,
            "title": "lesson 1",
            "number": 1111,
            "startPage": 1,
            "endPage": 10,
            "briefIntroduction": "intro"
          },
          "domains": [
            {
              "id": 1,
              "code": "1",
              "title": "الارقام",
              "learningStandards": [
                {
                  "id": 1,
                  "unitId": 1,
                  "code": "1.1",
                  "description": "الدرس الاول",
                  "relatedto": []
                },
                {
                  "id": 2,
                  "unitId": 1,
                  "code": "1.2",
                  "description": "الدرس الثاني",
                  "relatedto": []
                },
                {
                  "id": 3,
                  "unitId": 1,
                  "code": "1.3",
                  "description": "الدرس الثالث",
                  "relatedto": []
                }
              ]
            }
          ],
          "learningStandards": [
            {
              "id": 2,
              "unitId": 1,
              "code": "1.2",
              "description": "الدرس الثاني",
              "relatedto": []
            }
          ],
          "prereqDomains": [
            {
              "id": 2,
              "code": "2",
              "title": "عوامل الرياضيات",
              "learningStandards": [
                {
                  "id": 4,
                  "unitId": 2,
                  "code": "1.1",
                  "description": "الدرس الاول",
                  "relatedto": []
                },
                {
                  "id": 5,
                  "unitId": 2,
                  "code": "1.2",
                  "description": "الدرس الثاني",
                  "relatedto": []
                },
                {
                  "id": 6,
                  "unitId": 2,
                  "code": "1.3",
                  "description": "الدرس الثالث",
                  "relatedto": []
                }
              ]
            }
          ],
          "prereqLs": [
            {
              "id": 2,
              "unitId": 1,
              "code": "1.2",
              "description": "الدرس الثاني",
              "relatedto": []
            }
          ]
        }
      },
      {
        "data": [
          {
            "title": "Period 1",
            "duration": "30",
            "subtitles": [
              {
                "id": 1658558641052,
                "title": "subtitle three",
                "duration": 30,
                "startPage": "12",
                "endPage": "18",
                "description": "description 3",
                "instructional_strategy": "strategy 3",
                "learningStandards": [
                  {
                    "id": 13,
                    "unitId": 5,
                    "code": "1.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  },
                  {
                    "id": 14,
                    "unitId": 5,
                    "code": "1.2",
                    "description": "Lesson 32",
                    "relatedto": []
                  },
                  {
                    "id": 15,
                    "unitId": 5,
                    "code": "1.3",
                    "description": "Lesson 33",
                    "relatedto": []
                  },
                  {
                    "id": 16,
                    "unitId": 6,
                    "code": "2.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  },
                  {
                    "id": 17,
                    "unitId": 6,
                    "code": "2.2",
                    "description": "Lesson 32",
                    "relatedto": []
                  },
                  {
                    "id": 18,
                    "unitId": 6,
                    "code": "2.3",
                    "description": "Lesson 33",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558641054,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 3",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-26",
                "class": {
                  "id": 3,
                  "title": "Grade Three"
                },
                "subject": {
                  "id": 2,
                  "title": "English"
                }
              }
            ]
          },
          {
            "title": "Period 2",
            "duration": "30",
            "subtitles": [
              {
                "id": 1658558641052,
                "title": "subtitle three",
                "duration": 15,
                "startPage": "12",
                "endPage": "18",
                "description": "description 3",
                "instructional_strategy": "strategy 3",
                "learningStandards": [
                  {
                    "id": 13,
                    "unitId": 5,
                    "code": "1.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  },
                  {
                    "id": 14,
                    "unitId": 5,
                    "code": "1.2",
                    "description": "Lesson 32",
                    "relatedto": []
                  },
                  {
                    "id": 15,
                    "unitId": 5,
                    "code": "1.3",
                    "description": "Lesson 33",
                    "relatedto": []
                  },
                  {
                    "id": 16,
                    "unitId": 6,
                    "code": "2.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  },
                  {
                    "id": 17,
                    "unitId": 6,
                    "code": "2.2",
                    "description": "Lesson 32",
                    "relatedto": []
                  },
                  {
                    "id": 18,
                    "unitId": 6,
                    "code": "2.3",
                    "description": "Lesson 33",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558641054,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 3",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-26",
                "class": {
                  "id": 3,
                  "title": "Grade Three"
                },
                "subject": {
                  "id": 2,
                  "title": "English"
                }
              },
              {
                "id": 1658558675635,
                "title": "subtitle four",
                "duration": 15,
                "startPage": "35",
                "endPage": "45",
                "description": "description 4",
                "instructional_strategy": "strategy 4",
                "learningStandards": [
                  {
                    "id": 16,
                    "unitId": 6,
                    "code": "2.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558675617,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 4",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-26",
                "class": {
                  "id": 3,
                  "title": "Grade Three"
                },
                "subject": {
                  "id": 2,
                  "title": "English"
                }
              }
            ]
          },
          {
            "title": "Period 3",
            "duration": "30",
            "subtitles": [
              {
                "id": 1658558675635,
                "title": "subtitle four",
                "duration": 30,
                "startPage": "35",
                "endPage": "45",
                "description": "description 4",
                "instructional_strategy": "strategy 4",
                "learningStandards": [
                  {
                    "id": 16,
                    "unitId": 6,
                    "code": "2.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558675617,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 4",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-26",
                "class": {
                  "id": 3,
                  "title": "Grade Three"
                },
                "subject": {
                  "id": 2,
                  "title": "English"
                }
              }
            ]
          },
          {
            "title": "Period 4",
            "duration": "30",
            "subtitles": [
              {
                "id": 1658558675635,
                "title": "subtitle four",
                "duration": 30,
                "startPage": "35",
                "endPage": "45",
                "description": "description 4",
                "instructional_strategy": "strategy 4",
                "learningStandards": [
                  {
                    "id": 16,
                    "unitId": 6,
                    "code": "2.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558675617,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 4",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-26",
                "class": {
                  "id": 3,
                  "title": "Grade Three"
                },
                "subject": {
                  "id": 2,
                  "title": "English"
                }
              }
            ]
          },
          {
            "title": "Period 5",
            "duration": "30",
            "subtitles": [
              {
                "id": 1658558675635,
                "title": "subtitle four",
                "duration": 25,
                "startPage": "35",
                "endPage": "45",
                "description": "description 4",
                "instructional_strategy": "strategy 4",
                "learningStandards": [
                  {
                    "id": 16,
                    "unitId": 6,
                    "code": "2.1",
                    "description": "Lesson 31",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558675617,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 4",
                    "type": "Social / Engagement Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-26",
                "class": {
                  "id": 3,
                  "title": "Grade Three"
                },
                "subject": {
                  "id": 2,
                  "title": "English"
                }
              }
            ]
          }
        ],
        "id": 1658558724007,
        "info": {
          "id": 1658558636383,
          "reference": "lesson plan two",
          "isPublished": false,
          "status": {
            "id": 1,
            "title": "Pending"
          },
          "class": {
            "id": 3,
            "title": "Grade Three"
          },
          "section": [
            {
              "id": 6,
              "classId": 3,
              "title": "B"
            }
          ],
          "subject": {
            "id": 2,
            "title": "English"
          },
          "duration": "2 days",
          "startDate": "2022-07-26",
          "endDate": "2022-07-28",
          "book": {
            "id": 2,
            "title": "book 2",
            "publisher": "publisher 2",
            "author": "author 2",
            "edition": "edition 2"
          },
          "chapter": {
            "id": 4,
            "bookId": 2,
            "title": "chapter 12",
            "number": 2222,
            "startPage": 1,
            "endPage": 10,
            "briefIntroduction": "intro"
          },
          "lesson": {
            "id": 8,
            "chapterId": 4,
            "title": "lesson 44",
            "number": 2222,
            "startPage": 1,
            "endPage": 10,
            "briefIntroduction": "intro"
          },
          "domains": [
            {
              "id": 5,
              "code": "3",
              "title": "Grammar",
              "learningStandards": [
                {
                  "id": 13,
                  "unitId": 5,
                  "code": "1.1",
                  "description": "Lesson 31",
                  "relatedto": []
                },
                {
                  "id": 14,
                  "unitId": 5,
                  "code": "1.2",
                  "description": "Lesson 32",
                  "relatedto": []
                },
                {
                  "id": 15,
                  "unitId": 5,
                  "code": "1.3",
                  "description": "Lesson 33",
                  "relatedto": []
                }
              ]
            }
          ],
          "learningStandards": [
            {
              "id": 15,
              "unitId": 5,
              "code": "1.3",
              "description": "Lesson 33",
              "relatedto": []
            }
          ],
          "prereqDomains": [
            {
              "id": 6,
              "code": "4",
              "title": "Vocabulary",
              "learningStandards": [
                {
                  "id": 16,
                  "unitId": 6,
                  "code": "2.1",
                  "description": "Lesson 31",
                  "relatedto": []
                },
                {
                  "id": 17,
                  "unitId": 6,
                  "code": "2.2",
                  "description": "Lesson 32",
                  "relatedto": []
                },
                {
                  "id": 18,
                  "unitId": 6,
                  "code": "2.3",
                  "description": "Lesson 33",
                  "relatedto": []
                }
              ]
            }
          ],
          "prereqLs": [
            {
              "id": 14,
              "unitId": 5,
              "code": "1.2",
              "description": "Lesson 32",
              "relatedto": []
            }
          ]
        }
      },
      {
        "data": [
          {
            "title": "Period 1",
            "duration": "20",
            "subtitles": [
              {
                "id": 1658558773638,
                "title": "subtitle 5",
                "duration": 20,
                "startPage": "5",
                "endPage": "8",
                "description": "description 5",
                "instructional_strategy": "strategy 5",
                "learningStandards": [
                  {
                    "id": 23,
                    "unitId": 8,
                    "code": "2.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558773638,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 5",
                    "type": "Assessment Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 4,
                  "title": "Grade Four"
                },
                "subject": {
                  "id": 5,
                  "title": "Physics"
                }
              }
            ]
          },
          {
            "title": "Period 2",
            "duration": "20",
            "subtitles": [
              {
                "id": 1658558773638,
                "title": "subtitle 5",
                "duration": 20,
                "startPage": "5",
                "endPage": "8",
                "description": "description 5",
                "instructional_strategy": "strategy 5",
                "learningStandards": [
                  {
                    "id": 23,
                    "unitId": 8,
                    "code": "2.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558773638,
                    "file": "C:\\fakepath\\demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                    "fileData": {
                      "name": "demande_de_rendez-vous-ali-ghaith-05-07-2021-09-03.pdf",
                      "size": 267922,
                      "type": "application/pdf"
                    },
                    "title": "resource 5",
                    "type": "Assessment Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 4,
                  "title": "Grade Four"
                },
                "subject": {
                  "id": 5,
                  "title": "Physics"
                }
              }
            ]
          },
          {
            "title": "Period 3",
            "duration": "20",
            "subtitles": [
              {
                "id": 1658558801215,
                "title": "subtitle six",
                "duration": 20,
                "startPage": "9",
                "endPage": "18",
                "description": "description 6",
                "instructional_strategy": "strategy 6",
                "learningStandards": [
                  {
                    "id": 20,
                    "unitId": 7,
                    "code": "1.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  },
                  {
                    "id": 23,
                    "unitId": 8,
                    "code": "2.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558801179,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource 6",
                    "type": "Assessment Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 4,
                  "title": "Grade Four"
                },
                "subject": {
                  "id": 5,
                  "title": "Physics"
                }
              }
            ]
          },
          {
            "title": "Period 4",
            "duration": "20",
            "subtitles": [
              {
                "id": 1658558801215,
                "title": "subtitle six",
                "duration": 20,
                "startPage": "9",
                "endPage": "18",
                "description": "description 6",
                "instructional_strategy": "strategy 6",
                "learningStandards": [
                  {
                    "id": 20,
                    "unitId": 7,
                    "code": "1.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  },
                  {
                    "id": 23,
                    "unitId": 8,
                    "code": "2.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558801179,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource 6",
                    "type": "Assessment Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 4,
                  "title": "Grade Four"
                },
                "subject": {
                  "id": 5,
                  "title": "Physics"
                }
              }
            ]
          },
          {
            "title": "Period 5",
            "duration": "20",
            "subtitles": [
              {
                "id": 1658558801215,
                "title": "subtitle six",
                "duration": 20,
                "startPage": "9",
                "endPage": "18",
                "description": "description 6",
                "instructional_strategy": "strategy 6",
                "learningStandards": [
                  {
                    "id": 20,
                    "unitId": 7,
                    "code": "1.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  },
                  {
                    "id": 23,
                    "unitId": 8,
                    "code": "2.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558801179,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource 6",
                    "type": "Assessment Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 4,
                  "title": "Grade Four"
                },
                "subject": {
                  "id": 5,
                  "title": "Physics"
                }
              }
            ]
          },
          {
            "title": "Period 6",
            "duration": "20",
            "subtitles": [
              {
                "id": 1658558801215,
                "title": "subtitle six",
                "duration": 5,
                "startPage": "9",
                "endPage": "18",
                "description": "description 6",
                "instructional_strategy": "strategy 6",
                "learningStandards": [
                  {
                    "id": 20,
                    "unitId": 7,
                    "code": "1.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  },
                  {
                    "id": 23,
                    "unitId": 8,
                    "code": "2.2",
                    "description": "الدرس ٤٢",
                    "relatedto": []
                  }
                ],
                "resources": [
                  {
                    "id": 1658558801179,
                    "file": "C:\\fakepath\\VPF CST 1.pdf",
                    "fileData": {
                      "name": "VPF CST 1.pdf",
                      "size": 1748906,
                      "type": "application/pdf"
                    },
                    "title": "resource 6",
                    "type": "Assessment Activity"
                  }
                ],
                "isProcessed": false,
                "status": {
                  "id": 1,
                  "status": "Pending"
                },
                "startDate": "2022-07-25",
                "class": {
                  "id": 4,
                  "title": "Grade Four"
                },
                "subject": {
                  "id": 5,
                  "title": "Physics"
                }
              }
            ]
          }
        ],
        "id": 1658558852534,
        "info": {
          "id": 1658558769973,
          "reference": "lesson Plan Three",
          "isPublished": false,
          "status": {
            "id": 1,
            "title": "Pending"
          },
          "class": {
            "id": 4,
            "title": "Grade Four"
          },
          "section": [
            {
              "id": 8,
              "classId": 5,
              "title": "A"
            }
          ],
          "subject": {
            "id": 5,
            "title": "Physics"
          },
          "duration": "3 days",
          "startDate": "2022-07-25",
          "endDate": "2022-07-28",
          "book": {
            "id": 2,
            "title": "book 2",
            "publisher": "publisher 2",
            "author": "author 2",
            "edition": "edition 2"
          },
          "chapter": {
            "id": 3,
            "bookId": 2,
            "title": "chapter 11",
            "number": 1111,
            "startPage": 1,
            "endPage": 10,
            "briefIntroduction": "intro"
          },
          "lesson": {
            "id": 6,
            "chapterId": 3,
            "title": "lesson 22",
            "number": 2222,
            "startPage": 1,
            "endPage": 10,
            "briefIntroduction": "intro"
          },
          "domains": [
            {
              "id": 8,
              "code": "6",
              "title": "الضوء",
              "learningStandards": [
                {
                  "id": 22,
                  "unitId": 8,
                  "code": "2.1",
                  "description": "الدرس ٤١",
                  "relatedto": []
                },
                {
                  "id": 23,
                  "unitId": 8,
                  "code": "2.2",
                  "description": "الدرس ٤٢",
                  "relatedto": []
                },
                {
                  "id": 24,
                  "unitId": 8,
                  "code": "2.3",
                  "description": "الدرس ٤٣",
                  "relatedto": []
                }
              ]
            }
          ],
          "learningStandards": [
            {
              "id": 20,
              "unitId": 7,
              "code": "1.2",
              "description": "الدرس ٤٢",
              "relatedto": []
            }
          ],
          "prereqDomains": [
            {
              "id": 8,
              "code": "6",
              "title": "الضوء",
              "learningStandards": [
                {
                  "id": 22,
                  "unitId": 8,
                  "code": "2.1",
                  "description": "الدرس ٤١",
                  "relatedto": []
                },
                {
                  "id": 23,
                  "unitId": 8,
                  "code": "2.2",
                  "description": "الدرس ٤٢",
                  "relatedto": []
                },
                {
                  "id": 24,
                  "unitId": 8,
                  "code": "2.3",
                  "description": "الدرس ٤٣",
                  "relatedto": []
                }
              ]
            }
          ],
          "prereqLs": [
            {
              "id": 20,
              "unitId": 7,
              "code": "1.2",
              "description": "الدرس ٤٢",
              "relatedto": []
            }
          ]
        }
      }
    ])
  }

  getBookChapters(bookId?: number): void {
    if (bookId) {
      const chapters: Chapter[] = this.lessonPlanData.chapters.filter((chapter: Chapter) => chapter.bookId == bookId)
      this._chapters$.next(chapters)
    }
    else {
      this._chapters$.next([])
    }
  }

  getChapterLessons(chapterId?: number): void {
    if (chapterId) {
      const lessons: Lesson[] = this.lessonPlanData.lessons.filter((lesson: Lesson) => lesson.chapterId == chapterId)
      this._lessons$.next(lessons)
    }
    else {
      this._lessons$.next([])
    }
  }

  addBook(book: Book) {
    this.lessonPlanData.books.push(book)
    this._books$.next(this.lessonPlanData.books)
  }

  addChapter(newChapter: Chapter) {
    this.lessonPlanData.chapters.push(newChapter)
    this._chapters$.next(this.lessonPlanData.chapters.filter((chapter: Chapter) => chapter.bookId == newChapter.bookId))
  }

  addLesson(newLesson: Lesson) {
    this.lessonPlanData.lessons.push(newLesson)
    this._lessons$.next(this.lessonPlanData.lessons.filter((lesson: Lesson) => lesson.chapterId == newLesson.chapterId))
  }

  addNewSubtitle() {
    this._newSubtitle$.next(true)
  }

  resetForms() {
    this._resetForms$.next(true)
  }

  resetLessonPlan() {
    this.lessonPlan = {}
    this._lessonPlan$.next(this.lessonPlan)
  }

  validateLessonPreview() {
    this._validPreview$.next(true)
  }

  unValidateLessonPreview() {
    this._validPreview$.next(false)
  }

  getIdSubToEdit(id: number) {
    this._subtitleBeingEditedId$.next(id)
  }

  deleteSubTitle(id: number) {
    let lessonPlan: any = {}
    lessonPlan = this._lessonPlan$.value
    lessonPlan.formThree.subtitles = lessonPlan.formThree.subtitles.filter((subtitle: any) => subtitle.id !== id)
    this._lessonPlan$.next(lessonPlan)
    this._subtitleBeingDeletedId$.next(id)
  }

  buildLessonPlan(form: FormGroup, step: number = 0) {
    if (Object.keys(this.lessonPlan).length === 0) {
      this.lessonPlan.id = Date.now() + Math.floor(Math.random() * 100)
      this.lessonPlan.status = { id: 1, title: 'Pending' }
      this.lessonPlan.isPublished = false
    }
    switch (step) {
      case 0:
        this.lessonPlan.formOne = form.value
        break;
      case 1:
        this.lessonPlan.formTwo = form.value
        break;
      case 2:
        this.lessonPlan.formThree = form.value
        break;
    }
    this._lessonPlan$.next(this.lessonPlan)
  }

  addLessonPlanPerPeriod(settings: any, summary: any) {
    let periods: any = this.associateSubTitlesPeriods(this.generatePeriods(settings, summary), summary.formThree.subtitles)
    this._lessonPlanPerPeriod$.next(periods)
  }

  private generatePeriods(settings: any, summary: any) {
    let periods: any = { data: [] }
    periods.id = Date.now() + Math.floor(Math.random() * 100)
    periods.info = {}
    Object.assign(periods.info, { ...summary }.formOne)
    Object.assign(periods.info, { ...summary }.formTwo)
    periods.info.id = summary.id
    periods.info.isPublished = false
    periods.info.status = { id: 1, title: 'Pending' }

    for (let i = 1; i <= settings.number; i++) {
      periods.data.push({ title: `Period ${i}`, duration: settings.duration, subtitles: [] })
    }

    let myLessonPlans: any[] = this._myLessonPlans$.value
    if (myLessonPlans.length > 0) {
      const isLPExist: boolean = myLessonPlans.some((elem: any) => {
        return elem.info.id === summary.id
      }
      )
      if (!isLPExist) {
        myLessonPlans.push(periods)
        this._myLessonPlans$.next(myLessonPlans)
        console.log('add to exhisting', this._myLessonPlans$.value)
      }
      else {
        myLessonPlans = myLessonPlans.filter((elem: any) => elem.info.id !== summary.id)
        myLessonPlans.push(periods)
        this._myLessonPlans$.next(myLessonPlans)
        console.log('update in existing', this._myLessonPlans$.value)
      }
    } else {
      myLessonPlans = []
      myLessonPlans.push(periods)
      this._myLessonPlans$.next(myLessonPlans)
      console.log('new to empty', this._myLessonPlans$.value)
    }
    return periods
  }

  private associateSubTitlesPeriods(periods: any, subtitles: any) {
    subtitles = subtitles.map((subtitle: any) => { subtitle.isProcessed = false; return subtitle })
    let
      durationAdded = 0,
      leftForNextPeriod = 0,
      isholding,
      tmpSubtitle: any = {},
      tmpTmpSubtitle: any = {}

    periods.data.map((period: any) => {
      isholding = 0
      if (tmpSubtitle) {
        if (Number(tmpSubtitle.duration) > Number(period.duration) || (Number(tmpSubtitle.duration + isholding)) > Number(period.duration)) {
          durationAdded = (Number(period.duration) - isholding)
          leftForNextPeriod = (Number(tmpSubtitle.duration) - Number(durationAdded))

          tmpTmpSubtitle = { ...tmpSubtitle }
          tmpTmpSubtitle.duration = durationAdded
          tmpTmpSubtitle.status = { id: 1, title: 'Pending' }
          period.subtitles.push(tmpTmpSubtitle)

          tmpTmpSubtitle = { ...tmpSubtitle }
          tmpTmpSubtitle.duration = leftForNextPeriod
          tmpSubtitle = tmpTmpSubtitle
          tmpSubtitle.isProcessed = true
        }
        else if ((isholding + Number(tmpSubtitle.duration)) <= Number(period.duration)) {
          isholding += tmpSubtitle.duration
          tmpSubtitle.status = { id: 1, title: 'Pending' }
          period.subtitles.push(tmpSubtitle)
          tmpSubtitle.isProcessed = true
          tmpSubtitle = {}
        }
      }
      if (Object.keys(tmpSubtitle).length === 0) {
        for (let subtitle of subtitles) {
          if (!subtitle.isProcessed && isholding < Number(period.duration)) {
            if (Number(subtitle.duration) > Number(period.duration) || (Number(subtitle.duration) + isholding) > Number(period.duration)) {
              durationAdded = (Number(period.duration) - isholding)
              leftForNextPeriod = (Number(subtitle.duration) - Number(durationAdded))

              tmpSubtitle = { ...subtitle }
              tmpSubtitle.duration = durationAdded
              tmpSubtitle.status = { id: 1, title: 'Pending' }
              period.subtitles.push(tmpSubtitle)

              tmpSubtitle = { ...subtitle }
              tmpSubtitle.duration = leftForNextPeriod

              subtitle.isProcessed = true
              break
            } else if ((Number(subtitle.duration) + isholding) <= Number(period.duration)) {
              isholding += subtitle.duration
              subtitle.status = { id: 1, title: 'Pending' }
              period.subtitles.push(subtitle)
              subtitle.isProcessed = true
              tmpSubtitle = {}
            }
          }
        }
      }
      return period
    })
    return periods
  }

  removeLessonPlan(id: number){
    let myLessonPlans: any[] = this._myLessonPlans$.value
    myLessonPlans = myLessonPlans.filter((lessonPlan: any) => lessonPlan.id !== id)
    this._myLessonPlans$.next(myLessonPlans)
  }

  publishLessonPlan(id: number){
    let LessonPlanPublishStatusForConsoleLogOnly: boolean = false
    let myLessonPlans: any[] = this._myLessonPlans$.value
    myLessonPlans = myLessonPlans.map((lessonPlan: any) => {
      if(lessonPlan.id === id){
        lessonPlan.info.isPublished = true
        LessonPlanPublishStatusForConsoleLogOnly = lessonPlan.info.isPublished
      }
      return lessonPlan
    })
    this._myLessonPlans$.next(myLessonPlans)
    console.log(`lesson plan with id of ${id} is now  ${LessonPlanPublishStatusForConsoleLogOnly ? 'published' : 'draft'}`)
  }

  blendedLearning(id: number){
    // http call for creating blendedLearning
    console.log('blended learning created')
  }
}
