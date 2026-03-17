'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('admin@21studios.com')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) router.push('/admin')
    else setError('Invalid email or password.')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Outfit, sans-serif' }}>
      <div style={{ width:'100%', maxWidth:'360px', padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <p style={{ fontSize:'1.5rem', letterSpacing:'.2em', color:'white', fontFamily:'Playfair Display, serif' }}>
            21 <span style={{ color:'#b8975a' }}>Studios</span>
          </p>
          <p style={{ fontSize:'.65rem', letterSpacing:'.25em', textTransform:'uppercase', color:'#555', marginTop:'4px' }}>Admin Portal</p>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom:'20px' }}>
            <label style={{ display:'block', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#b8975a', marginBottom:'8px' }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              style={{ width:'100%', background:'transparent', border:'none', borderBottom:'1px solid rgba(255,255,255,.15)', padding:'12px 0', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:'#b8975a', marginBottom:'8px' }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width:'100%', background:'transparent', border:'none', borderBottom:'1px solid rgba(255,255,255,.15)', padding:'12px 0', color:'white', fontSize:'14px', outline:'none', boxSizing:'border-box' }} />
          </div>
          {error && <p style={{ color:'#f87171', fontSize:'.75rem', marginBottom:'16px' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ width:'100%', padding:'14px', background:'#b8975a', color:'#080808', fontSize:'.7rem', letterSpacing:'.2em', textTransform:'uppercase', border:'none', cursor:'pointer', opacity: loading ? .6 : 1 }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign:'center', fontSize:'.6rem', color:'#333', marginTop:'24px' }}>admin@21studios.com / admin123</p>
      </div>
    </div>
  )
}
