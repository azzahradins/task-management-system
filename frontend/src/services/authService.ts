import { apiClient } from './apiClient'

export type LoginCredentials = {
	email: string
	password: string
}

export type RegisterCredentials = LoginCredentials & {
	username: string
}

export type LoginResponse = {
	message: string
	data: {
		token: string
		duration: number
	}
}

export async function login(credentials: LoginCredentials) {
	const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
	return response.data
}

export async function register(credentials: RegisterCredentials) {
	const response = await apiClient.post<{ message: string }>('/auth/register', credentials)
	return response.data
}   

export async function logout() {
	await apiClient.post('/auth/logout')
}
