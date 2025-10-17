export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

export type Homework = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  submittedDate?: string;
};

export type Exam = {
  id: string;
  subject: string;
  date: string;
  score?: number;
  total: number;
};

export type StudyLink = {
  id: string;
  title: string;
  url: string;
  subject: string;
};

export type Gamification = {
  points: number;
  badges: string[];
  streak: number;
};

export type VaultFile = {
  id: string;
  name: string;
  size: string;
  date: string;
  url: string;
  path: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: 'homework' | 'exam' | 'event' | 'holiday';
  audience?: 'everyone' | 'teachers' | 'students' | 'parents';
};

export type Notification = {
    id: string;
    title: string;
    description: string;
    date: string;
    read: boolean;
};

export type Student = User & {
  role: 'student';
  grade: number;
  courseIds?: string[];
  homework: Homework[];
  exams: Exam[];
  studyLinks: StudyLink[];
  gamification: Gamification;
  calendar: CalendarEvent[];
  analytics: StudentAnalytics;
  notifications: Notification[];
  vault: VaultFile[];
};

export type StudentAnalytics = {
  timeSpent: { subject: string; hours: number }[];
  performance: { subject: string; score: number }[];
  progress: number;
};

export type Complaint = {
  id: string;
  userId: string;
  teacherId?: string;
  studentName: string;
  studentId: string;
  date: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
};

export type Teacher = User & {
  role: 'teacher';
  subject: string;
  courseIds?: string[];
};

export type Parent = User & {
  role: 'parent';
  childIds: string[];
};

export type Admin = User & {
  role: 'admin';
};