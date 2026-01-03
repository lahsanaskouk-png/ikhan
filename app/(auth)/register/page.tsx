'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mathChallenge, setMathChallenge] = useState(generateMathChallenge())
  const [userAnswer, setUserAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function generateMathChallenge() {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operators = ['+', '-', '*']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    return { num1, num2, operator }
  }

  const handleRegister = async () => {
    // التحقق من صحة البيانات
    if (password.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      return
    }

    if (password !== confirmPassword) {
      toast.error('كلمات المرور غير متطابقة')
      return
    }

    // التحقق من التحدي الرياضي
    const correctAnswer = eval(`${mathChallenge.num1} ${mathChallenge.operator} ${mathChallenge.num2}`)
    if (parseInt(userAnswer) !== correctAnswer) {
      toast.error('الإجابة غير صحيحة')
      setMathChallenge(generateMathChallenge())
      return
    }

    setLoading(true)

    try {
      // التحقق من وجود المستخدم
      const { data: existingUser } = await supabase
        .from('users')
        .select('phone_number')
        .eq('phone_number', phone)
        .single()

      if (existingUser) {
        toast.error('رقم الهاتف مسجل بالفعل')
        return
      }

      // إنشاء الحساب
      const email = `${phone}@brixa.com`
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        phone,
      })

      if (authError) throw authError

      // إدخال بيانات المستخدم
      const { error: userError } = await supabase.from('users').insert({
        phone_number: phone,
        email,
        password: password, // في الواقع، يجب تشفيرها
        balance: 0,
        is_verified: false,
      })

      if (userError) throw userError

      toast.success('تم التسجيل بنجاح!')
      router.push('/dashboard')

    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء التسجيل')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Brixa</h1>
        <p className="text-slate-400 text-center mb-8">أنشئ حسابك الآن</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="06XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8 أحرف على الأقل"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* تحدي الرياضيات */}
          <div className="bg-slate-900/30 p-4 rounded-lg">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              تحقق من أنك لست روبوت
            </label>
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-white">
                {mathChallenge.num1} {mathChallenge.operator} {mathChallenge.num2} = ?
              </div>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                placeholder="الإجابة"
              />
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري الإنشاء...' : 'تسجيل'}
          </button>
        </div>
      </div>
    </div>
  )
}
