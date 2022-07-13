import { School } from './school';
import { UserRole } from './UserRole';

export class Organization{
    id: number;
    english_name: string;
    arabic_name: string;
    code: string;
    organization_url: string;
    address: string;
    logo;
    mobile: string;
    phone1: string;
    phone2: string;
    email: string;
    website: string;
    license_number: number;
    license_type: string;
    license_expiration_date: string;
    role: string;
    is_active: true;
    createdAt: string;
    updatedAt: string;
    schools: School[];
    user_roles : UserRole[];
    image_uploaded: any;
    students_count: number;
    parents_count: number;
    employees_count: number;    

}
