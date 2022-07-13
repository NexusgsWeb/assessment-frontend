import { contactDetails } from './contactDetails';
import { Nationality } from './Nationality';
import { Department } from './Department';
import { Position } from './Position';

export class Employee {
    employee_number: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
  arabic_first_name: string;
  arabic_middle_name: string;
  arabic_last_name: string;
  date_of_birth: string;
  phone_number: string;
  mobile_number: string;
  place_of_borth: string;
  user_gender: string;
  departments: Department[];
  positions: Position[];
  email: string;
  logoName: string;
  student_number: string;
  password: string;
  joinDate: string;
  nationalities: Nationality[];
  contactDetails: contactDetails;
}
