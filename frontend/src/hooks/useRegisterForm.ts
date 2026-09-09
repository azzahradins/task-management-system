import axios from 'axios'
import { useState, type ChangeEvent, type SubmitEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/authService'
import { getFormErrors, type FormErrors } from '../validation/formErrors'
import {
	registerSchema,
	type RegisterFormValues,
} from '../validation/authSchemas'

type RegisterFormErrors = FormErrors<keyof RegisterFormValues>

const initialValues: RegisterFormValues = {
	email: '',
  username: '',
	password: '',
}

export function useRegisterForm() {
	const navigate = useNavigate()
	const [values, setValues] = useState<RegisterFormValues>(initialValues)
	const [errors, setErrors] = useState<RegisterFormErrors>({})
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
		const result = registerSchema.safeParse(values)
		const nextErrors = result.success
			? {}
			: getFormErrors<keyof RegisterFormValues>(result.error.issues)
		setErrors(nextErrors)
		setSubmitError('')

		if (Object.keys(nextErrors).length > 0) {
			return
		}

		setIsSubmitting(true)

		try {
			await register(values)
			navigate('/login', { replace: true })
		} catch (error) {
			if (axios.isAxiosError<{ message?: string }>(error)) {
				setSubmitError(
					error.response?.data?.message ?? 'Unable to register. Please try again.',
				)
				return
			}

			setSubmitError(
				error instanceof Error ? error.message : 'Unable to register. Please try again.',
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
