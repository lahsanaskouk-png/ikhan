'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Copy, Share2, Users, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export default function ReferralSystem() {
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState([])

  const generateReferralCode = async () => {
    const { data: user } = await supabase.auth.getUser()
    const code = `BRIXA-${user.user?.id.slice(0, 8).toUpperCase()}`
    setReferralCode(code)
    
    // حفظ الكود في قاعدة البيانات
    await supabase.from('referrals').upsert({
      user_id: user.user?.id,
      referral_code: code,
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${referralCode}`)
    toast.success('تم نسخ رابط الإحالة')
  }

  const shareReferral = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'انضم إلى Brixa',
        text: 'احصل على 30% عمولة على إحالاتك',
        url: `${window.location.origin}/register?ref=${referralCode}`,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* رابط الإحالة */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">ربح مع الإحالات</h3>
            <p className="text-slate-300 text-sm">احصل على عمولات تصل إلى 30%</p>
          </div>
          <Users className="text-purple-400" size={32} />
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">رابط الإحالة:</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <Copy size={18} /> نسخ
              </button>
            </div>
            <div className="mt-2 p-3 bg-slate-900 rounded-lg text-sm break-all">
              {referralCode || 'انقر على إنشاء رابط'}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateReferralCode}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all"
            >
              إنشاء رابط
            </button>
            <button
              onClick={shareReferral}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={20} /> مشاركة
            </button>
          </div>
        </div>
      </div>

      {/* مستويات العمولات */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">30%</div>
          <div className="text-sm text-slate-400">المستوى الأول</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">1%</div>
          <div className="text-sm text-slate-400">المستوى الثاني</div>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">1%</div>
          <div className="text-sm text-slate-400">المستوى الثالث</div>
        </div>
      </div>

      {/* إحصائيات الإحالات */}
      <div className="bg-slate-800/30 rounded-xl p-6">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> إحصائيات الإحالات
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-300">إجمالي الإحالات</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">إجمالي العمولات</span>
            <span className="font-bold text-green-400">0 MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">الإحالات النشطة</span>
            <span className="font-bold">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
