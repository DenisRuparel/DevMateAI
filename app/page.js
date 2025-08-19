"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from './provider'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/services/supabaseClient'
import { User, LogOut, LayoutDashboard, ChevronDown, Sun, Moon, Monitor } from 'lucide-react'

export default function Home() {
  const { user } = useUser()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
      } else {
        setIsDropdownOpen(false)
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDashboardClick = () => {
    setIsDropdownOpen(false)
    router.push('/dashboard')
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Minimal Header */}
      <header className="relative z-50 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <span className="text-2xl font-bold text-white">DevMate AI</span>
        </div>
        
        <div className="flex items-center space-x-3">

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-2xl transition-all duration-300 border border-white/20"
              >
                {user.picture ? (
                  <Image 
                    src={user.picture} 
                    alt="Profile" 
                    width={32} 
                    height={32} 
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-white font-medium text-sm hidden md:block">
                  {user.name || user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl z-50">
                  <div className="py-2">
                    <button
                      onClick={handleDashboardClick}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth">
              <Button className="group bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-100">
                <span className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 md:px-12 py-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* 3D Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl transform rotate-45 animate-bounce opacity-20"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-60 left-1/4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-lg transform rotate-12 animate-spin opacity-25" style={{animationDuration: '8s'}}></div>

          <div className="mb-8">
            <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/80 text-sm font-medium mb-8">
              🚀 The Future of AI Interviews is Here
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
            <span className="block">Transform</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-pulse">
              Interviews
            </span>
            <span className="block">with AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
            Experience next-generation hiring with our revolutionary AI-powered interview platform. 
            <br className="hidden md:block" />
            Discover talent like never before with intelligent automation.
          </p>

          <div className="flex justify-center mb-20">
            <Link href="/auth">
              <Button size="lg" className="group relative text-lg px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>

          {/* 3D Hero Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl transform scale-110"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                    {/* 3D Interview Scene */}
                    <div className="flex items-center justify-center space-x-6 mb-6">
                      {/* Interviewer Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">👩‍💼</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      
                      {/* Connection Line */}
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                      </div>
                      
                      {/* Candidate Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl">👨‍💻</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full border-2 border-white animate-pulse delay-500"></div>
                      </div>
                    </div>
                    
                    {/* AI Processing Indicator */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">AI Processing...</span>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold group-hover:text-green-300 transition-colors duration-300">Voice Analysis Complete</h3>
                      <p className="text-gray-400 text-sm">Conversation insights generated</p>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full w-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300">Lightning Fast</h3>
                      <p className="text-gray-400 text-sm">60% faster than traditional interviews</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-xs text-purple-300 font-medium">Processing...</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                      <div className="text-2xl font-bold text-cyan-400">98%</div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
                      <div className="text-2xl font-bold text-purple-400">10k+</div>
                      <div className="text-xs text-gray-400">Interviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Features Section */}
        <section className="mt-40">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Why Choose
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                DevMate AI?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary AI technology that transforms how you discover and evaluate talent
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: "🎤",
                title: "Voice-Powered Interviews",
                description: "Natural voice conversations powered by Vapi's advanced voice agent technology for seamless candidate interactions.",
                gradient: "from-blue-500 to-cyan-500",
                delay: "0s"
              },
              {
                icon: "🧠",
                title: "Google Gemini AI",
                description: "Leverage Google's powerful Gemini AI to analyze conversations and generate intelligent interview feedback.",
                gradient: "from-purple-500 to-pink-500",
                delay: "0.2s"
              },
              {
                icon: "⚡",
                title: "Real-time Processing",
                description: "Instant conversation analysis and feedback generation using cutting-edge AI APIs for faster hiring decisions.",
                gradient: "from-green-500 to-blue-500",
                delay: "0.4s"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative"
                style={{animationDelay: feature.delay}}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-opacity duration-500" 
                     style={{background: `linear-gradient(135deg, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-6 text-3xl transform group-hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3D CTA Section */}
        <section className="mt-40 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-16 border border-white/20 text-center overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute top-20 right-20 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-1/3 w-8 h-8 bg-cyan-400 rounded-lg transform rotate-45 animate-bounce"></div>
            <div className="absolute top-1/2 right-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-20 right-1/4 w-5 h-5 bg-green-400 rounded-full animate-bounce delay-1000"></div>
            
            {/* Voice Wave Animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 bg-white rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 40 + 20}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  ></div>
                ))}
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 relative z-10">
              Ready to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Transform
              </span>
              Your Interviews?
            </h2>
            <p className="text-xl text-gray-300 mb-12 opacity-90 max-w-3xl mx-auto relative z-10">
              Start conducting voice-powered interviews with Google Gemini AI and Vapi technology. 
              Experience the future of recruitment today.
            </p>
            
            {/* Enhanced Stats */}
            <div className="flex justify-center items-center space-x-8 mb-12 relative z-10">
              <div className="text-center group">
                <div className="text-3xl font-bold text-cyan-400 group-hover:scale-110 transition-transform duration-300">5min</div>
                <div className="text-sm text-gray-400">Setup Time</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform duration-300">60%</div>
                <div className="text-sm text-gray-400">Faster Hiring</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-gray-400">Available</div>
              </div>
            </div>
            
            <Link href="/auth">
              <Button size="lg" className="group relative text-xl px-16 py-8 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 rounded-full shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-110 transition-all duration-300 relative z-10">
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Start Your Journey</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Button>
            </Link>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex justify-center items-center space-x-6 opacity-60 relative z-10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-400">No Credit Card Required</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Free Trial Available</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3D Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/10 py-16 mt-40">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12">
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
            <span className="text-3xl font-bold text-white">DevMate AI</span>
          </div>
          <p className="text-gray-400 text-lg">
            © {new Date().getFullYear()} DevMate AI. All rights reserved. Transform interviews with intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
