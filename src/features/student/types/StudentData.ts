export interface StudentLoginData {
  email: string;
  password: string;
}

export interface StudentLoginResponse {
  student: {
    fullName: string;
    email: string;
    // Add more fields if needed
  };
  accessToken: string;
  refreshToken: string;
}
