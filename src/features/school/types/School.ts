// src/types/School.ts
export interface School {
  _id: string;
  name: string;
  address: string;
  officialContact: string;
  email: string;
  state:string;
  country:string;
  city:string;
  experience: number;
  isVerified: boolean;
  image?: string;
  coverImage?: string;
  subDomain?: string; // Make it optional to match the API response or adjust based on requirements
  createdAt: string;
}