export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'Sports' | 'Arts' | 'Academic' | 'Social';
  date: string;
  image: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded';
  timestamp: number;
}
