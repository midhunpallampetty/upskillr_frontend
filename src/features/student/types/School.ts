export interface School {
    _id: string;
    name: string;
    image: string;
    experience: string;
    coursesOffered: string[];
    isVerified: boolean;
    url:string;
    subDomain:string;
    
  }
  export interface Student{
  fullName:string;
  _id:string;
  image:string;
}