export interface Curriculum {
    defaultConfiguration: boolean,
    class: Class,
    subject: Subject,
    type: Type,
    units: Unit[],
  }
  
  export interface Class{
    id: number,
    title: string
  }
  
  export interface Subject{
    id: number,
    title: string
  }
  
  export interface Type{
    id?: number,
    title?: string
  }
  
  export interface Unit {
    id: number,
    code: string,
    title: string
    learningStandards: LearningStandard[]
  }
  
  export interface LearningStandard {
    id: number,
    unitId: number,
    code: string,
    description: string,
    relatedTo: LearningStandard[]
  }
  