'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('admin@21studios.com')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) router.push('/admin')
    else setError('Invalid email or password.')
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4"
      style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-2xl tracking-[.2em]" style={{ fontFamily: 'Playfair Display, serif' }}>
            21 <span style={{ color: '#b8975a' }}>Studios</span>
          </p>
          <p className="text-[.6rem] tracking-[.25em] uppercase text-[#555] mt-1">Admin Portal</p>
        </div>

        {/* Lock icon */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 border border-[#b8975a]/20 bg-[#b8975a]/5 flex items-center justify-center">
            <Lock size={18} className="text-[#b8975a]" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-[.6rem] tracking-[.2em] uppercase text-[#b8975a] mb-2">
              Email Address
            </label>
            <input type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-[#b8975a] transition-colors"
              placeholder="admin@21studios.com" />
          </div>

          <div>
            <label className="block text-[.6rem] tracking-[.2em] uppercase text-[#b8975a] mb-2">
              Password
            </label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-white/15 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-[#b8975a] transition-colors pr-10"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-0 top-3 text-[#444] hover:text-white transition-colors">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[.7rem] text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-[#b8975a] text-[#080808] text-[.7rem] tracking-[.2em] uppercase font-medium hover:bg-[#d4b37a] disabled:opacity-60 transition-colors mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[.6rem] text-[#333] mt-8">
          Default: admin@21studios.com / admin123
        </p>
      </div>
    </div>
  )
}
