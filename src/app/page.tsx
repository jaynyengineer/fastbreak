import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'

// Force dynamic rendering to ensure middleware runs on every request
export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  // Handle email confirmation code - redirect to callback route
  const params = await searchParams
  
  if (params.code) {
    // Redirect to callback route to handle code exchange properly
    redirect(`/auth/callback?code=${params.code}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <nav className="container mx-auto px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center">
                <span className="text-black font-black text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FASTBREAK</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#" className="text-cyan-400 hover:text-cyan-300">AMATEUR</Link>
              <Link href="#" className="hover:text-cyan-400">PRO</Link>
              <Link href="#" className="hover:text-cyan-400">BRANDS</Link>
              <Link href="#" className="hover:text-cyan-400">PRODUCTS</Link>
              <Link href="#" className="hover:text-cyan-400">ROLE</Link>
              <Link href="#" className="hover:text-cyan-400">COMPANY</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-cyan-400">LOGIN</Link>
              <Link 
                href="/signup" 
                className="bg-cyan-400 text-black px-6 py-2 rounded font-semibold hover:bg-cyan-300 transition-colors"
              >
                CONTACT
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Sports Action"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] via-[#0a0e1a]/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-8 lg:px-16 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              THE ULTIMATE <span className="text-cyan-400">AI-POWERED</span> SPORTS OPERATIONS ENGINE
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Intelligent software for sports league scheduling, tournament management, and experiential sponsorship for brands.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 bg-cyan-400 text-black px-8 py-4 rounded font-bold text-lg hover:bg-cyan-300 transition-colors"
            >
              CHOOSE YOUR ROLE
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* AI-Driven Solutions Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0e1a] to-[#0d1420]">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="text-white">AI-DRIVEN </span>
              <span className="text-cyan-400">SOLUTIONS</span>
              <br />
              <span className="text-white">TO POWER YOUR GAME</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              From professional leagues to youth tournaments, Fastbreak&apos;s cutting-edge AI helps you optimize scheduling, enhance engagement, and maximize impact.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-cyan-400 text-2xl font-bold">01</span>
              <h3 className="text-2xl font-bold">Choose Your Role</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* PRO Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-xl p-8 hover:border-cyan-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center">
                  <span className="text-black font-black text-xs">F</span>
                </div>
                <div>
                  <div className="font-bold">FASTBREAK</div>
                  <div className="text-cyan-400 font-bold">PRO</div>
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg overflow-hidden mb-6 relative">
                <Image
                  src="/basketball.jpg"
                  alt="Professional Basketball"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold mb-3">Professional Leagues</h4>
              <p className="text-gray-400 mb-4">
                Advanced scheduling and operations for professional sports organizations
              </p>
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-2">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* CONNECT Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-xl p-8 hover:border-cyan-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center">
                  <span className="text-black font-black text-xs">F</span>
                </div>
                <div>
                  <div className="font-bold">FASTBREAK</div>
                  <div className="text-cyan-400 font-bold">CONNECT</div>
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg overflow-hidden mb-6 relative">
                <Image
                  src="/partnership.jpg"
                  alt="Brand Partnerships"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold mb-3">Brand Partnerships</h4>
              <p className="text-gray-400 mb-4">
                Connect brands with sports properties for meaningful sponsorships
              </p>
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-2">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* COMPETE Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-xl p-8 hover:border-cyan-400/50 transition-all group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-cyan-400 rounded flex items-center justify-center">
                  <span className="text-black font-black text-xs">F</span>
                </div>
                <div>
                  <div className="font-bold">FASTBREAK</div>
                  <div className="text-cyan-400 font-bold">COMPETE</div>
                </div>
              </div>
              <div className="h-48 bg-gradient-to-br from-cyan-500/20 to-green-600/20 rounded-lg overflow-hidden mb-6 relative">
                <Image
                  src="/amateur.jpg"
                  alt="Youth & Amateur Sports"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-xl font-bold mb-3">Youth & Amateur</h4>
              <p className="text-gray-400 mb-4">
                Tournament management for youth leagues and amateur competitions
              </p>
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-2">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070a12] border-t border-gray-800">
        <div className="container mx-auto px-8 lg:px-16 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-cyan-400 rounded flex items-center justify-center">
                  <span className="text-black font-black text-lg">F</span>
                </div>
                <div>
                  <div className="font-bold">FASTBREAK</div>
                  <div className="text-xs text-gray-400">ACCELERATE YOUR GAME</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Fastbreak Is The Ultimate AI-Powered Sports Engine
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-cyan-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-cyan-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-cyan-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </Link>
              </div>
            </div>

            {/* Products Column */}
            <div>
              <h4 className="font-bold mb-4 text-gray-400 text-sm">PRODUCTS</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">PRO SCHEDULE</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">PERFORM</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">COMPETE</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">CONNECT</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">PULSE</Link></li>
              </ul>
            </div>

            {/* Role Column */}
            <div>
              <h4 className="font-bold mb-4 text-gray-400 text-sm">ROLE</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">PRO SPORTS</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">YOUTH + AMATEUR SPORTS</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">TOURNAMENT + EVENT OPERATORS</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">CONSUMER BRANDS</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">SPORTS COMPLEXES</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-bold mb-4 text-gray-400 text-sm">COMPANY</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">ABOUT US</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">LEADERSHIP</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">BLOG</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">CAREERS</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-cyan-400">CONTACT</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © 2025 Fastbreak, Inc. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="#" className="text-gray-500 hover:text-cyan-400">PRIVACY POLICY</Link>
                <Link href="#" className="text-gray-500 hover:text-cyan-400">TERMS OF USE</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
