export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'Sports' | 'Arts' | 'Academic' | 'Social';
  date: string;
  image: string;
}

export interface UserProfile {
  email: string;
  name: string;
  regNumber: string;
  role: 'admin' | 'user';
}

export interface Enquiry {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  regNumber?: string;
  message: string;
  status: 'pending' | 'completed';
  createdAt: any; // Firestore Timestamp
}

export interface TourBooking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  regNumber: string;
  tourDate: string;
  tourDay: string;
  status: 'pending' | 'completed';
  createdAt: any; // Firestore Timestamp
}
