export interface IMember {
  userId: number;
  email: string;
  password?: string;       // 소셜 로그인은 없을 수 있음
  nickname: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  provider?: 'LOCAL' | 'KAKAO' | 'NAVER';
  providerId?: string;
  deleteYn?: string;
  createdAt?: string;
  updatedAt?: string;
}