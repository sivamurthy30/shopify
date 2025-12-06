'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoLogin() {
  const router = useRouter()

  useEffect(() => {
    // Set demo session in localStorage
    localStorage.setItem('demo_mode', 'true')
    localStorage.setItem('demo_user', JSON.stringify({
      email: 'demo@xeno.com',
      name: 'Demo User'
    }))
    
    // Redirect to demo dashboard
    router.push('/demo/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-neutral-800 border-t-emerald-400 mb-4"></div>
        <p className="text-neutral-500 text-sm">Loading demo...</p>
      </div>
    </div>
  )
}
