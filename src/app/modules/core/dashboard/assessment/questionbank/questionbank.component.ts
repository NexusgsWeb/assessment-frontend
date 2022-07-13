import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { question } from 'src/app/modules/Models/question';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';
import { QuestionmanagerService } from 'src/app/modules/_services/questionmanager.service';
import { SchoolManagerService } from 'src/app/modules/_services/school-manager.service';
import { SubjectsManagerService } from 'src/app/modules/_services/subjects-manager.service';
import { CreateQuestionServiceService } from 'src/app/modules/_services/create-question-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImgURL } from 'src/app/shared/static_data/apiURL';
import { AcademicClassService } from 'src/app/modules/_services/academic-class.service';
import { AuthManagerService } from 'src/app/modules/_services/auth-manager.service';

@Component({
  selector: 'app-questionbank',
  templateUrl: './questionbank.component.html',
  styleUrls: ['./questionbank.component.css'],
})
export class QuestionbankComponent implements OnInit {
  @ViewChild('ClassSelector') ClassSelector;
  @ViewChild('SubjectSelector') SubjectSelector;
  @ViewChild('VisibilityFilter') VisibilityFilter;

  filterComponents;
  chosenSubject;
  currentPage = 1;
  approvedQuestions: number = 0;
  questionsToBeApproved: number = 0;
  questionLength = 0;

  classes: any[] = [];

  subjects = [];
  curriculums = [];
  grades = [];

  subjectMap = {};

  curriculumFilter: boolean = false;
  gradeFilter: boolean = false;
  domainFilter: boolean = false;
  loFilter: boolean = false;

  filters = ['All', 'Public', 'Private'];
  currentAssignedFilter = 'All';

  originalQuestionBank = [];
  sortedQuestionBank = [];

  SearchQuestionInput;

  selectedClasses;
  selectedSubjects: any;

  public userType: any;

  CheckAllCheckbox = false;
  tempObj: any;

  searchString: string = '';
  page: number = 0;

  didSelectAll: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

  constructor(
    private dialogService: DialogServiceService,
    private questionBankManager: QuestionmanagerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private subjectsManagerService: SubjectsManagerService,
    private schoolService: SchoolManagerService,
    private createQuestionService: CreateQuestionServiceService,
    private sanitizer: DomSanitizer,
    private academicYearService: AcademicClassService,
    private authManager: AuthManagerService
  ) {}

  ngOnInit() {
    this.tempObj = {
      curriculumId: '',
      gradeCode: '',
      domainId: '',
      learningObjectiveId: '',
      status: '',
    };
    this.intializePage();
  }

  intializePage() {
    console.log(this.selectedClasses);
    this.intializeUser();
    console.log(this.userType);
    if (this.userType == 'admin' || this.userType == 'super') {
      this.getSubjects();
    } else {
      this.getClasses();
    }
    this.DevelopmentMode();
  }
  async didSelectClass() {
    if (this.selectedClasses == null || this.selectedClasses == undefined) {
      this.selectedSubjects = null;
      return;
    }
    this.selectedSubjects = null;
    this.sortedQuestionBank = [];
    this.originalQuestionBank = [];
    this.approvedQuestions = 0;
    this.questionsToBeApproved = 0;
    this.questionLength = 0;
    this.page = 0;
    console.log(this.selectedClasses);
    console.log('code is ' + this.selectedClasses.code);
    await this.getTeacherSubjects();
  }

  getTeacherSubjects() {
    this.subjectsManagerService
      .getClassSubjectsAssessment(this.selectedClasses.id)
      .then((res: any) => {
        console.log(res);
        this.subjects = res.data;
      })
      .catch((res) => {
        console.log(res);
      });
  }

  getAdminFilterQuestionsDittofi(subjectCode, query, filters) {
    console.log(subjectCode);
    this.questionBankManager
      .getAdminFilterQuestionsDittofi(
        subjectCode,
        this.currentPage - 1,
        10,
        query,
        filters
      )
      .then((res: any) => {
        console.log(res);
        console.log(this.selectedSubjects);
        // this.questionLength = res.questions.count
        this.createQuestionService.SelectedClass = this.selectedClasses;
        this.createQuestionService.SelectedSubject = this.selectedSubjects;
        this.createQuestionService.allClasses = this.classes;
        this.createQuestionService.allSubjects = this.subjects;

        // for(let question of res.questions.rows){
        //   question.questionText = this.sanitizer.bypassSecurityTrustHtml(
        //     this.analyzeQuestionText(question.questionText)
        //   );
        // }

        if (res.data == null) {
          this.originalQuestionBank = [];
          this.sortedQuestionBank = [];
          this.approvedQuestions = 0;
          this.questionsToBeApproved = 0;
          this.questionLength = 0;
          this.page = 0;
        } else {
          // for(let ques of res.data){
          //   ques.selected = false;
          //   if(this.sortedQuestionBank.length > 0){
          //     let questionFound = this.sortedQuestionBank.find((item) => item.id = ques.id);
          //     if(questionFound == undefined){
          //       this.sortedQuestionBank.push(questionFound)
          //     }
          //     let questionFound1 = this.originalQuestionBank.find((item) => item.id = ques.id);
          //     if(questionFound1 == undefined){
          //       this.originalQuestionBank.push(questionFound1)
          //     }
          //   }
          // }
          // if(this.sortedQuestionBank.length == 0){
          const ConvertedArr: question[] = res.data as question[];
          this.originalQuestionBank = ConvertedArr;
          this.sortedQuestionBank = ConvertedArr;
          console.log(ConvertedArr);
          // }

          // const ConvertedArr: question[] = res.data as question[];

          // this.originalQuestionBank = ConvertedArr;
          // this.sortedQuestionBank = ConvertedArr;
          // console.log(ConvertedArr);

          this.page = res.data[0].total_number;
          this.questionLength = this.page;
          this.approvedQuestions = res.data[0].approve;
          this.questionsToBeApproved = res.data[0].pending;
        }
      })
      .catch((err) => {
        console.log(err);
        this.dialogService.openDialog({
          title:
            'There was an error retrieving the questions... Please reauthenticate and try again.',
          message:
            'There was an error retrieving the questions... Please reauthenticate and try again.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  getTeacherSearchQuestions(subjectCode, query) {
    console.log(this.selectedClasses);
    this.questionBankManager
      .getTeacherSearchQuestionsDittofi(
        subjectCode,
        this.selectedClasses.code,
        this.currentPage,
        10,
        query,
        2
      )
      .then((res: any) => {
        console.log(res);
        if (res.data != null) {
          // for(let ques of res.data){
          //   ques.selected = false;
          //   if(this.sortedQuestionBank.length > 0){
          //     let questionFound = this.sortedQuestionBank.find((item) => item.id = ques.id);
          //     if(questionFound == undefined){
          //       this.sortedQuestionBank.push(questionFound)
          //     }
          //     let questionFound1 = this.originalQuestionBank.find((item) => item.id = ques.id);
          //     if(questionFound1 == undefined){
          //       this.originalQuestionBank.push(questionFound1)
          //     }
          //   }
          // }

          this.page = res.data[0].total_number;
          this.approvedQuestions = res.data[0].approve;
          this.questionsToBeApproved = res.data[0].pending;

          this.questionLength = res.data[0].total_number;
          // for(let question of res.questions.rows){
          //   question.questionText = this.sanitizer.bypassSecurityTrustHtml(
          //     this.analyzeQuestionText(question.questionText)

          //   );
          // }

          // if(this.sortedQuestionBank.length == 0){
          const ConvertedArr: question[] = res.data as question[];
          this.originalQuestionBank = ConvertedArr;
          this.sortedQuestionBank = ConvertedArr;
          console.log(ConvertedArr);
          // }
          this.createQuestionService.allClasses = this.classes;
          this.createQuestionService.allSubjects = this.subjects;
          this.createQuestionService.SelectedClass = this.selectedClasses;
          this.createQuestionService.SelectedSubject = this.selectedSubjects;
        } else {
          this.approvedQuestions = 0;
          this.questionsToBeApproved = 0;
          this.questionLength = 0;
          this.page = 0;
          this.originalQuestionBank = [];
          this.sortedQuestionBank = [];
        }
      })
      .catch((err) => {
        console.log(err);
        this.dialogService.openDialog({
          title:
            'There was an error retrieving the questions... Please reauthenticate and try again.',
          message:
            'There was an error retrieving the questions... Please reauthenticate and try again.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  intializeUser() {
    // for now this is static
    // const AllowedTypes = ['admin', 'schooladmin', 'teacher'];
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   console.log(params)
    //   console.log(this.authManager.getTypeOfUser())

    //   if (
    //     params['type'] === undefined ||
    //     params['type'] === null ||
    //     !AllowedTypes.includes(params['type'])
    //   ) {
    //     console.log("entered null")
    //     this.userType = 'admin';
    //     return;
    //   }
    //   this.userType = params['type'];
    // });

    this.userType = this.authManager.getTypeOfUser();
  }
  DevelopmentMode() {
    // This function is designed just for testing.. Please dont use it in production.
    this.sortedQuestionBank = [];
    this.originalQuestionBank = [];
  }

  getClasses() {
    console.log('called called');
    this.subjectsManagerService
      .getAllClassesDittofi(this.authManager.getUserId())
      .then((res: any) => {
        console.log(res);
        this.classes = res.data;
      })
      .catch((res) => {
        console.log(res);
        this.dialogService.openDialog({
          title: 'Please login through a user instead of a super admin.',
          message: 'test',
          confirmText: 'Yes',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  getSubjects() {
    this.questionBankManager
      .getSuperAdminCurriculumDittofi()
      .then((res: any) => {
        console.log('question bank grades');
        console.log(res);
        const cur = res.data;
        for (let c of cur) {
          const tempCurriculum = { id: c.id, code: c.code, name: c.name };
          this.curriculums.push(tempCurriculum);
          const tempGrades = c.grades;

          for (let grade of tempGrades) {
            this.grades.push({
              id: grade.id,
              name: grade.grade_code,
              curriculumName: c.name,
            });
          }
          const tempSubject = c.subjects;

          console.log(this.subjects);
          for (let sub of tempSubject) {
            console.log(sub);
            const index = this.subjects.findIndex(
              (item) => item.code == sub.subject_code
            );
            if (index == -1) {
              console.log('entered');
              this.subjects.push({ code: sub.subject_code, name: sub.name });
              this.subjectMap[sub.subject_code] = [tempCurriculum];
            } else {
              const curriculumsArray = this.subjectMap[sub.subject_code];
              curriculumsArray.push(tempCurriculum);
              this.subjectMap[sub.subject_code] = curriculumsArray;
            }
          }
        }

        this.subjects = [...this.subjects];
        console.log(this.curriculums);
        console.log(this.grades);
        console.log(this.subjects);
        console.log(this.subjectMap);
        // this.selectedSubjects = this.subjects[0];

        const filter = {
          curriculums: this.curriculums,
          grades: this.grades,
          subjects: this.subjects,
          subjectMap: this.subjectMap,
        };
        this.filterComponents = filter;
        console.log(this.filterComponents);
      })
      .catch((res) => {
        console.log(res);
        this.dialogService.openDialog({
          title: 'Please login through a user instead of a super admin.',
          message: 'test',
          confirmText: 'Yes',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  filterByCurriculum(event) {
    const tempQuestions = [];
    for (let question of this.sortedQuestionBank) {
      for (let cq of question.cq) {
        if (cq.curriculumId == event) {
          tempQuestions.push(question);
        }
      }
    }
    console.log(tempQuestions);
    return tempQuestions;
  }

  filterByGrades(event) {
    const tempQuestions = [];
    for (let question of this.originalQuestionBank) {
      for (let cq of question.cq) {
        for (let qlo of cq.qLOs) {
          if (qlo.LO.learningStandard != undefined) {
            if (qlo.LO.learningStandard.gradeCode == event) {
              tempQuestions.push(question);
            }
          }
        }
      }
    }
    return tempQuestions;
  }

  filterByDomain(event) {
    const tempQuestions = [];
    for (let question of this.sortedQuestionBank) {
      for (let cq of question.cq) {
        for (let qlo of cq.qLOs) {
          if (qlo.LO.domain != null) {
            console.log(qlo.LO.domain);
            if (qlo.LO.domain.id == event) {
              tempQuestions.push(question);
            }
          }
        }
      }
    }
    return tempQuestions;
  }

  filterByLO(event) {
    const tempQuestions = [];
    for (let question of this.sortedQuestionBank) {
      for (let cq of question.cq) {
        for (let qlo of cq.qLOs) {
          if (qlo.LO.id == event) {
            tempQuestions.push(question);
          }
        }
      }
    }
    return tempQuestions;
  }
  filterQuestions(event) {
    console.log(event);

    if (event.curriculum != null || event.curriculum != undefined) {
      this.tempObj.curriculumId = event.curriculum.data.id;
    } else {
      this.tempObj.curriculumId = '';
    }
    if (event.grade != null || event.grade != undefined) {
      this.tempObj.gradeCode = event.grade.data.name;
    } else {
      this.tempObj.gradeCode = '';
    }
    if (event.domain != null || event.domain != undefined) {
      this.tempObj.domainId = event.domain.data.id;
    } else {
      this.tempObj.domainId = '';
    }

    if (event.lo != null || event.lo != undefined) {
      this.tempObj.learningObjectiveId = event.lo.data.id;
    } else {
      this.tempObj.learningObjectiveId = '';
    }
    if (event.status != null || event.status != undefined) {
      if (event.status.data.name == 'Pending') {
        this.tempObj.status = 'pending';
      } else {
        this.tempObj.status = 'approve';
      }
    } else {
      this.tempObj.status = '';
    }
    if (event.clear != null || event.clear != undefined) {
      this.tempObj = {
        curriculumId: '',
        gradeCode: '',
        domainId: '',
        learningObjectiveId: '',
        status: '',
      };
    }
    this.SearchQuestionInput = '';

    if (this.userType == 'admin' || this.userType == 'super') {
      this.getAdminFilterQuestionsDittofi(
        this.chosenSubject.code,
        '',
        this.tempObj
      );
    } else {
      this.getTeacherSearchQuestions(this.chosenSubject.code, '');
    }
    // let tempQuestions = [];
    // if (event.type == 'curriculum') {

    //   this.sortedQuestionBank = this.originalQuestionBank;
    //   tempQuestions = this.filterByCurriculum(event.data.id);
    // } else if (event.type == 'grade') {
    //   let curriculumId = '';
    //   let domainId = '';
    //   let loId = '';
    //   console.log(this.gradeFilter);
    //   console.log(this.sortedQuestionBank.length);
    //   if (this.gradeFilter) {
    //     if (this.sortedQuestionBank.length > 0) {
    //       curriculumId = this.sortedQuestionBank[0].cq[0].curriculumId;
    //       domainId = this.sortedQuestionBank[0].cq[0].qLOs[0].LO.domain.id;
    //       loId = this.sortedQuestionBank[0].cq[0].qLOs[0].LO.id;
    //       console.log(curriculumId);
    //       this.sortedQuestionBank = this.originalQuestionBank;
    //       this.sortedQuestionBank = this.filterByCurriculum(curriculumId);
    //       console.log(this.sortedQuestionBank.length);

    //       if (this.domainFilter) {
    //         this.sortedQuestionBank = this.filterByDomain(domainId);
    //       }
    //       if (this.loFilter) {
    //         this.sortedQuestionBank = this.filterByLO(loId);
    //       }
    //     }
    //   } else {
    //     this.gradeFilter = true;
    //   }
    //   tempQuestions = this.filterByGrades(event.data.name);
    //   console.log(tempQuestions);
    // } else if (event.type == 'domain') {
    //   let curriculumId = '';
    //   let gradeId = '';
    //   if (this.domainFilter) {
    //     if (this.sortedQuestionBank.length > 0) {
    //       curriculumId = this.sortedQuestionBank[0].cq[0].curriculumId;
    //       gradeId =
    //         this.sortedQuestionBank[0].cq[0].qLOs[0].LO.learningStandard
    //           .gradeCode;
    //       console.log(curriculumId);
    //       this.sortedQuestionBank = this.originalQuestionBank;
    //       this.sortedQuestionBank = this.filterByCurriculum(curriculumId);
    //       console.log(this.sortedQuestionBank.length);
    //       if (this.gradeFilter) {
    //         this.sortedQuestionBank = this.filterByGrades(gradeId);
    //         console.log(this.sortedQuestionBank.length);
    //       }
    //     }
    //   } else {
    //     this.domainFilter = true;
    //   }
    //   console.log(this.sortedQuestionBank);

    //   tempQuestions = this.filterByDomain(event.data.id);
    // } else if (event.type == 'lo') {
    //   if (this.domainFilter) {
    //     let curriculumId = '';
    //     let gradeId = '';
    //     let domainId = '';
    //     if (this.sortedQuestionBank.length > 0) {
    //       curriculumId = this.sortedQuestionBank[0].cq[0].curriculumId;
    //       gradeId =
    //         this.sortedQuestionBank[0].cq[0].qLOs[0].LO.learningStandard
    //           .gradeCode;
    //       domainId = this.sortedQuestionBank[0].cq[0].qLOs[0].LO.domain.id;
    //       console.log(curriculumId);
    //       this.sortedQuestionBank = this.originalQuestionBank;
    //       this.sortedQuestionBank = this.filterByCurriculum(curriculumId);
    //       console.log(this.sortedQuestionBank.length);
    //       if (this.gradeFilter) {
    //         this.sortedQuestionBank = this.filterByGrades(gradeId);
    //       }
    //       if (this.domainFilter) {
    //         this.sortedQuestionBank = this.filterByDomain(domainId);
    //       }
    //     }
    //   } else {
    //     this.domainFilter = true;
    //   }

    //   tempQuestions = this.filterByLO(event.data.id);
    // } else {
    //   tempQuestions = this.originalQuestionBank;
    // }

    // this.sortedQuestionBank = tempQuestions;
  }
  searchByQuestion() {
    this.currentPage = 1;
    if (this.SearchQuestionInput != '') {
      this.sortedQuestionBank = this.originalQuestionBank.filter((res) => {
        return res.questionText
          .toLocaleLowerCase()
          .includes(this.SearchQuestionInput.toLocaleLowerCase());
      });
    } else if (this.SearchQuestionInput === '') {
      this.sortedQuestionBank = this.originalQuestionBank;
    }
  }

  FilterForSuperAdmin() {
    //To be implemeneted
  }
  didClearClasses() {
    this.selectedSubjects = null;
    this.sortedQuestionBank = [];
    this.originalQuestionBank = [];
    this.approvedQuestions = 0;
    this.questionsToBeApproved = 0;
    this.questionLength = 0;
    this.page = 0;
  }
  didClearSubjects() {
    this.sortedQuestionBank = [];
    this.originalQuestionBank = [];
    this.approvedQuestions = 0;
    this.questionsToBeApproved = 0;
    this.questionLength = 0;
    this.page = 0;
  }
  async didSelectSubject(event) {
    console.log(event);
    this.chosenSubject = event;
    this.originalQuestionBank = [];
    console.log(this.userType);
    this.SearchQuestionInput = '';

    if (this.userType == 'admin' || this.userType == 'super') {
      await this.getAdminFilterQuestionsDittofi(
        this.chosenSubject.code,
        '',
        this.tempObj
      );
    } else {
      console.log(this.chosenSubject);
      await this.getTeacherSearchQuestions(this.chosenSubject.code, '');
    }
    this.sortedQuestionBank = this.originalQuestionBank;
  }
  didClickVisibilityFilter(Filterby) {
    this.currentAssignedFilter = Filterby;
    if (Filterby === 'All') {
      this.sortedQuestionBank = this.originalQuestionBank;
      return;
    } else if (Filterby === 'Private') {
      this.sortedQuestionBank = this.originalQuestionBank.filter((elem) => {
        return !elem.isPublished;
      });
    } else if (Filterby === 'Public') {
      this.sortedQuestionBank = this.originalQuestionBank.filter((elem) => {
        return elem.isPublished;
      });
    } else {
      this.sortedQuestionBank = this.originalQuestionBank.filter((elem) => {
        return elem.isPublished && elem.status != null;
      });
      //Awaiting Approval..
    }
  }
  didDeleteQuestion(event) {
    this.sortedQuestionBank = this.sortedQuestionBank.filter((elem) => {
      return !(elem === event);
    });
    this.originalQuestionBank = this.originalQuestionBank.filter((elem) => {
      return !(elem === event);
    });
    this.currentPage = 1;

    this.CheckAllCheckbox = false;
  }
  deleteSelectedQuestions() {
    let count = 0;
    let deleted = 0;
    for (let ques of this.sortedQuestionBank) {
      if (ques.selected == true) {
        deleted++;
      }
    }
    if (deleted == 0) {
      this.dialogService.openDialog({
        title: 'No questions are selected to be deleted',
        message: 'test',
        confirmText: 'Yes',
        cancelText: 'No',
        oneButton: false,
        DidConfirm: () => {},
      });
    } else {
      this.dialogService.openDialog({
        title: 'Are you sure you want to delete the selected question?',
        message: 'test',
        confirmText: 'Yes',
        cancelText: 'No',
        oneButton: false,
        DidConfirm: () => {
          for (let ques of this.sortedQuestionBank) {
            if (ques.selected == true) {
              this.questionBankManager
                .deleteQuestionDittofi(ques.id)
                .then((res) => {
                  console.log(res);
                  count++;
                  this.sortedQuestionBank = this.sortedQuestionBank.filter(
                    (elem) => {
                      return elem.id != ques.id;
                    }
                  );
                  //success..
                })
                .catch((err) => {
                  console.log(err);

                  this.dialogService.openDialog({
                    title: 'There was an error deleting your question',
                    message: 'test',
                    confirmText: 'Ok',
                    cancelText: 'No',
                    oneButton: true,
                    DidConfirm: () => {},
                  });
                });
            }
          }
        },
      });

      this.currentPage = 1;

      this.questionLength = this.questionLength - count;
      this.page = this.questionLength;

      this.CheckAllCheckbox = false;
    }
  }
  didSelectQuestion(event) {
    for (let ques of this.sortedQuestionBank) {
      if (ques.id == event.id) {
        ques.selected = !ques.selected;
      }
      console.log(ques.id);
      console.log(ques.selected);
      console.log('----------------------');
    }
  }

  didSelectAllQuestions() {
    if (this.didSelectAll.getValue() === false) {
      this.didSelectAll.next(true);
      for (let ques of this.sortedQuestionBank) {
        ques.selected = true;
      }
    } else {
      this.didSelectAll.next(false);
      for (let ques of this.sortedQuestionBank) {
        ques.selected = false;
      }
    }
  }
  navigateToCreateQuestion() {
    this.createQuestionService.selectedQuestion = null;

    this.createQuestionService.allClasses = this.classes;
    this.createQuestionService.allSubjects = this.subjects;
    this.createQuestionService.SelectedClass = this.selectedClasses;
    this.createQuestionService.SelectedSubject = this.selectedSubjects;

    console.log(this.createQuestionService.SelectedClass);
    this.router.navigate(['createQuestion'], {
      relativeTo: this.activatedRoute,
    });
  }
  SaveQuestion(Question: question) {
    this.questionBankManager
      .createQuestionV2Dittofi(Question, null, this.authManager.getUserId())
      .then((res) => {
        this.dialogService.openDialog({
          title: 'Success',
          message: 'Success',
          confirmText: 'Yes',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      })
      .catch((err) => {
        this.dialogService.openDialog({
          title: 'There was an error creating your question.',
          message: 'There was an error creating your question.',
          confirmText: 'Yes',
          cancelText: 'No',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }
  paginationClicked() {
    if (this.userType == 'admin' || this.userType == 'super') {
      this.getAdminFilterQuestionsDittofi(
        this.chosenSubject.code,
        this.searchString,
        this.tempObj
      );
    } else {
      this.getTeacherSearchQuestions(
        this.chosenSubject.code,
        this.searchString
      );
    }
  }

  analyzeQuestionText(questionText: string) {
    const questionArray = questionText.split(' ');
    let newQuestion = '';
    for (let letter of questionArray) {
      if (letter.includes('{$$') && letter.includes('$$}')) {
        const imageName = letter.replace('{$$', '').replace('$$}', '');
        const newImage = '<img src="' + ImgURL + imageName + '" />';

        newQuestion = newQuestion + newImage + ' ';
      } else if (letter.includes('$')) {
        letter = letter.replace('$', '');
      } else {
        newQuestion = newQuestion + letter + ' ';
      }
    }

    return newQuestion;
  }
  searchQuery(query) {
    console.log(query);
    if (query != undefined) {
      this.searchString = query;
      if (this.userType == 'admin' || this.userType == 'super') {
        this.getAdminFilterQuestionsDittofi(
          this.chosenSubject.code,
          query,
          this.tempObj
        );
      } else {
        this.getTeacherSearchQuestions(this.chosenSubject.code, query);
      }
    }
  }
  onChangeMetadata(event) {
    if (this.userType == 'admin' || this.userType == 'super') {
      this.getAdminFilterQuestionsDittofi(
        this.chosenSubject.code,
        this.searchString,
        this.tempObj
      );
    } else {
      console.log(this.chosenSubject);
      this.getTeacherSearchQuestions(
        this.chosenSubject.code,
        this.searchString
      );
    }
  }
}
