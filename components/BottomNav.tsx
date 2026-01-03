'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CreditCard, Gift, Users, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'الرئيسية' },
    { href: '/deposit', icon: CreditCard, label: 'إيداع' },
    { href: '/withdraw', icon: CreditCard, label: 'سحب' },
    { href: '/referrals', icon: Users, label: 'إحالات' },
    { href: '/profile', icon: User, label: 'حسابي' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center ${isActive ? 'text-blue-400' : 'text-gray-400'}`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
