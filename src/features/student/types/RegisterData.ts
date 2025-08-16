export  interface RegisterData {
  fullName: string;
  email: string;
  password: string;
    confirmPassword?: string;  
}
export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword:string;
}