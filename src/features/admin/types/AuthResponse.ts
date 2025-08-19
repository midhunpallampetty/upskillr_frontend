export interface AuthResponse {
  accessToken:string;
  refreshToken:string;
  msg: string;
  admin?: any;
}