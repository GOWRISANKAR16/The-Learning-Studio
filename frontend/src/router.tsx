import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { FeatureUnavailablePage } from './pages/FeatureUnavailablePage'
import { AuthGuard } from './components/auth/AuthGuard'
import { CourseDetailsPage } from './pages/courses/CourseDetailsPage'
import { LearnPage } from './pages/learn/LearnPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { AssignmentsPage } from './pages/AssignmentsPage'
import { CartPage } from './pages/CartPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailsPage />} />

      <Route
        path="/profile"
        element={
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        }
      />
      <Route path="/messages" element={<FeatureUnavailablePage />} />
      <Route
        path="/assignments"
        element={
          <AuthGuard>
            <AssignmentsPage />
          </AuthGuard>
        }
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin" element={<FeatureUnavailablePage />} />
      <Route path="/admin/login" element={<FeatureUnavailablePage />} />
      <Route path="/admin/users" element={<FeatureUnavailablePage />} />
      <Route path="/admin/courses" element={<FeatureUnavailablePage />} />
      <Route path="/admin/assignments" element={<FeatureUnavailablePage />} />

      <Route
        path="/learn/:courseId"
        element={
          <AuthGuard>
            <LearnPage />
          </AuthGuard>
        }
      />
      <Route
        path="/learn/:courseId/lesson/:lessonId"
        element={
          <AuthGuard>
            <LearnPage />
          </AuthGuard>
        }
      />
    </Routes>
  )
}

