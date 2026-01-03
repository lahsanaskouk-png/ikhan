'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'

export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [rib, setRib] = useState('')
  const [fullName, setFullName] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(fileName, file)

    if (error) throw error
    return data.path
  }

  const handleSubmit = async () => {
    if (!amount || !rib || !fullName || !receipt) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    if (rib.length !== 24) {
      toast.error('رقم RIB يجب أن يكون 24 رقماً')
      return
    }

    setLoading(true)

    try {
      // رفع الإيصال
      const filePath = await handleFileUpload(receipt)

      // الحصول على رابط الإيصال
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      // إنشاء طلب الإيداع
      const { data: user } = await supabase.auth.getUser()

      const { error } = await supabase.from('deposits').insert({
        user_id: user.user?.id,
        amount: parseFloat(amount),
        status: 'pending',
        receipt_url: publicUrl,
        rib,
        full_name: fullName,
      })

      if (error) throw error

      toast.success('تم إرسال طلب الإيداع بنجاح')
      
      // إعادة تعيين الحقول
      setAmount('')
      setRib('')
      setFullName('')
      setReceipt(null)

    } catch (error: any) {
      toast.error('حدث خطأ: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">الإيداع</h1>

      <div className="space-y-6">
        {/* معلومات الحساب البنكي */}
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700">
          <h3 className="font-bold text-lg mb-4">معلومات التحويل البنكي</h3>
          <div className="space-y-2">
            <p><span className="text-slate-400">البنك:</span> CIH Bank</p>
            <p><span className="text-slate-400">اسم الحساب:</span> Hassouna40</p>
            <p><span className="text-slate-400">رقم الحساب:</span> 6383737211029400</p>
          </div>
        </div>

        {/* نموذج الإيداع */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">المبلغ (MAD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3"
              placeholder="أدخل المبلغ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رقم RIB (24 رقم)</label>
            <input
              type="text"
              value={rib}
              onChange={(e) => setRib(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3"
              placeholder="6383737211029400"
              maxLength={24}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الاسم الكامل (بالفرنسية)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">صورة الإيداع</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReceipt(e.target.files?.[0] || null)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال طلب الإيداع'}
          </button>
        </div>
      </div>
    </div>
  )
}
