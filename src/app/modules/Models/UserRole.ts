import { SchoolUser } from './SchoolUser';

export class UserRole {
  id: string;
  roleName: string;
  userId: string;
  schoolId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  user: SchoolUser;
}
