export interface Section {
  id?: number,
  classId?: number,
  title?: string
}
export interface Book {
  id?: number,
  title?: string,
  publisher?: string,
  author?: string,
  edition?: string
}

export interface Chapter {
  id?: number,
  bookId?: number,
  title?: string,
  number?: number,
  startPage?: number,
  endPage?: number,
  briefIntroduction?: string
}

export interface Lesson {
  id?: number,
  chapterId?: number,
  title?: string,
  number?: number,
  startPage?: number,
  endPage?: number,
  briefIntroduction?: string
}
