import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate } from 'react-router-dom'

import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AuthModal from '../components/common/AuthModal'

import OAuth2RedirectPage from '../pages/OAuth2RedirectPage'

// 로그인 필요한 라우트
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore()
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />
}

// 관리자만 접근 가능한 라우트
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role } = useAuthStore()
  if (!isLoggedIn || role !== 'ROLE_ADMIN') return <Navigate to="/" replace />
  return <>{children}</>
}

// 공통 레이아웃
function UserLayout() {
  return (
    <>
      <Navbar />
      <AuthModal />
      <Outlet />
      <Footer />
    </>
  )
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          {/* 메인 */}
          <Route path="/" element={<div>메인 페이지 준비 중</div>} />

          {/* 게시판 - 개발 예정 */}
          {/* <Route path="/posts" element={<PostListPage />} /> */}
          {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
          {/* <Route path="/posts/write" element={<PrivateRoute><PostWritePage /></PrivateRoute>} /> */}

          {/* 스터디 - 개발 예정 */}
          {/* <Route path="/studies" element={<StudyListPage />} /> */}
          {/* <Route path="/studies/:id" element={<StudyDetailPage />} /> */}
          {/* <Route path="/studies/write" element={<PrivateRoute><StudyWritePage /></PrivateRoute>} /> */}

          {/* 채팅 - 개발 예정 */}
          {/* <Route path="/chat" element={<PrivateRoute><ChatListPage /></PrivateRoute>} /> */}
          {/* <Route path="/chat/:roomId" element={<PrivateRoute><ChatRoomPage /></PrivateRoute>} /> */}

          {/* 알림 - 개발 예정 */}
          {/* <Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} /> */}

          {/* 마이페이지 - 개발 예정 */}
          {/* <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} /> */}
          {/* <Route path="/mypage/posts" element={<PrivateRoute><MyPostsPage /></PrivateRoute>} /> */}
          {/* <Route path="/mypage/studies" element={<PrivateRoute><MyStudiesPage /></PrivateRoute>} /> */}
        </Route>

        {/* 소셜 로그인 리다이렉트 */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

        {/* 관리자 - 개발 예정 */}
        {/* <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
        {/* <Route path="/admin/members" element={<AdminRoute><AdminMemberPage /></AdminRoute>} /> */}
        {/* <Route path="/admin/posts" element={<AdminRoute><AdminPostPage /></AdminRoute>} /> */}
        {/* <Route path="/admin/notices" element={<AdminRoute><AdminNoticePage /></AdminRoute>} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter