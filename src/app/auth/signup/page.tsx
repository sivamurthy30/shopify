'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong')
      } else {
        router.push('/auth/signin?registered=true')
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
          <h1 className="text-3xl font-bold text-white mt-8 mb-2">Create account</h1>
          <p className="text-neutral-400">Get started with your free account</p>
        </div>
        
        <div className="border border-neutral-800 rounded-2xl p-8 bg-neutral-900/30">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 text-white transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-neutral-500 mt-2">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-neutral-950 py-3 rounded-xl hover:bg-neutral-100 transition-all disabled:opacity-50 font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-400 text-sm">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-white hover:text-emerald-400 transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
