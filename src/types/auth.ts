export interface AuthUser {
  id: string;
  email: string;
  society_id: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
