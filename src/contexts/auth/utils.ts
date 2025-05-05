
import { UserRole, UserStatus } from '@/types';

// Helper function to convert string to UserStatus
export const toUserStatus = (status: string): UserStatus => {
  if (status === 'pending' || status === 'approved' || status === 'rejected') {
    return status as UserStatus;
  }
  return 'pending'; // Default value if status is not a valid UserStatus
};

// Helper function to convert string to UserRole
export const toUserRole = (role: string): UserRole => {
  if (role === 'admin' || role === 'student') {
    return role as UserRole;
  }
  return 'student'; // Default value if role is not a valid UserRole
};
