export interface Teacher {
  teacherid: number;
  fio: string;
  specialization: string;
  experience?: number | null;
  email?: string | null;
  age?: number | null;
  gender?: string | null;
  phone?: string | null;
}
