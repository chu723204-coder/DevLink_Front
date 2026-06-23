# DevLink Frontend

> 개발자 취준생을 위한 커뮤니티 플랫폼 - 프론트엔드

<br />

## 📌 프로젝트 소개

**DevLink**는 개발자 취업을 준비하는 취준생들이 면접 후기, 스터디 모집, 기술 질문을 한 곳에서 나누고 함께 성장할 수 있는 커뮤니티 플랫폼입니다.

> 💡 직접 취준생으로서 필요성을 느끼고 기획한 서비스입니다.

<br />

## 👤 개발자 소개

| 이름 | 역할 | GitHub |
|------|------|--------|
| 추상현 | Frontend / Backend (1인 풀스택) | [chu723204-coder](https://github.com/chu723204-coder) |

<br />

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat-square&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logoColor=white)

### 실시간
![SSE](https://img.shields.io/badge/SSE-실시간알림-brightgreen?style=flat-square)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-brightgreen?style=flat-square)

<br />

## 📁 프로젝트 구조

```
src/
├── assets/                # 이미지, 폰트 등 정적 파일
├── components/            # 공통 컴포넌트
│   ├── common/            # Button, Input, Modal 등
│   ├── layout/            # Header, Footer, Sidebar
│   └── ui/                # Badge, Avatar, Spinner 등
├── pages/                 # 라우트별 페이지
│   ├── auth/              # 로그인, 회원가입
│   ├── post/              # 게시판 목록, 상세, 작성
│   ├── study/             # 스터디 모집 목록, 상세, 작성
│   ├── chat/              # 채팅방 목록, 채팅창
│   ├── notification/      # 알림 목록
│   └── mypage/            # 마이페이지, 프로필 수정
├── hooks/                 # 커스텀 훅
├── service/               # API 호출 함수
├── store/                 # Zustand 전역 상태
├── types/                 # TypeScript 타입 정의
├── utils/                 # 공통 유틸 함수
└── routers/               # 라우터 설정
```

<br />

## ✨ 주요 기능

- **회원 관리** — 이메일 회원가입 / 카카오 · 네이버 소셜 로그인
- **게시판** — 자유게시판 / 면접 후기 / 기술 질문 / 취업 정보 (카테고리 필터 + 정렬)
- **스터디 모집** — 모집글 등록, 지원, 수락/거절 → 채팅방 자동 생성
- **실시간 알림** — 댓글, 좋아요, 스터디 지원/수락/거절 알림 (SSE)
- **실시간 채팅** — 스터디 팀원 간 채팅방 (WebSocket STOMP)
- **관리자 페이지** — 회원 정지/해제, 게시글 관리, 신고 처리
- **마이페이지** — 프로필 수정, 회원탈퇴

<br />

## 🔐 인증 구조

| 토큰 | 저장소 | 유효기간 | 목적 |
|------|--------|----------|------|
| Access Token | Zustand 메모리 | 30분 | XSS 공격 방지 |
| Refresh Token | HttpOnly Cookie | 7일 | 토큰 탈취 방지 |

- Access Token 만료 시 Refresh Token으로 자동 재발급
- STOMP 연결 헤더에 Access Token 포함 → ChannelInterceptor 서버 검증

<br />

## 🔗 관련 링크

- **백엔드 레포**: [DevLink_Back](https://github.com/chu723204-coder)

<br />

## ⚙️ 로컬 실행 방법

### 사전 준비
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 레포지토리 클론
git clone https://github.com/chu723204-coder/DevLink_Front.git
cd DevLink_Front

# 2. 패키지 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일 열어서 값 입력

# 4. 개발 서버 실행
npm run dev
```

### 환경변수 설정 (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_KAKAO_CLIENT_ID=your_kakao_client_id
VITE_NAVER_CLIENT_ID=your_naver_client_id
```

<br />

## 🌿 브랜치 전략

```
main          # 최종 브랜치
test_table    # 개발 통합 브랜치 (테스트/오류 확인)
```

<br />

## 🛠 트러블슈팅

### 1. WebSocket 인증 401 오류
- **문제**: STOMP 메시지 전송 시 401 Unauthorized 에러 발생
- **원인**: SecurityConfig에서 `/ws/**` 경로를 차단하고 있었음
- **해결**: `/ws/**` permitAll 추가 + ChannelInterceptor로 STOMP 헤더에서 JWT 검증

### 2. 순환 참조 (Circular Dependency)
- **문제**: `chatService.ts`에서 `useAuthStore` import 시 순환 참조 오류
- **원인**: `api.ts` → `useAuthStore` → `chatService` 간 의존 순환
- **해결**: `useAuthStore.getState()`를 파라미터로 전달하는 방식으로 변경

### 3. 채팅 스크롤 버그
- **문제**: 새 메시지 수신 시 페이지 전체가 스크롤되는 현상
- **원인**: `scrollIntoView()` 사용으로 페이지 전체 스크롤 발생
- **해결**: `container.scrollTo()` 방식으로 변경하여 컨테이너 내부 스크롤만 동작

<br />

## 📅 개발 기간

2026.06.08 ~ 2026.06.22

<br />

## 📄 라이선스

MIT License
