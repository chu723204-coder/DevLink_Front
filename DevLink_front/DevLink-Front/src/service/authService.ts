import api from "./api";
import type { IMember } from "../types/IMember";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  nickname: string;
  role: string;
  accessToken: string;
}

const authService = {
  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post("/api/auth/login", data);
    return res.data.data;
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<void> => {
    await api.post("/api/auth/signup", data);
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    await api.post("/api/auth/logout");
  },

  // 토큰 재발급
  reissue: async (): Promise<string> => {
    const res = await api.post("/api/auth/reissue");
    return res.data.data;
  },

  // 이메일 인증 코드 발송
  sendEmailCode: async (email: string): Promise<void> => {
    await api.post(`/api/auth/email/send?email=${email}`);
  },

  // 이메일 인증 코드 검증
  verifyEmailCode: async (email: string, code: string): Promise<void> => {
    await api.post(`/api/auth/email/verify?email=${email}&code=${code}`);
  },

  // 내 정보 조회
  getMyInfo: async (): Promise<IMember> => {
    const res = await api.get("/api/auth/me");
    return res.data.data;
  },
};

export default authService;