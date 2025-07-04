export interface School {
    _id: string;
    name: string;
    email: string;
    experience: string;
    coursesOffered: string[];
    isVerified: boolean;
    image?: string;
    coverImage?: string;
    address: string;
    officialContact: string;
    subDomain?: string;
  }