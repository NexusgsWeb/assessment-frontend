import { SchoolPlugin } from './SchoolPlugin';

export class School {
  id: number;
  organization_id: string;
  english_name: string;
  arabic_name: string;
  code: string;
  school_url: string;
  address: string;
  logo: string;
  mobile: string;
  phone1: string;
  phone2: string;
  email: string;
  website: string;
  license_number: string;
  license_type: string;
  license_expiration_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_uploaded: any;
  active_plugins: SchoolPlugin[];
}
