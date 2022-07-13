import { contactDetails } from './contactDetails';
import { Nationality } from './Nationality';

export class Student {
  firstName: string;
  middleName: string;
  lastName: string;
  UserName: string;
  arabicFirstName: string;
  arabicMiddleName: string;
  arabicLastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  mobileNumber: string;
  placeOfBirth: string;
  userGender: string;
  sectionId: string;
  email: string;
  logoName: string;
  studentNumber: string;
  password: string;
  admissionDate: string;
  nationalities: Nationality[];
  contactDetails: contactDetails;
}
