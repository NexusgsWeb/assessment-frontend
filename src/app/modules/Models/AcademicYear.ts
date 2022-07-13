import { AcademicClass } from './AcademicClass';

export class AcademicYear{
    cays: AcademicClass[] = [];
    name: string;
    code: string;
    private _startDate: string;
    private _endDate: string;
    id: string;
    is_active: boolean = true;
    school_id: string;
    updated_at: string;
    created_at: string
    expand = false;
    edit = false;


    get start_date(){
        return this._startDate;
    }
    set start_date(start_date: string){
        this._startDate = start_date;
    }
    get end_date(){
        return this._endDate;
    }
    set end_date(end_date: string){
        this._endDate = end_date;
    }
}