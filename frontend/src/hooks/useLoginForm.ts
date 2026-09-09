import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { ChangeEvent, SubmitEventHandler } from 'react'
import { useAuth } from './useAuth'
import { login } from '../services/authService'
import {
	getFormErrors,
	loginSchema,
	type FormErrors,
	type LoginFormValues,
} from '../validation/authSchemas'

type LoginFormErrors = FormErrors<keyof LoginFormValues>

const initialValues: LoginFormValues = {
	email: '',
	password: '',
}

export function useLoginForm() {
	const navigate = useNavigate()
	const { setToken } = useAuth()
	const [values, setValues] = useState<LoginFormValues>(initialValues)
	const [errors, setErrors] = useState<LoginFormErrors>({})
	const [submitError, setSubmitError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target

		setValues((currentValues) => ({
			...currentValues,
			[name]: value,
		}))

		setErrors((currentErrors) => ({
			...currentErrors,
			[name]: undefined,
		}))
		setSubmitError('')
	}

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
		const result = loginSchema.safeParse(values)
		const nextErrors = result.success
			? {}
			: getFormErrors<keyof LoginFormValues>(result.error.issues)
		setErrors(nextErrors)
		setSubmitError('')

		if (Object.keys(nextErrors).length > 0) {
			return
		}

		setIsSubmitting(true)

		try {
			const response = await login(values)
			setToken(response.data.token)
			navigate('/tasks', { replace: true })
		} catch (error) {
			if (axios.isAxiosError<{ message?: string }>(error)) {
				setSubmitError(
					error.response?.data?.message ?? 'Unable to sign in. Please try again.',
				)
				return
			}

			setSubmitError(
				error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		errors,
		handleChange,
		handleSubmit,
		isSubmitting,
		submitError,
		values,
	}
}
