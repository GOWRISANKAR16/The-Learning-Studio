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
import { StaticContentPage } from './pages/StaticContentPage'

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
      <Route path="/about" element={<StaticContentPage slug="about" />} />
      <Route path="/careers" element={<StaticContentPage slug="careers" />} />
      <Route path="/contact" element={<StaticContentPage slug="contact" />} />
      <Route path="/blog" element={<StaticContentPage slug="blog" />} />
      <Route path="/get-the-app" element={<StaticContentPage slug="get-the-app" />} />
      <Route path="/teach" element={<StaticContentPage slug="teach" />} />
      <Route path="/plans-pricing" element={<StaticContentPage slug="plans-pricing" />} />
      <Route path="/help-support" element={<StaticContentPage slug="help-support" />} />
      <Route path="/business" element={<StaticContentPage slug="business" />} />
      <Route path="/accessibility" element={<StaticContentPage slug="accessibility" />} />
      <Route path="/privacy" element={<StaticContentPage slug="privacy" />} />
      <Route path="/sitemap" element={<StaticContentPage slug="sitemap" />} />
      <Route path="/terms" element={<StaticContentPage slug="terms" />} />
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

