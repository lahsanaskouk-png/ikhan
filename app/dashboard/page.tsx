'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import BottomNav from '@/components/BottomNav'
import DashboardCard from '@/components/DashboardCard'
import EarningsChart from '@/components/EarningsChart'
import ProductsHorizontalScroll from '@/components/ProductsHorizontalScroll'
import BalanceLog from '@/components/BalanceLog'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState(0)
  const [dailyEarnings, setDailyEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      // جلب بيانات المستخدم من جدول users
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', user.phone)
        .single()

      if (error) {
        toast.error('خطأ في تحميل بيانات المستخدم')
      } else {
        setBalance(userData.balance)
        // هنا يمكن جلب الأرباح اليومية من جدول earnings_log
        // مؤقتاً، لنضع قيمة افتراضية
        setDailyEarnings(5)
      }

      setLoading(false)
    }

    fetchUser()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، {user?.phone}</h1>
            <p className="text-gray-400">استمر في تحقيق الأرباح!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{balance.toFixed(2)} MAD</div>
            <div className="text-green-400">+{dailyEarnings.toFixed(2)} MAD اليوم</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <DashboardCard title="الإيداعات" value="0" subtitle="المعلقة: 0" color="blue" />
          <DashboardCard title="السحوبات" value="0" subtitle="المعلقة: 0" color="green" />
          <DashboardCard title="المكافآت" value="5" subtitle="MAD/يوم" color="purple" />
          <DashboardCard title="الإحالات" value="0" subtitle="عمولات: 0" color="orange" />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">الأرباح اليومية</h2>
          <EarningsChart />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">المنتجات المتاحة</h2>
          <ProductsHorizontalScroll />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">سجل التعديلات على الرصيد</h2>
          <BalanceLog />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
