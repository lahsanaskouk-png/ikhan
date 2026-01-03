'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import BottomNav from '@/components/BottomNav'

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [rib, setRib] = useState('')
  const [fullName, setFullName] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDeposit = async () => {
    if (!amount || !rib || !fullName || !receipt) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    if (rib.length !== 24) {
      toast.error('رقم RIB يجب أن يكون 24 رقمًا')
      return
    }

    setLoading(true)

    // رفع صورة الإيداع
    const fileExt = receipt.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, receipt)

    if (uploadError) {
      toast.error('فشل في رفع الصورة')
      setLoading(false)
      return
    }

    // الحصول على رابط الصورة
    const { data: urlData } = supabase.storage.from('receipts').getPublicUrl(fileName)
    const receiptUrl = urlData.publicUrl

    // إضافة طلب الإيداع في قاعدة البيانات
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً')
      return
    }

    const { error } = await supabase.from('deposits').insert({
      user_id: user.id,
      amount: parseFloat(amount),
      status: 'pending',
      receipt_url: receiptUrl,
      rib,
      full_name: fullName,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('تم إرسال طلب الإيداع بنجاح، في انتظار المراجعة')
      setAmount('')
      setRib('')
      setFullName('')
      setReceipt(null)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">الإيداع</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">المبلغ (MAD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="أدخل المبلغ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رقم RIB (24 رقمًا)</label>
            <input
              type="text"
              value={rib}
              onChange={(e) => setRib(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="6383737211029400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الاسم الكامل (بالفرنسية)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">صورة الإيداع (Screenshot)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReceipt(e.target.files?.[0] || null)}
              className="w-full p-4 bg-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="font-bold mb-2">معلومات الحساب البنكي</h3>
            <p>البنك: CIH Bank</p>
            <p>اسم الحساب: Hassouna40</p>
            <p>رقم الحساب: 6383737211029400</p>
          </div>

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب الإيداع'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
