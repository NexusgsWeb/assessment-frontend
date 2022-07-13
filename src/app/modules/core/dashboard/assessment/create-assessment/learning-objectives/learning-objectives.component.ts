import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, Output, Input } from '@angular/core';
import { Book } from 'src/app/modules/Models/Book';
import { BookManagerService } from 'src/app/modules/_services/book-manager.service';
import { Chapter } from 'src/app/modules/Models/Chapter';
import { ChapterSection } from 'src/app/modules/Models/ChapterSection';
import { Unit } from 'src/app/modules/Models/Unit';
import { LearningObjective } from 'src/app/modules/Models/LearningObjective';
import { throwError, BehaviorSubject } from 'rxjs';
import { UnitLearningObjectives } from 'src/app/modules/Models/UnitLearningObjectives';
import { filter } from 'rxjs/operators';
import { AssessmentManagerService } from 'src/app/modules/_services/assessment-manager.service';
import { DialogServiceService } from 'src/app/modules/_dialogs/shared/dialog-service.service';

@Component({
  selector: 'app-learning-objectives',
  templateUrl: './learning-objectives.component.html',
  styleUrls: ['./learning-objectives.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningObjectivesComponent implements OnInit {
  @Output() onLOChoose = new EventEmitter<number>();
  @Output() onTransmitInfo = new EventEmitter<any>();


  books: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);;
  selectedBooks: any[] = [];
  chapters: BehaviorSubject<any[]> =  new BehaviorSubject<any[]>([]);
  selectedChapters: any[] = [];

  sections: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedSections: any[] = [];

  book: boolean = false;
  chapterDistribution: boolean =  true;

  sectionChaptersMap = {};
  entered: boolean = true;

  chapterPerc: number = 0;
  sectionPerc: number = 0;
  unitPerc: number = 0;
  loPerc: number = 0;

  //units

  units: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedUnits: any[] = [];

  tempLearningObjectives: any[] = []
  learningObjectives: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedLearningObjectives: any[] = [];

  learningStandards: any[] = [];

  unitDistribution: boolean = true;

  unitLODistributionMap = {};

  // select all

  allUnit: boolean = false;
  allLO: boolean = false;
  allBook: boolean = false;
  allChapter: boolean = false;
  allSection: boolean = false;

  constructor(private bookService: BookManagerService, private assessmentService: AssessmentManagerService,
    private DialogService: DialogServiceService) { }

  async ngOnInit(): Promise<void> {
    const lo = this.assessmentService.learningStandards$.getValue();
    if (lo != null){

      console.log(lo)
        if (this.entered){
          this.book = lo.book;
          this.entered = false;
        }
        this.selectedBooks = lo.selectedBooks;
        this.books = lo.books;
        this.chapters = lo.chapters;
        this.selectedChapters = lo.selectedChapters;
        this.sections = lo.sections;
        this.selectedSections = lo.selectedSections;
        this.units = lo.units;
        this.selectedUnits = lo.selectedUnits;
        this.learningObjectives = lo.learningObjectives;
        this.selectedLearningObjectives = lo.selectedLearningObjectives;
        this.sectionChaptersMap = lo.sectionChaptersMap,
        this.unitLODistributionMap = lo.unitLODistributionMap,
        this.chapterDistribution = lo.chapterDistribution,
        this.unitDistribution = lo.unitDistribution,
        this.chapterPerc = lo.chapterPerc,
        this.sectionPerc = lo.sectionPerc,
        this.unitPerc = lo.unitPerc,
        this.loPerc = lo.loPerc,
        this.allLO = lo.allLO,
        this.allChapter = lo.allChapter,
        this.allSection = lo.allSection,
        this.tempLearningObjectives = lo.tempLearningObjectives
      }
      else{
        if (this.book){
          await this.getAllBooks();
        }
        else{
          await this.getAllUnits();
        }
      }

  }

  bookChecked(event){
    if (event == "on"){
      this.book = true;
      this.books.next([])
      this.chapters.next([])
      this.sections.next([])
      this.selectedBooks = [];
      this.selectedChapters = [];
      this.selectedSections = [];
      this.getAllBooks();
    }
  }
  curriculumChecked(event){
    if (event == "on"){
      this.book = false;
      for(let unit of this.units.getValue()){
        unit.selected = false
      }
      for(let lo of this.learningObjectives.getValue()){
        lo.selected = false
      }
      this.tempLearningObjectives = []
      this.selectedUnits = [];
      this.units.next([])
      this.selectedLearningObjectives = [];
      this.learningObjectives.next([]);
      this.learningStandards = [];

      this.getAllUnits();
    }
  }

  getAllUnits(){
    const tempAssessment = this.assessmentService.newAssessment$.getValue();
    console.log(tempAssessment.selectedClass.code)
    console.log(tempAssessment.subject.code)

    this.bookService.getUnitsDittofi(tempAssessment.selectedClass.code, tempAssessment.subject.code, 2).then((res : any) => {
      console.log(res);
      // const tempLOCount = res.curriculum_questions.length;
      // console.log(tempLOCount);

    for(let unit of res.data){
      if(unit.code == null){
        unit.displayName = unit.name
      }
      else{
        unit.displayName = unit.code + ". " + unit.name
      }

    }

    const sortedUnits = res.data.sort((item1, item2) =>
      item1.code > item2.code ? 1 : -1
    );

      this.units.next(sortedUnits)
      console.log(this.units.getValue())

      for (let unit of this.units.getValue()){
        const tempLOs = unit.learning_objectives;
        console.log(tempLOs)
        for (let lo of tempLOs){
         lo.displayName = lo.code + ' ' + lo.description;
         lo.unitId = unit.id
        }
        this.tempLearningObjectives = this.tempLearningObjectives.concat(tempLOs);

        for(let ls of unit.learning_standards){
          ls.displayName = ls.code + '. ' + ls.description
          this.learningStandards.push(ls);
        }
      }


      console.log(this.tempLearningObjectives);
      console.log(this.learningStandards)


      // this.learningObjectives.next(LO)
    })
    .catch((res) => {
      console.log(res)

      let finalErr = 'Internal Server Error'
      if(res.error.error != undefined){
        finalErr = res.error.error.message;
      }
      console.log(res);

      console.log(res.error.error.message);
      this.DialogService.openDialog({
        title: finalErr,
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {

        }
      });
    })
  }
  allUnits(){

    if(this.allUnit){
      for(let i =0; i < this.units.getValue().length; i++){
        if(this.units.getValue()[i].selected){
          this.unitClicked(i)
        }
      }
    }
    else{
      for(let i =0; i < this.units.getValue().length; i++){
        if(this.units.getValue()[i].selected == false){
          this.unitClicked(i)
        }
      }
    }
    for(let i =0; i < this.units.getValue().length; i++){
      console.log(i)
      this.unitClicked(i);

    }
  }

  allLOs(){
    if(this.allLO){
      for(let i =0; i < this.learningObjectives.getValue().length; i++){
        if(this.learningObjectives.getValue()[i].selected){
          this.LOClicked(i)
        }
      }
    }
    else{
      for(let i =0; i < this.learningObjectives.getValue().length; i++){
        if(this.learningObjectives.getValue()[i].selected == false){
          this.LOClicked(i)
        }
      }
    }
    for(let i =0; i < this.learningObjectives.getValue().length; i++){
      console.log(i)
      this.LOClicked(i);

    }
  }

  allBooks(){

    if(this.allBook){
      for(let i =0; i < this.books.getValue().length; i++){
        if(this.books.getValue()[i].selected){
          this.bookClicked(i)
        }
      }
    }
    else{
      for(let i =0; i < this.books.getValue().length; i++){
        if(this.books.getValue()[i].selected == false){
          this.bookClicked(i)
        }
      }
    }
    for(let i =0; i < this.books.getValue().length; i++){
      console.log(i)
      this.bookClicked(i);

    }
  }

  allChapters(){

    if(this.allChapter){
      for(let i =0; i < this.chapters.getValue().length; i++){
        if(this.chapters.getValue()[i].selected){
          this.chapterClicked(i)
        }
      }
    }
    else{
      for(let i =0; i < this.chapters.getValue().length; i++){
        if(this.chapters.getValue()[i].selected == false){
          this.chapterClicked(i)
        }
      }
    }
    for(let i =0; i < this.chapters.getValue().length; i++){
      console.log(i)
      this.chapterClicked(i);

    }
  }

  allSections(){

    if(this.allSection){
      for(let i =0; i < this.sections.getValue().length; i++){
        if(this.sections.getValue()[i].selected){
          this.sectionClicked(i)
        }
      }
    }
    else{
      for(let i =0; i < this.sections.getValue().length; i++){
        if(this.sections.getValue()[i].selected == false){
          this.sectionClicked(i)
        }
      }
    }
    for(let i =0; i < this.sections.getValue().length; i++){
      this.sectionClicked(i);

    }
  }
   bookClicked(event){
     console.log(event)
     console.log(this.books.getValue()[event])
    this.books.getValue()[event].selected = !this.books.getValue()[event].selected;

    if (this.books.getValue()[event].selected){
      this.selectedBooks.push(this.books.getValue()[event]);
      console.log(this.books.getValue()[event].book_id)

      for(let chapter of this.books.getValue()[event].book_chapter_id){
        chapter.selected = false;
      }
      let ch = this.chapters.getValue();
      ch = ch.concat(this.books.getValue()[event].book_chapter_id);
      this.chapters.next(ch);

    }
    else{
      this.selectedBooks.filter((item) => {
        return item.id != this.books.getValue()[event].book_id
      });
      const updateChapters = [];
      for (let i = 0; i < this.chapters.getValue().length; i++){

        if (this.chapters.getValue()[i].book_id != this.books.getValue()[event].book_id){
          updateChapters.push(this.chapters.getValue()[i])
        }
        else{
          let sec = this.sections.getValue()
          const filterSection = sec.filter((item) => {
            return (item.chapter_id != this.chapters.getValue()[i].id)
          });
          this.sections.next(filterSection);

          this.selectedSections = this.selectedSections.filter((item) => {
            return (item.chapter_id != this.chapters.getValue()[i].id)
          });

          this.selectedChapters = this.selectedChapters.filter((item) => {
            return (item.id != this.chapters.getValue()[i].id)
          });
        }
      }


      this.chapters.next(updateChapters);
      // this.sections.next(updateSections);
    }

    this.getTotalPercentage();
  }

  chapterClicked(index){
    this.chapters.getValue()[index].selected = !this.chapters.getValue()[index].selected;

    if (this.chapters.getValue()[index].selected){
      this.selectedChapters.push(this.chapters.getValue()[index]);
      console.log(this.chapters.getValue()[index])
      console.log( this.selectedChapters)
      this.sectionChaptersMap[this.chapters.getValue()[index].id] = [];

      let secs = []
      for(let book of this.selectedBooks){
        for(let section of book.book_section_id){
          if(section.chapter_id == this.chapters.getValue()[index].id){
            section.code = section.number + '.' + section.title;
            section.selected = false
            section.chapterId = section.chapter_id
            secs.push(section);
          }
        }
      }
      let sec = this.sections.getValue();
      sec = sec.concat(secs)
      this.sections.next(sec);

      // this.bookService.getChapterSectionDittofi(this.chapters.getValue()[index].id).then((res : any ) => {

      //   console.log(res.data)
      //   let sec = this.sections.getValue();
      //   const tempSec: any[] = res.data;
      //   for (let section of tempSec){
      //     section.code = this.chapters.getValue()[index].number + '.' + section.title;
      //     section.selected = false
      //     section.chapterid = section.book_chapter_id
      //     section.id = section.id
      //   }

      //   console.log(tempSec)
      //   sec = sec.concat(tempSec)
      //   this.sections.next(sec);

      // }).catch((res) => {
      //   console.log(res)

      //   let finalErr = 'Internal Server Error'
      //   if(res.error.error != undefined){
      //     finalErr = res.error.error.message;
      //   }
      //   console.log(res);

      //   console.log(res.error.error.message);
      //   this.DialogService.openDialog({
      //     title: finalErr,
      //     message: 'test',
      //     confirmText: 'Okay',
      //     cancelText: 'Cancel',
      //     oneButton: true,
      //     DidConfirm: () => {

      //     }
      //   });
      // });
    }
    else{
      const ind = this.selectedChapters.findIndex(item => item.id == this.chapters.getValue()[index].id);


      const tempSection = [];
      for (let i = 0; i < this.selectedSections.length; i++){
        if (this.selectedSections[i].chapterId != this.selectedChapters[ind].id){
          tempSection.push(this.selectedSections[i]);
        }
        else{
          const sectionIndex = this.sections.getValue().findIndex(item => item.id == this.selectedSections[i].id);
          this.sections.getValue()[sectionIndex].selected = !this.sections.getValue()[sectionIndex].selected;
        }
      }
      this.selectedSections = tempSection;
      this.sectionChaptersMap[this.selectedChapters[ind].id] = [];
      let sec = this.sections.getValue()
      const filterSection = sec.filter((item) => {
        return (item.chapterId != this.chapters.getValue()[index].id)
      });
      this.sections.next(filterSection);



      if (ind != -1){
        this.selectedChapters.splice(ind, 1);
      }
    }

    if (this.chapterDistribution){
      for (let i = 0; i < this.selectedChapters.length; i++){
        this.selectedChapters[i].weight = Number((100 / this.selectedChapters.length).toFixed(2));

      }
      for (let j = 0; j < this.selectedSections.length; j++){
        const chapterTemp = this.selectedChapters.find(item => item.id == this.selectedSections[j].chapterId);
        const arrTemp = this.sectionChaptersMap[chapterTemp.id];
        if (arrTemp != null && arrTemp.length > 0){
          this.selectedSections[j].weight = Number((chapterTemp.weight / arrTemp.length).toFixed(2))
        }
        else{
          this.selectedSections[j].weight = 0;
        }
      }
    }
    else{
      for (let i = 0; i < this.selectedChapters.length; i++){
        const arr = this.sectionChaptersMap[this.selectedChapters[i].id];

        if (arr != null && arr.length > 0){
          const perc = arr[0].weight * arr.length;
          this.selectedChapters[i].weight = Number(perc.toFixed(2));
        }
        else{
          this.selectedChapters[i].weight = 0;
        }

      }
    }
    this.getTotalPercentage();

  }

  sectionClicked(index){
    this.sections.getValue()[index].selected = !this.sections.getValue()[index].selected;

    const chapter = this.selectedChapters.find(item => item.id == this.sections.getValue()[index].chapterId);
    if (this.sections.getValue()[index].selected){
      this.selectedSections.push(this.sections.getValue()[index]);

      var sectionArray = this.sectionChaptersMap[chapter.id];
      if (sectionArray == null){
        sectionArray = [];
      }
      sectionArray.push(this.sections.getValue()[index]);
      this.sectionChaptersMap[chapter.id] = sectionArray
    }
    else{
      const arr = this.sectionChaptersMap[chapter.id];
      const indexSection = arr.findIndex(item => item.id == this.sections.getValue()[index].id);
      arr.splice(indexSection, 1);
      this.sectionChaptersMap[chapter.id] = arr;

      const ind = this.selectedSections.findIndex(item => item.id == this.sections.getValue()[index].id);

      if (ind != -1){
        this.selectedSections.splice(ind, 1);
      }

    }

    if (!this.chapterDistribution){
      for (let i = 0; i < this.selectedSections.length; i++){
        this.selectedSections[i].weight = Number((100 / this.selectedSections.length).toFixed(2));

        const sections = this.sectionChaptersMap[this.selectedSections[i].chapterId];
        if (sections != undefined){
          const getSectionIndex = this.selectedChapters.findIndex(item => item.id == this.selectedSections[i].chapterId);
          this.selectedChapters[getSectionIndex].weight = this.selectedSections[i].weight * sections.length;
        }

      }
    }
    else{
      for (let i = 0; i < this.selectedSections.length; i++){
        const nb = this.sectionChaptersMap[this.selectedSections[i].chapterId];
        const tempChapter = this.selectedChapters.find(item => item.id == this.selectedSections[i].chapterId);
        if (tempChapter == undefined){
          console.log(this.selectedChapters)
          console.log(this.selectedSections[i].chapterId);
        }
        if (nb != null && nb.length > 0){
          this.selectedSections[i].weight = Number((tempChapter.weight / nb.length).toFixed(2));

        }
      }

    }

    this.getTotalPercentage();


  }
  getAllBooks(){
    const tempAssessment = this.assessmentService.newAssessment$.getValue();
    this.bookService.getAllBooksDittofi(tempAssessment.selectedClass.code, tempAssessment.subject.code).then((res: any) => {
      console.log(res)
      for(let book of res.data){
        book.selected = false;
      }
      let chapters = []

      for(let book of res.data){
        for(let chap of book.book_chapter_id){
          let found = chapters.find((item) => item.id == chap.id);
          if(found == undefined){
            chapters.push(chap)
          }
        }
        book.book_chapter_id = chapters

        let sections = []
        for(let sec of book.book_section_id){
          let found = sections.find((item) => item.id == sec.id);
          if(found == undefined){
            sections.push(sec)
          }
        }
        book.book_section_id = sections
      }


      this.books.next(res.data);
      console.log(this.books.getValue())

    }).catch((res) => {
      console.log(res)

      let finalErr = 'Internal Server Error'
      if(res.error.error != undefined){
        finalErr = res.error.error.message;
      }
      console.log(res);

      console.log(res.error.error.message);
      this.DialogService.openDialog({
        title: finalErr,
        message: 'test',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        oneButton: true,
        DidConfirm: () => {

        }
      });
    })
  }

  equalDistributeChapters(event){

    if (event == 'on'){
      this.chapterDistribution = true;
      const chaptersCount = this.selectedChapters.length;
      if (chaptersCount > 0){
        const perc = 100 / chaptersCount;

        for (let i = 0; i < this.selectedChapters.length; i++){
          this.selectedChapters[i].weight = Number(perc.toFixed(2));
          for (let j = 0; j < this.selectedSections.length; j++){
            if (this.selectedSections[j].chapterId == this.selectedChapters[i].id){

              const arr = this.sectionChaptersMap[this.selectedChapters[i].id];
              if (arr != null && arr.length > 0){
                const perc = this.selectedChapters[i].weight / arr.length;
                this.selectedSections[j].weight = Number(perc.toFixed(2));
              }


            }
          }
        }

      }
    }
    this.getTotalPercentage();

  }



  equalDistributeGradesSections(event){

    if (event){
      this.chapterDistribution = false;
      const sectionCount = this.selectedSections.length;
      if (sectionCount > 0){
        const perc = 100 / sectionCount;

        for (let i = 0; i < this.selectedSections.length; i++){
          this.selectedSections[i].weight = Number(perc.toFixed(2));
        }
        console.log(this.selectedChapters)
        for (let i = 0; i < this.selectedChapters.length; i++){
          const tempSection = this.selectedSections.find(item => item.chapter_id == this.selectedChapters[i].id);
          const arr = this.sectionChaptersMap[this.selectedChapters[i].id];
          if (arr != null && arr.length > 0){
            this.selectedChapters[i].weight = Number((tempSection.weight * arr.length).toFixed(2));

          }
          else{
            this.selectedChapters[i].weight = 0
          }
          console.log(this.selectedChapters[i].weight)
        }
      }
    }
    this.getTotalPercentage();

  }


  equalDistributeUnits(event){

    if (event == 'on'){
      this.unitDistribution = true;
      const unitsCount = this.selectedUnits.length;
      if (unitsCount > 0){
        const perc = 100 / unitsCount;

        for (let i = 0; i < this.selectedUnits.length; i++){
          this.selectedUnits[i].weight = Number(perc.toFixed(2));
          for (let j = 0; j < this.selectedLearningObjectives.length; j++){
            if (this.selectedLearningObjectives[j].unitId == this.selectedUnits[i].id){

              const arr = this.unitLODistributionMap[this.selectedUnits[i].id];
              if (arr != null && arr.length > 0){
                const perc = this.selectedUnits[i].weight / arr.length;
                this.selectedLearningObjectives[j].weight = Number(perc.toFixed(2));
              }


            }
          }
        }

      }
    }
    this.getTotalPercentage();

  }

  equalDistributeLOs(event){

    if (event){
      console.log(this.selectedUnits)
      this.unitDistribution = false;
      const loCount = this.selectedLearningObjectives.length;
      if (loCount > 0){
        const perc = 100 / loCount;

        for (let i = 0; i < this.selectedLearningObjectives.length; i++){
          this.selectedLearningObjectives[i].weight = Number(perc.toFixed(2));
        }
        for (let i = 0; i < this.selectedUnits.length; i++){
          const tempLO = this.selectedLearningObjectives.find(item => item.unitId == this.selectedUnits[i].id);
          const arr = this.unitLODistributionMap[this.selectedUnits[i].id];

          if (arr != null && arr.length > 0){
            this.selectedUnits[i].weight = Number((tempLO.weight * arr.length).toFixed(2));

          }
          else{
            this.selectedUnits[i].weight = 0
          }
        }
      }
    }
    this.getTotalPercentage();
  }

  unitClicked(index){


    this.units.getValue()[index].selected = !this.units.getValue()[index].selected;

    if (this.units.getValue()[index].selected){
      this.selectedUnits.push(this.units.getValue()[index]);
      this.selectedUnits = this.selectedUnits.sort((item1, item2) =>
      item1.name > item2.name ? 1 : -1
    );


      this.unitLODistributionMap[this.units.getValue()[index].id] = [];
      const LOs = [];
      console.log(this.tempLearningObjectives)
      for (let lo of this.tempLearningObjectives){
        if (lo.unitId == this.units.getValue()[index].id){
          LOs.push(lo);
        }
      }
      let oldLO = this.learningObjectives.getValue();
      oldLO = oldLO.concat(LOs);
      this.learningObjectives.next(oldLO);

    }
    else{
      const ind = this.selectedUnits.findIndex(item => item.id == this.units.getValue()[index].id);


      const tempLO = [];
      for (let i = 0; i < this.selectedLearningObjectives.length; i++){
        if (this.selectedLearningObjectives[i].unitId != this.selectedUnits[ind].id){
          tempLO.push(this.selectedLearningObjectives[i]);
        }
        else{
          const LOIndex = this.learningObjectives.getValue().findIndex(item => item.id == this.selectedLearningObjectives[i].id);
          this.learningObjectives.getValue()[LOIndex].selected = !this.learningObjectives.getValue()[LOIndex].selected;
        }
      }
      this.selectedLearningObjectives = tempLO;
      this.unitLODistributionMap[this.selectedUnits[ind].id] = [];


      this.selectedUnits = this.selectedUnits.filter((item) => {
        return item.id != this.units.getValue()[index].id;
      })

      let filterUnits = this.learningObjectives.getValue();
      filterUnits = filterUnits.filter((item) => {
          return item.unitId != this.units.getValue()[index].id
      });

      this.learningObjectives.next(filterUnits);
    }



    console.log(this.selectedUnits)
    if (this.unitDistribution){
      for (let i = 0; i < this.selectedUnits.length; i++){
        this.selectedUnits[i].weight = Number((100 / this.selectedUnits.length).toFixed(2));

      }
      for (let j = 0; j < this.selectedLearningObjectives.length; j++){
        const unitTemp = this.selectedUnits.find(item => item.id == this.selectedLearningObjectives[j].unitId);
        const arrTemp = this.unitLODistributionMap[unitTemp.id];
        if (arrTemp != null && arrTemp.length > 0){
          this.selectedLearningObjectives[j].weight = Number((unitTemp.weight / arrTemp.length).toFixed(2))
        }
        else{
          this.selectedLearningObjectives[j].weight = 0;
        }
      }
    }
    else{
      for (let i = 0; i < this.selectedUnits.length; i++){
        const arr = this.unitLODistributionMap[this.selectedUnits[i].id];

        if (arr != null && arr.length > 0){
          const perc = arr[0].weight * arr.length;
          this.selectedUnits[i].weight = Number(perc.toFixed(2));
        }
        else{
          this.selectedUnits[i].weight = 0;

        }

      }
    }

  //   this.bookService.getChapterSection(this.chapters.getValue()[index].bookId, this.chapters.getValue()[index].id).then((res)=>{
  //     console.log(res);
  //   }).catch((res) =>{
  //     console.log(res);
  // });
  this.getTotalPercentage();

  }

  LOClicked(index){
    console.log('entered index: ' + index)

    this.learningObjectives.getValue()[index].selected = !this.learningObjectives.getValue()[index].selected;

    const unit = this.selectedUnits.find(item => item.id == this.learningObjectives.getValue()[index].unitId);
    if (this.learningObjectives.getValue()[index].selected){
      const lo = this.learningObjectives.getValue()[index]
      this.selectedLearningObjectives.push(lo);

      var LOArray = this.unitLODistributionMap[unit.id];
      if (LOArray == null){
        LOArray = [];
      }
      LOArray.push(this.learningObjectives.getValue()[index]);
      this.unitLODistributionMap[unit.id] = LOArray

    }
    else{
      const arr = this.unitLODistributionMap[unit.id];
      const indexLO = arr.findIndex(item => item.id == this.learningObjectives.getValue()[index].id);
      arr.splice(indexLO, 1);
      this.unitLODistributionMap[unit.id] = arr;

      const ind = this.selectedLearningObjectives.findIndex(item => item.id == this.learningObjectives.getValue()[index].id);

      if (ind != -1){
        this.selectedLearningObjectives.splice(ind, 1);
      }
    }

    if (!this.unitDistribution){
      for (let i = 0; i < this.selectedLearningObjectives.length; i++){
        this.selectedLearningObjectives[i].weight = Number((100 / this.selectedLearningObjectives.length).toFixed(2));
        const units = this.unitLODistributionMap[this.selectedLearningObjectives[i].unitId];
        if (unit != undefined){
          const getUnitIndex = this.selectedUnits.findIndex(item => item.id == this.selectedLearningObjectives[i].unitId);
          this.selectedUnits[getUnitIndex].weight = this.selectedLearningObjectives[i].weight * units.length;
        }
      }

    }
    else{
      for (let i = 0; i < this.selectedLearningObjectives.length; i++){
        const nb = this.unitLODistributionMap[this.selectedLearningObjectives[i].unitId].length;
        this.selectedLearningObjectives[i].weight = Number(((100 / this.selectedUnits.length) / nb).toFixed(2));
      }

    }

    this.getTotalPercentage();

  }

  onSelectLO(){

    const chosenLOs = {
      book: this.book,
      selectedBooks: this.selectedBooks,
      selectedChapters: this.selectedChapters,
      selectedSections: this.selectedSections,
      selectedUnits: this.selectedUnits,
      selectedLearningObjectives: this.selectedLearningObjectives,
      selectedLearningStandards: this.learningStandards,
      books: this.books,
      chapters: this.chapters,
      sections: this.sections,
      units: this.units,
      learningObjectives: this.learningObjectives,
      sectionChaptersMap: this.sectionChaptersMap,
      unitLODistributionMap: this.unitLODistributionMap,
      chapterDistribution: this.chapterDistribution,
      unitDistribution: this.unitDistribution,
      chapterPerc:  this.chapterPerc,
      sectionPerc: this.sectionPerc,
      unitPerc: this.unitPerc,
      loPerc: this.loPerc,
      allLO: this.allLO,
      allChapter: this.allChapter,
      allSection: this.allSection,
      tempLearningObjectives: this.tempLearningObjectives


    }

    this.assessmentService.learningStandards$.next(chosenLOs);

    this.onLOChoose.emit(3);
    this.onTransmitInfo.emit(chosenLOs);
  }

  getTotalPercentage(){
    this.chapterPerc = 0;
    this.sectionPerc = 0;
    this.unitPerc = 0;
    this.loPerc = 0;
    if (this.book){
      for (let chapter of this.selectedChapters){
        this.chapterPerc = this.chapterPerc + chapter.weight;
      }
      for (let section of this.selectedSections){
        this.sectionPerc = this.sectionPerc + section.weight;
      }

      if (this.chapterPerc > 100){
        this.chapterPerc = 100
      }
      if (this.sectionPerc > 100){
        this.sectionPerc = 100;
      }
      this.chapterPerc = Number(this.chapterPerc.toFixed(2))
      this.sectionPerc = Number(this.sectionPerc.toFixed(2))

    }
    else{
      for (let unit of this.selectedUnits){
        this.unitPerc = this.unitPerc + unit.weight;
      }
      for (let lo of this.selectedLearningObjectives){
        this.loPerc = this.loPerc + lo.weight;
      }
      if (this.unitPerc > 100){
        this.unitPerc = 100
      }
      if (this.loPerc > 100){
        this.loPerc = 100
      }
      this.unitPerc = Number(this.unitPerc.toFixed(2))
      this.loPerc = Number(this.loPerc.toFixed(2))


    }
  }


}
