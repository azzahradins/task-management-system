import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { MainLayout } from '../layouts/MainLayout'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { PublicLayout } from '../layouts/PublicLayout'
import { ProtectedLayout } from '../layouts/ProtectedLayout'


function TaskListPage() {
	return <h1>Tasks</h1>
}

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
							<Route path="/tasks" element={<TaskListPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}
