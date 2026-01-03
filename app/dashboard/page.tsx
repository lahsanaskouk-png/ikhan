'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import DashboardCard from '@/components/dashboard/DashboardCard'
import HorizontalScroll from '@/components/ui/HorizontalScroll'
import BottomNav from '@/components/layout/BottomNav'
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  Users,
  Clock,
  CreditCard
} from 'lucide-react'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', user?.phone)
        .single()
      return data
    },
    enabled: !!user
  })

  const { data: dailyEarnings } = useQuery({
    queryKey: ['daily-earnings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('earnings_log')
        .select('amount')
        .gte('created_at', new Date().toISOString().split('T')[0])
        .single()
      return data?.amount || 0
    }
  })

  const handleCheckin = async () => {
    // منطق تسجيل الحضور اليومي
    toast.success('تم تسجيل الحضور اليومي! +5 MAD')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، {user?.phone}</h1>
            <p className="text-slate-400">استمر في تحقيق الأرباح!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userData?.balance || 0} MAD</div>
            <div className="text-green-400 text-sm">+{dailyEarnings} MAD اليوم</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <DashboardCard
            icon={CreditCard}
            title="إيداع"
            value="شحن الرصيد"
            color="blue"
            href="/deposit"
          />
          <DashboardCard
            icon={Wallet}
            title="سحب"
            value="تحويل الأموال"
            color="green"
            href="/withdraw"
          />
          <DashboardCard
            icon={Gift}
            title="مكافأة اليوم"
            value="5 MAD"
            color="purple"
            onClick={handleCheckin}
          />
          <DashboardCard
            icon={Users}
            title="الإحالات"
            value="30% عمولة"
            color="orange"
            href="/referrals"
          />
        </div>

        {/* Products Horizontal Scroll */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">المنتجات المتاحة</h2>
          <HorizontalScroll />
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/30 rounded-xl p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Clock size={20} /> آخر النشاطات
          </h3>
          {/* قائمة النشاطات */}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Floating Telegram Button */}
      <a
        href="https://t.me/brixaofficial"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-32 right-6 bg-blue-500 p-4 rounded-full shadow-2xl hover:bg-blue-600 transition-all"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.461-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </a>
    </div>
  )
}
