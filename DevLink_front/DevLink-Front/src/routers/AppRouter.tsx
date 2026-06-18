import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { Navigate } from 'react-router-dom'

import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import AuthModal from '../components/common/AuthModal'

import OAuth2RedirectPage from '../pages/OAuth2RedirectPage'
import PostListPage from '../pages/post/PostListPage'
import PostDetailPage from '../pages/post/PostDetailPage'
import PostWritePage from '../pages/post/PostWritePage'
import PostEditPage from '../pages/post/PostEditPage'
import StudyListPage from '../pages/study/StudyListPage'
import StudyDetailPage from '../pages/study/StudyDetailPage'
import StudyWritePage from '../pages/study/StudyWritePage'
import StudyEditPage from '../pages/study/StudyEditPage'
import MyPage from '../pages/mypage/MyPage'
import MyPostsPage from '../pages/mypage/MyPostsPage'
import MyStudiesPage from '../pages/mypage/MyStudiesPage'
import NotificationPage from '../pages/notification/NotificationPage'
import ChatListPage from '../pages/chat/ChatListPage'
import ChatRoomPage from '../pages/chat/ChatRoomPage'
import NoticeListPage from '../pages/notice/NoticeListPage'
import NoticeDetailPage from '../pages/notice/NoticeDetailPage'
import NoticeWritePage from '../pages/notice/NoticeWritePage'
import NoticeEditPage from '../pages/notice/NoticeEditPage'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminPostsPage from '../pages/admin/AdminPostsPage'
import AdminStudiesPage from '../pages/admin/AdminStudiesPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore()
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role } = useAuthStore()
  if (!isLoggedIn || role !== 'ROLE_ADMIN') return <Navigate to="/" replace />
  return <>{children}</>
}

function UserLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <AuthModal />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<PostListPage />} />

          {/* 게시판 */}
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="/posts/write" element={<PrivateRoute><PostWritePage /></PrivateRoute>} />
          <Route path="/posts/:postId/edit" element={<PrivateRoute><PostEditPage /></PrivateRoute>} />

          {/* 스터디 */}
          <Route path="/studies" element={<StudyListPage />} />
          <Route path="/studies/:studyId" element={<StudyDetailPage />} />
          <Route path="/studies/write" element={<PrivateRoute><StudyWritePage /></PrivateRoute>} />
          <Route path="/studies/:studyId/edit" element={<PrivateRoute><StudyEditPage /></PrivateRoute>} />

          {/* 공지사항 */}
          <Route path="/notices" element={<NoticeListPage />} />
          <Route path="/notices/write" element={<AdminRoute><NoticeWritePage /></AdminRoute>} />
          <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
          <Route path="/notices/:noticeId/edit" element={<AdminRoute><NoticeEditPage /></AdminRoute>} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/mypage/posts" element={<PrivateRoute><MyPostsPage /></PrivateRoute>} />
          <Route path="/mypage/studies" element={<PrivateRoute><MyStudiesPage /></PrivateRoute>} />

          {/* 알림 */}
          <Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} />

          {/* 채팅 */}
          <Route path="/chat" element={<PrivateRoute><ChatListPage /></PrivateRoute>} />
          <Route path="/chat/:roomId" element={<PrivateRoute><ChatRoomPage /></PrivateRoute>} />
        </Route>

        {/* 관리자 - 별도 레이아웃 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="studies" element={<AdminStudiesPage />} />
        </Route>

        {/* 소셜 로그인 리다이렉트 */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter