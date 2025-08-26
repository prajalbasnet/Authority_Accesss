import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  userType: 'citizen' | 'authority' | 'admin';
  location?: string;
  phone?: string;
  verified: boolean;
  createdAt: Date;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  priority: string;
  createdAt: Timestamp;
  userId: string;
  authorityId: string;
}
