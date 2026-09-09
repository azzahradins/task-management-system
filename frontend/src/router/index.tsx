import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { MainLayout } from '../layouts/MainLayout'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { TaskPage } from '../pages/TaskPage'
import { PublicLayout } from '../layouts/PublicLayout'
import { ProtectedLayout } from '../layouts/ProtectedLayout'

function NotFoundPage() {
	return <h1>Page not found</h1>
}

export function AppRouter() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route element={<MainLayout />}>
						<Route element={<PublicLayout />}>
							<Route path="/login" element={<LoginPage />} />
							<Route path="/register" element={<RegisterPage />} />
						</Route>
						<Route element={<ProtectedLayout />}>
							<Route path="/" element={<Navigate to="/tasks" replace />} />
							<Route path="/tasks" element={<TaskPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}
