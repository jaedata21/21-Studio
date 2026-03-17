'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Images, FolderOpen, Camera,
  FileText, Settings, LogOut, Menu, X,
  ChevronRight, Eye, Layers,
} from 'lucide-react'

const nav = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard, desc: 'Overview & stats' },
  { href: '/admin/galleries', label: 'Galleries',  icon: FolderOpen,      desc: 'Manage photo collections' },
  { href: '/admin/photos',    label: 'Photos',     icon: Images,          desc: 'Upload & organise' },
  { href: '/admin/sessions',  label: 'Sessions',   icon: Camera,          desc: 'Packages & pricing' },
  { href: '/admin/content',   label: 'Content',    icon: FileText,        desc: 'Edit site text' },
  { href: '/admin/sections',  label: 'Homepage',   icon: Layers,          desc: 'Reorder sections' },
  { href: '/admin/settings',  label: 'Settings',   icon: Settings,        desc: 'Logo & account' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading') return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#b8975a]/30 border-t-[#b8975a] rounded-full animate-spin" />
    </div>
  )
  if (!session) return null

  const isLogin = pathname === '/admin/login'
  if (isLogin) return <>{children}</>

  const activePage = nav.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex" style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.06] shrink-0">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-[#b8975a] flex items-center justify-center shrink-0">
              <span className="text-[#080808] text-[.65rem] font-bold tracking-tight">21</span>
            </div>
            <span className="text-sm text-white tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
              Studios
            </span>
          </Link>
          <span className="ml-auto text-[.5rem] tracking-[.18em] uppercase text-[#444] border border-white/[0.07] px-2 py-0.5 rounded-sm">
            CMS
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-200 group relative ${
                  active
                    ? 'bg-[#b8975a]/10 text-[#b8975a]'
                    : 'text-[#666] hover:text-white hover:bg-white/[0.04]'
                }`}>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#b8975a] rounded-r" />}
                <Icon size={15} className={`shrink-0 ${active ? 'text-[#b8975a]' : 'text-[#444] group-hover:text-[#888]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-normal text-[.8rem]">{label}</div>
                  <div className={`text-[.6rem] truncate mt-0.5 ${active ? 'text-[#b8975a]/60' : 'text-[#444]'}`}>{desc}</div>
                </div>
                {active && <ChevronRight size={11} className="text-[#b8975a]/50 shrink-0" />}
              </Link>
            )
          })}
        </nav>

        {/* View site link */}
        <div className="px-3 pb-2">
          <Link href="/" target="_blank"
            className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-[#444] hover:text-white hover:bg-white/[0.04] transition-all text-xs group">
            <Eye size={13} className="group-hover:text-[#b8975a] transition-colors" />
            View live site
            <span className="ml-auto text-[.55rem] text-[#333]">↗</span>
          </Link>
        </div>

        {/* User */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-sm">
            <div className="w-7 h-7 rounded-full bg-[#b8975a]/20 border border-[#b8975a]/30 flex items-center justify-center shrink-0">
              <span className="text-[.65rem] text-[#b8975a] font-medium">{session.user.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate leading-tight">{session.user.name}</p>
              <p className="text-[.55rem] text-[#444] truncate mt-0.5">{session.user.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
              title="Sign out"
              className="text-[#333] hover:text-red-400 transition-colors p-1">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/70 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 flex items-center px-5 border-b border-white/[0.06] bg-[#0a0a0a] shrink-0 sticky top-0 z-30">
          <button className="lg:hidden text-[#666] hover:text-white mr-4 transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <p className="text-sm text-white font-normal leading-tight">{activePage?.label || 'Admin'}</p>
            <p className="text-[.58rem] text-[#444] leading-tight">{activePage?.desc}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[.6rem] text-[#444] border border-white/[0.06] px-2.5 py-1.5 rounded-sm">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
