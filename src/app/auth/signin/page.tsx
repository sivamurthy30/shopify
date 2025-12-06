'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg"></div>
            <span className="text-xl font-semibold text-white">Xeno</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-8 mb-2">Welcome back</h1>
          <p className="text-neutral-400">Sign in to your account to continue</p>
        </div>
        
        <div className="border border-neutral-800 rounded-2xl p-8 bg-neutral-900/30">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-neutral-950 py-3 rounded-xl hover:bg-neutral-100 transition-all disabled:opacity-50 font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-white hover:text-emerald-400 transition-colors font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
