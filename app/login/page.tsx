'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// دالة لتوليد تحدي رياضي بسيط
function generateMathChallenge() {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  const operators = ['+', '-', '*']
  const operator = operators[Math.floor(Math.random() * operators.length)]
  let answer
  switch (operator) {
    case '+':
      answer = num1 + num2
      break
    case '-':
      answer = num1 - num2
      break
    case '*':
      answer = num1 * num2
      break
    default:
      answer = num1 + num2
  }
  return { question: `${num1} ${operator} ${num2}`, answer }
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [mathChallenge, setMathChallenge] = useState(generateMathChallenge())
  const [mathAnswer, setMathAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    if (!phone || !password) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    if (parseInt(mathAnswer) !== mathChallenge.answer) {
      toast.error('الإجابة على السؤال الرياضي غير صحيحة')
      setMathChallenge(generateMathChallenge())
      return
    }

    setLoading(true)

    if (isLogin) {
      // تسجيل الدخول
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('تم تسجيل الدخول بنجاح')
        router.push('/dashboard')
      }
    } else {
      // التسجيل
      // أولاً، نتحقق من وجود المستخدم مسبقاً
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('phone_number')
        .eq('phone_number', phone)
        .single()

      if (existingUser) {
        toast.error('رقم الهاتف مسجل مسبقاً')
        setLoading(false)
        return
      }

      // إنشاء المستخدم
      const email = `${phone}@brixa.com`
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            phone,
            email,
          },
        },
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('تم التسجيل بنجاح. يرجى تسجيل الدخول.')
        setIsLogin(true)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Brixa</h1>
        <p className="text-gray-400 text-center mb-8">منصة الأرباح الذكية</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="06XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="أكثر من 8 أحرف"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              تحقق: {mathChallenge.question} = ?
            </label>
            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="الإجابة"
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'التسجيل'}
          </button>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setMathChallenge(generateMathChallenge())
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل الدخول'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
