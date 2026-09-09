import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { TextField } from '../components/TextField'
import { useRegisterForm } from '../hooks/useRegisterForm'

export function RegisterPage() {
  const {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    submitError,
    values,
  } = useRegisterForm()

  return (
    <div className="mx-auto flex min-h-[100vh] w-full max-w-md items-center justify-center">
      <div className="w-full rounded-2xl bg-surface p-6 shadow-xl shadow-surface-shadow/70 sm:p-8">
        {/* Header Text */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading">
            Task Management System
          </h1>
          <p className="mt-3 text-sm text-body">
            Register to start managing your tasks.
          </p>
        </div>

        {/* Form & Submission */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            error={errors.username}
            id="username"
            label="Username"
            name="username"
            onChange={handleChange}
            placeholder="John Doe"
            type="text"
            value={values.username}
          />

          <TextField
            error={errors.email}
            id="email"
            label="Email address"
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            value={values.email}
          />

          <TextField
            error={errors.password}
            id="password"
            label="Password"
            name="password"
            onChange={handleChange}
            placeholder="VerySecurePassword"
            type="password"
            value={values.password}
          />

          {submitError && (
            <p className="text-sm text-error" role="alert">
              {submitError}
            </p>
          )}

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        <p className="align-middle text-center mt-3 text-sm">
          Already have an account?
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline pl-1"
            to="/login"
          >
            login
          </Link>
        </p>
      </div>
    </div>
  )
}