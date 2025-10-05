"use client"

import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { Sparkles, BarChart2, CalendarDays } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'

// Simple analog clock component
const AnalogClock = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const seconds = now.getSeconds()
  const minutes = now.getMinutes() + seconds / 60
  const hours = (now.getHours() % 12) + minutes / 60

  const hourDeg = hours * 30
  const minDeg = minutes * 6
  const secDeg = seconds * 6

  return (
    <div className='flex items-center justify-center'>
      <div className='relative rounded-full border border-border bg-card h-52 w-52 shadow-sm'>
        {/* markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className='absolute left-1/2 top-1/2 h-2 w-[2px] bg-muted-foreground/50 origin-bottom'
            style={{ transform: `rotate(${i * 30}deg) translate(-50%, -100px)` }}
          />
        ))}
        {/* hour hand */}
        <div
          className='absolute left-1/2 top-1/2 origin-bottom h-16 w-[3px] bg-foreground rounded'
          style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }}
        />
        {/* minute hand */}
        <div
          className='absolute left-1/2 top-1/2 origin-bottom h-20 w-[2px] bg-foreground/80 rounded'
          style={{ transform: `translate(-50%, -100%) rotate(${minDeg}deg)` }}
        />
        {/* second hand */}
        <div
          className='absolute left-1/2 top-1/2 origin-bottom h-24 w-[1.5px] bg-primary rounded'
          style={{ transform: `translate(-50%, -100%) rotate(${secDeg}deg)` }}
        />
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary' />
      </div>
    </div>
  )
}

// Lightweight calendar for current month
const CalendarCard = () => {
  const [viewDate, setViewDate] = useState(new Date())

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()
  const today = new Date()

  const days = []
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const monthLabel = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const onPrev = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }
  const onNext = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  return (
    <div className='bg-card border border-border rounded-xl p-5'>
      <div className='flex items-center justify-between mb-3'>
        <button onClick={onPrev} className='px-2 py-1 text-sm rounded border border-border hover:bg-accent'>
          ◀
        </button>
        <h4 className='font-semibold text-card-foreground'>{monthLabel}</h4>
        <button onClick={onNext} className='px-2 py-1 text-sm rounded border border-border hover:bg-accent'>
          ▶
        </button>
      </div>
      <div className='grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className='py-1'>{d}</div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-2 mt-2'>
        {days.map((d, idx) => {
          const isToday = !!d && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear() && d === today.getDate()
          if (!d) {
            return <div key={idx} className='h-9 rounded-md opacity-0 pointer-events-none' />
          }
          return (
            <div
              key={idx}
              className={`h-9 flex items-center justify-center rounded-md border text-sm transition-colors ${isToday
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
            >
              <span>{d}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useUser()
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return
      setLoading(true)
      const { data } = await supabase
        .from('interviews')
        .select('created_at, questionList')
        .eq('userEmail', user.email)
        .order('created_at', { ascending: true })
      setInterviews(data || [])
      setLoading(false)
    }
    fetchData()
  }, [user?.email])

  const stats = useMemo(() => {
    const total = interviews.length
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const thisWeek = interviews.filter(i => {
      const createdAt = i?.created_at ? new Date(i.created_at) : null
      return createdAt && createdAt >= startOfWeek
    }).length
    const avgQuestions = Math.round(
      (interviews.reduce((sum, i) => sum + (i?.questionList?.length || 0), 0) / (total || 1)) || 0
    )

    // last 6 weeks histogram
    const weeks = Array.from({ length: 6 }).map((_, idx) => {
      const end = new Date(now)
      end.setDate(end.getDate() - (idx * 7))
      const start = new Date(end)
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      const count = interviews.filter(i => {
        const d = i?.created_at ? new Date(i.created_at) : null
        return d && d >= start && d <= end
      }).length
      return { label: `W${6 - idx}`, count }
    }).reverse()

    return { total, thisWeek, avgQuestions, weeks }
  }, [interviews])

  return (
    <div>
      <WelcomeContainer />

      {/* Calendar & Clock */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
        <CalendarCard />
        <div className='bg-card border border-border rounded-xl p-5'>
          <h3 className='font-semibold text-card-foreground mb-3'>Current Time</h3>
          <AnalogClock />
        </div>
      </div>

      {/* Top CTA + Stats */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 my-4'>
        <div className='lg:col-span-2 bg-card border border-border rounded-xl p-5'>
          <div className='flex items-center gap-3'>
            <Sparkles className='h-6 w-6 text-primary' />
            <h3 className='font-semibold text-card-foreground'>Quick Start</h3>
          </div>
          <p className='text-muted-foreground mt-1'>Spin up an AI interview in seconds. Credits: <span className='text-foreground font-medium'>{user?.credits ?? '—'}</span></p>
          <div className='mt-3'>
            <CreateOptions />
          </div>
          {/* Pro tips to fill space and guide the user */}
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <div className='rounded-lg border border-border bg-background/40 p-3'>
              <p className='text-xs text-muted-foreground'>Tip</p>
              <p className='text-sm text-card-foreground mt-2'>Use a detailed job description for better questions.</p>
            </div>
            <div className='rounded-lg border border-border bg-background/40 p-3'>
              <p className='text-xs text-muted-foreground'>Tip</p>
              <p className='text-sm text-card-foreground mt-2'>Review AI feedback in Completed view after each session.</p>
            </div>
            <div className='rounded-lg border border-border bg-background/40 p-3'>
              <p className='text-xs text-muted-foreground'>Tip</p>
              <p className='text-sm text-card-foreground mt-2'>Share links via WhatsApp or Email directly.</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-6'>
          <div className='flex items-center gap-3 mb-3'>
            <BarChart2 className='h-6 w-6 text-primary' />
            <h3 className='font-semibold text-card-foreground'>Overview</h3>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-lg bg-muted p-3 text-center'>
              <p className='text-xs text-muted-foreground'>Total</p>
              <p className='text-lg font-bold text-foreground'>{loading ? '—' : stats.total}</p>
            </div>
            <div className='rounded-lg bg-muted p-3 text-center'>
              <p className='text-xs text-muted-foreground'>This Week</p>
              <p className='text-lg font-bold text-foreground'>{loading ? '—' : stats.thisWeek}</p>
            </div>
            <div className='rounded-lg bg-muted p-3 text-center'>
              <p className='text-xs text-muted-foreground'>Avg Qs</p>
              <p className='text-lg font-bold text-foreground'>{loading ? '—' : stats.avgQuestions}</p>
            </div>
          </div>
          <div className='mt-4'>
            <div className='flex items-end gap-2 h-24'>
              {stats.weeks.map((w, idx) => {
                const clamped = Math.max(2, Math.min(100, (w.count || 0) * 20))
                return (
                  <div key={idx} className='flex-1 flex flex-col items-center justify-end'>
                    <div className='w-full bg-primary/20 rounded-t-md'>
                      <div className='w-full bg-primary rounded-t-md' style={{ height: `${clamped}%` }}></div>
                    </div>
                    <p className='text-[10px] text-center text-muted-foreground mt-1'>{w.label}</p>
                  </div>
                )
              })}
            </div>
            <p className='text-[11px] text-muted-foreground flex items-center gap-1 mt-1'><CalendarDays className='h-3 w-3' /> Last 6 weeks</p>
          </div>
        </div>
      </div>

      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard
