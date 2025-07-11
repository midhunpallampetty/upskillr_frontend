export interface School {
    _id: string;
    name: string;
    email: string;
    subDomain: string;
    image: string;
    coverImage: string;
    [key: string]: any;
  }