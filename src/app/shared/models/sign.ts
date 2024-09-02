export interface IResponse {
  token: string;
}

export interface IError {
  message: string;
  reason: string;
}

export interface IResponseUser {
  email: string;
  name: string | null;
  role: string;
}
