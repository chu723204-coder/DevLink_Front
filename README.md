# DevLink - 개발자 취준생 커뮤니티 플랫폼 (Frontend)

> 개발자 취준생을 위한 실시간 커뮤니티 플랫폼 프론트엔드

[![Backend Repo](https://img.shields.io/badge/Backend-Repository-green?style=for-the-badge)](https://github.com/chu723204-coder/DevLink_Back)

---

## 📌 1. 프로젝트 소개

기존 취준생 커뮤니티(오픈채팅, 카페 등)는 면접 후기, 스터디 모집, 기술 질문 등의 정보가 분산되어 있어 한 곳에서 찾기 어려운 불편함을 직접 경험했습니다.

이를 해결하기 위해 **개발자 취준생 특화 커뮤니티 플랫폼**을 기획했으며, 단순 CRUD를 넘어 실시간 알림, 실시간 채팅, 소셜 로그인, 신고/관리자 시스템까지 실무에 가까운 완성도 높은 서비스를 목표로 개발했습니다.

---

## 🗓 2. 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 개발 기간 | 2026.06.08 ~ 2026.06.22 (약 2주) |
| 팀 규모 | 1인 풀스택 개발 |
| 담당 역할 | 기획 · 설계 · 백엔드 · 프론트엔드 전 과정 단독 개발 |

---

## 🛠 3. 기술 스택

### Frontend
![React](https://img.shields.io/badge/react-18-%2361DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-pink?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2306B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Realtime
![WebSocket](https://img.shields.io/badge/websocket-STOMP-010101?style=for-the-badge)
![SSE](https://img.shields.io/badge/SSE-Server--Sent%20Events-orange?style=for-the-badge)

### Tools
![VS Code](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

---

## ⚙️ 4. 주요 기능

| 기능 | 설명 |
|------|------|
| 로그인/회원가입 | 이메일 인증 기반 회원가입 / 카카오·네이버 소셜 로그인 |
| 게시판 | 자유게시판 / 면접후기 / 기술질문 / 취업정보 CRUD |
| 스터디 모집 | 스터디 등록 / 지원 / 수락·거절 / 채팅방 자동 연동 |
| 실시간 채팅 | WebSocket STOMP 기반 스터디 팀 채팅 |
| 실시간 알림 | SSE 기반 댓글 / 좋아요 / 스터디 지원·수락·거절 알림 |
| 신고 시스템 | 게시글·댓글 신고 / 중복 신고 방지 |
| 마이페이지 | 프로필 수정 / 내 게시글 / 내 스터디 조회 |
| 관리자 페이지 | 회원 관리 / 게시글 관리 / 신고 처리 |

---

## 🗄 5. 시스템 구조

### 인증 흐름
```
로그인 요청
    → Access Token (Zustand 메모리 저장 / XSS 방지)
    → Refresh Token (HttpOnly Cookie 저장 / 탈취 방지)
    → API 요청 시 헤더에 Access Token 포함
    → 만료 시 자동 재발급
```

### 실시간 통신 구조
```
SSE (단방향) → 실시간 알림
WebSocket STOMP (양방향) → 실시간 채팅
```

---

## 🔍 6. 핵심 구현 내용

### Zustand 상태관리 선택 이유

Redux 대신 Zustand를 선택한 이유는 두 가지입니다.

- **코드 간결함**: Redux는 보일러플레이트 코드가 많고 설정이 복잡한 반면, Zustand는 코드가 간결하고 러닝커브가 낮음
- **Access Token 메모리 저장**: XSS 공격 방지를 위해 Access Token을 로컬스토리지가 아닌 Zustand 메모리에 저장하는 용도로 활용

---

### SSE vs WebSocket 기술 선택

| 기술 | 통신 방향 | 적용 기능 | 선택 이유 |
|------|----------|----------|----------|
| SSE | 서버 → 클라이언트 단방향 | 실시간 알림 | 알림은 서버에서 클라이언트로만 전달하면 충분 |
| WebSocket STOMP | 양방향 | 실시간 채팅 | 채팅은 클라이언트↔서버 양방향 통신 필요 |

기능 요구사항을 분석해 각 기능에 맞는 기술을 선택했습니다.

---

### JWT 듀얼토큰 구조

이전 ChargeNow 프로젝트에서 Access Token을 로컬스토리지에 저장했는데, 강사님으로부터 XSS 공격에 취약하다는 피드백을 받았습니다. 이를 개선하기 위해 DevLink에서는 아래와 같이 분리 설계했습니다.

| 토큰 | 저장 위치 | 이유 |
|------|----------|------|
| Access Token | Zustand 메모리 | XSS 공격 방지 |
| Refresh Token | HttpOnly Cookie | JS 접근 불가, 탈취 방지 |

---

## 🔧 7. 트러블슈팅

### ① WebSocket 인증 401 오류
- **문제**: STOMP 메시지 전송 시 401 Unauthorized 에러 발생
- **원인**: SecurityConfig에서 `/ws/**` 경로를 차단하고 있었음
- **해결**: `/ws/**` permitAll 추가 + ChannelInterceptor로 STOMP 헤더에서 JWT 검증

### ② 채팅 메시지 전송 안됨
- **문제**: 메시지 전송 후 채팅창에 아무것도 표시되지 않음
- **원인**: STOMP 연결/구독 설정이 제대로 되지 않았음
- **해결**: STOMP 연결 및 구독 설정 수정

### ③ 발신자/수신자 채팅 위치 동일
- **문제**: 내 메시지와 상대방 메시지가 같은 위치에 표시됨
- **원인**: isMine 구분 로직 미적용
- **해결**: isMine 조건 추가해 본인 메시지는 우측, 상대방은 좌측으로 구분

### ④ 메시지 2번씩 전송
- **문제**: 메시지 하나 보내면 두 개가 나타나는 현상
- **원인**: WebSocket 구독이 중복으로 등록됨
- **해결**: 구독 해제 처리 추가

### ⑤ 채팅 스크롤 버그
- **문제**: 새 메시지 수신 시 페이지 전체가 스크롤되는 현상
- **원인**: `scrollIntoView()` 사용으로 페이지 전체 스크롤 발생
- **해결**: `container.scrollTo()` 방식으로 변경해 채팅창 내부 스크롤만 동작

---

## 👤 8. 본인 기여

1인 풀스택 개발로 프론트엔드 전 과정을 단독 진행했습니다.

- React + TypeScript 기반 전체 UI 구현
- Zustand 전역 상태관리 설계 및 적용
- JWT 듀얼토큰 인증 플로우 구현
- WebSocket STOMP 실시간 채팅 UI 구현
- SSE 실시간 알림 UI 구현
- 카카오 / 네이버 소셜 로그인 연동
- 관리자 페이지 UI 전체 구현
- Tailwind CSS 기반 반응형 레이아웃 구현

---

## 🤝 9. Git 브랜치 전략

1인 개발 프로젝트로 아래 브랜치 전략을 적용했습니다.

- `main`: 최종 배포용 브랜치
- `test`: 기능 테스트용 브랜치
- `dev-csh`: 개인 개발 작업 브랜치

---

## 💬 10. 회고

### 잘된 점
- SSE + WebSocket STOMP 실시간 기능 완성
- JWT 듀얼토큰 인증 구조 프론트 연동 구현
- 1인 개발로 기획부터 프론트 전체 구현까지 단독 진행
- 신고 / 관리자 시스템으로 서비스 완성도 향상

### 아쉬운 점
- 배포 미완성 (로컬 실행 단계)
- 댓글 좋아요 / 대댓글 미구현
- 이미지 업로드 기능 미구현
- 테스트 코드 부재

### 향후 계획
- Railway + Vercel 배포 완성
- 검색 기능 추가
- 이미지 업로드 (S3 또는 Cloudinary)
- 단위 테스트 작성
