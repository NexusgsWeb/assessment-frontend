import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { QuestionmanagerService } from '../../_services/questionmanager.service';
import { DialogServiceService } from '../shared/dialog-service.service';

@Component({
  selector: 'app-question-settings-dialog-sa',
  templateUrl: './question-settings-dialog-sa.component.html',
  styleUrls: ['./question-settings-dialog-sa.component.css'],
})

export class QuestionSettingsDialogSaComponent implements OnInit {
  SelectedCir: BehaviorSubject<String> = new BehaviorSubject<String>(
    'Lebanese'
  );

  @Input() dataSelected: any;
  count = 0;
  count1 = 0;

  lebaneseData: any;
  americanData: any;
  britishData: any;
  accept = false;
  

  constructor(
    private dialogRef: MatDialogRef<QuestionSettingsDialogSaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private QuestionBankService: QuestionmanagerService,
    private dialogService: DialogServiceService
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.dataSelected = this.data;
    let blm = [];
    console.log(this.dataSelected.data.question)
    for(let bloom of this.dataSelected.data.question.blooms_taxonomy){
      let found = blm.find((item) => item.id == bloom.id);
      if(found == undefined){
        blm.push(bloom)
      }
    }

    this.dataSelected.data.question.blooms_taxonomy = blm


    let cur = [];
    for(let c of this.dataSelected.data.question.curriculum){
      let found = cur.find((item) => item.id == c.id);
      if(found == undefined){
        cur.push(c)
      }
    }

    this.dataSelected.data.question.curriculum = cur

    let domains = [];
    for(let dom of this.dataSelected.data.question.domain){
      let found = domains.find((item) => item.id == dom.id);
      if(found == undefined){
        domains.push(dom)
      }
    }

    this.dataSelected.data.question.domain = domains

    let lss = [];
    for(let ls of this.dataSelected.data.question.learning_standards){
      let found = lss.find((item) => item.id == ls.id);
      if(found == undefined){
        lss.push(ls)
      }
    }

    this.dataSelected.data.question.learning_standards = lss

    console.log('question final')
    console.log(this.dataSelected.data.question)

    
    
    
  }

  closeDialog() {
    
    // if(this.lebaneseData != undefined && this.americanData != undefined && this.britishData != null){
      this.dialogRef.close();
    // }

  }
  onFormSubmitted(event){
    if(event == true){
      this.closeDialog();
    }
  }
  onChangeCurriculum(event){
    console.log(event)
    this.SelectedCir.next(event)

  }

  getLebaneseData(event){
    console.log("get lebanese data")
    this.lebaneseData = event
  }
  getAmericanData(event){
    console.log("get american data")
    this.americanData = event
  }
  getBritishData(event){
    console.log("get british data")
    this.britishData = event
  }


  getQuestionById(questionId){
    console.log(questionId)
    this.QuestionBankService.previewQuestionDittofi(questionId).then((res : any) =>{
      console.log(res)
    })
    .catch((data) => {
      console.log(data)
    })
  }
  approveQuestion() {
    this.QuestionBankService
      .approveQuestionDittofi(this.dataSelected.data.question.id)
      .then((res) => {
        //Question successfully approved
        console.log(res)
      })
      .catch((err) => {
        //Error
        this.dialogService.openDialog({
          title: 'There was an error creating your question.',
          message: 'There was an error creating your question.',
          confirmText: 'OK',
          cancelText: 'Cancel',
          oneButton: true,
          DidConfirm: () => {},
        });
      });
  }

  save(){
    console.log('save save')
    console.log(this.dataSelected)
    console.log(this.lebaneseData)
    console.log(this.americanData)
    console.log(this.britishData)
    

    if(this.lebaneseData != undefined){
      this.count ++
    }
    if(this.americanData != undefined){
      this.count++;
    }
    if(this.britishData != undefined){
      this.count++;
    }

    if(this.lebaneseData != undefined){
      this.lebaneseMetadata(this.lebaneseData)
    }
    if(this.americanData != undefined){
      this.americanData.bloomsTaxonomyId = this.lebaneseData.bloomsTaxonomyId
      this.americanMetadata(this.americanData)
    }
    if(this.britishData != undefined){
      this.britishData.bloomsTaxonomyId = this.lebaneseData.bloomsTaxonomyId
      this.britishMetadata(this.britishData)
    }



  }

  approve(){
    
    this.accept = true;
    

    if(this.lebaneseData != undefined){
      this.count++
    }
    if(this.americanData != undefined){
      this.count++;
    }
    if(this.britishData != undefined){
      this.count++;
    }

    if(this.lebaneseData != undefined){
      this.lebaneseMetadata(this.lebaneseData)
    }
    if(this.americanData != undefined){
      this.americanData.bloomsTaxonomyId = this.lebaneseData.bloomsTaxonomyId
      this.americanMetadata(this.americanData)
    }
    if(this.britishData != undefined){
      this.britishData.bloomsTaxonomyId = this.lebaneseData.bloomsTaxonomyId
      this.britishMetadata(this.britishData)
    }
      this.approveQuestion();
    
  }
  lebaneseMetadata(curriculumData){
    console.log(this.dataSelected)
    console.log(curriculumData)
    let cq = this.dataSelected.data.question.curriculum_questions
    .find((item) => {
      console.log(item.grade_subject_id)
      console.log(curriculumData.grade_id)
      console.log('-----------------------------')
   
      return item.grade_subject_id == curriculumData.grade_id
    })

    console.log('curriculum questions1')
    console.log(cq)
    if(cq == undefined){
      let obj = {
        grade_code: curriculumData.gradeCode,
        subject_code: curriculumData.subjectCode,
        curriculum_id: curriculumData.curriculumId
      }
      console.log(obj)

      this.QuestionBankService.createCQdittofi(this.dataSelected.data.question.id, obj).then((data : any) => {
        console.log('curriculum data1')
        console.log(data.data)
        this.QuestionBankService.setQuestionMetaDataLebaneseDittofi(
          this.dataSelected.data.question.id,
          curriculumData
        )
          .then((res) => {
            console.log(res)
            this.count1++;
            console.log('meta data is set..');
            if(this.count1 == this.count){
              let msg = ''
              this.count = 0;
              this.count1 = 0;
              if(this.accept == true){
                msg = "Metadata is set and the question is approved successfully"
              }
              else{
                msg = 'Metadata is set successfully.';
              }
              this.dialogService.openDialog({
                title: msg,
                message: msg,
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {
                  this.closeDialog();
                },
              });
        
            }
           
          })
          .catch((err) => {
            console.log(err)
        
            this.dialogService.openDialog({
              title: 'Error while setting metadata.',
              message: 'Error while setting metadata.',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
              },
            });
            console.log(
              'question was created.. but meta data is not set..'
            );
          });
      })
      .catch((data) => {
        console.log(data)
      })
    }
    else{
      this.QuestionBankService.setQuestionMetaDataLebaneseDittofi(
        this.dataSelected.data.question.id,
        curriculumData
      )
        .then((res) => {
          console.log('meta data is set..');
          this.count1++;

          if(this.count1 == this.count){
            this.count = 0;
            this.count1 = 0;
            let msg = '';
            if(this.accept == true){
              msg = "Metadata is set and the question is approved successfully"
            }
            else{
              msg = 'Metadata is set successfully.';
            }
            this.dialogService.openDialog({
              title: msg,
              message: msg,
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
                this.closeDialog();
              },
            });
          }
          

        })
        .catch((err) => {
          console.log(err)
          this.dialogService.openDialog({
            title: 'Error while setting metadata.',
            message: 'Error while setting metadata.',
            confirmText: 'Ok',
            oneButton: true,
            cancelText: 'No',
            DidConfirm: () => {
            },
          });
  
          console.log(
            'question was created.. but meta data is not set..'
          );
        });
    }
  }
  americanMetadata(curriculumData){
    console.log(this.dataSelected)
    console.log(curriculumData)

    let cq = this.dataSelected.data.question.curriculum_questions
    .find((item) => {
      console.log(item.grade_subject_id)
      console.log(curriculumData.grade_id)
      console.log('-----------------------------')
   
      return item.grade_subject_id == curriculumData.grade_id
    })

    console.log('curriculum questions2')
    console.log(cq)
    if(cq == undefined){
      let obj = {
        grade_code: curriculumData.gradeCode,
        subject_code: curriculumData.subjectCode,
        curriculum_id: curriculumData.curriculumId
      }
      console.log(obj)

      this.QuestionBankService.createCQdittofi(this.dataSelected.data.question.id, obj).then((data : any) => {
        console.log('curriculum data2')
        console.log(data.data)
        this.QuestionBankService.setQuestionMetaDataAmericanDittofi(
          this.dataSelected.data.question.id,
          curriculumData
        )
          .then((res) => {
            console.log(res)
            this.count1++;
            console.log('meta data is set..');
            if(this.count1 == this.count){
              let msg = ''
              this.count = 0;
              this.count1 = 0;
              if(this.accept == true){
                msg = "Metadata is set and the question is approved successfully"
              }
              else{
                msg = 'Metadata is set successfully.';
              }
              this.dialogService.openDialog({
                title: msg,
                message: msg,
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {
                  this.closeDialog();
                },
              });
        
            }
           
          })
          .catch((err) => {
            console.log(err)
        
            this.dialogService.openDialog({
              title: 'Error while setting metadata.',
              message: 'Error while setting metadata.',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
              },
            });
            console.log(
              'question was created.. but meta data is not set..'
            );
          });
      })
      .catch((data) => {
        console.log(data)
      })
    }
    else{
      this.QuestionBankService.setQuestionMetaDataAmericanDittofi(
        this.dataSelected.data.question.id,
        curriculumData
      )
        .then((res) => {
          console.log('meta data is set..');
          this.count1++;

          if(this.count1 == this.count){
            this.count = 0;
            this.count1 = 0;
            let msg = '';
            if(this.accept == true){
              msg = "Metadata is set and the question is approved successfully"
            }
            else{
              msg = 'Metadata is set successfully.';
            }
            this.dialogService.openDialog({
              title: msg,
              message: msg,
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
                this.closeDialog();
              },
            });
          }
          

        })
        .catch((err) => {
          console.log(err)
          this.dialogService.openDialog({
            title: 'Error while setting metadata.',
            message: 'Error while setting metadata.',
            confirmText: 'Ok',
            oneButton: true,
            cancelText: 'No',
            DidConfirm: () => {
            },
          });
  
          console.log(
            'question was created.. but meta data is not set..'
          );
        });
    }
  }
  britishMetadata(curriculumData){
    console.log(this.dataSelected)
    console.log(curriculumData)
    let cq = this.dataSelected.data.question.curriculum_questions
    .find((item) => {
      console.log(item.grade_subject_id)
      console.log(curriculumData.grade_id)
      console.log('-----------------------------')
   
      return item.grade_subject_id == curriculumData.grade_id
    })

    console.log('curriculum questions3')
    console.log(cq)
    if(cq == undefined){
      let obj = {
        grade_code: curriculumData.gradeCode,
        subject_code: curriculumData.subjectCode,
        curriculum_id: curriculumData.curriculumId
      }
      console.log(obj)
      this.QuestionBankService.createCQdittofi(this.dataSelected.data.question.id, obj).then((data : any) => {
        console.log('curriculum data3')
        console.log(data.data)
        this.QuestionBankService.setQuestionMetaDataBritishDittofi(
          this.dataSelected.data.question.id,
          curriculumData
        )
          .then((res) => {
            console.log(res)
            this.count1++;
            console.log('meta data is set..');
            if(this.count1 == this.count){
              let msg = ''
              this.count = 0;
              this.count1 = 0;
              if(this.accept == true){
                msg = "Metadata is set and the question is approved successfully"
              }
              else{
                msg = 'Metadata is set successfully.';
              }
              this.dialogService.openDialog({
                title: msg,
                message: msg,
                confirmText: 'Ok',
                oneButton: true,
                cancelText: 'No',
                DidConfirm: () => {
                  this.closeDialog();
                },
              });
        
            }
           
          })
          .catch((err) => {
            console.log(err)
        
            this.dialogService.openDialog({
              title: 'Error while setting metadata.',
              message: 'Error while setting metadata.',
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
              },
            });
            console.log(
              'question was created.. but meta data is not set..'
            );
          });
      })
      .catch((data) => {
        console.log(data)
      })
    }
    else{
      this.QuestionBankService.setQuestionMetaDataBritishDittofi(
        this.dataSelected.data.question.id,
        curriculumData
      )
        .then((res) => {
          console.log('meta data is set..');
          this.count1++;

          if(this.count1 == this.count){
            this.count = 0;
            this.count1 = 0;
            let msg = '';
            if(this.accept == true){
              msg = "Metadata is set and the question is approved successfully"
            }
            else{
              msg = 'Metadata is set successfully.';
            }
            this.dialogService.openDialog({
              title: msg,
              message: msg,
              confirmText: 'Ok',
              oneButton: true,
              cancelText: 'No',
              DidConfirm: () => {
                this.closeDialog();
              },
            });
          }
          

        })
        .catch((err) => {
          console.log(err)
          this.dialogService.openDialog({
            title: 'Error while setting metadata.',
            message: 'Error while setting metadata.',
            confirmText: 'Ok',
            oneButton: true,
            cancelText: 'No',
            DidConfirm: () => {
            },
          });
  
          console.log(
            'question was created.. but meta data is not set..'
          );
        });
    }
  }
}
