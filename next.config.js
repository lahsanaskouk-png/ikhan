/** @type {import('next').NextConfig} */
const nextConfig = {
  // تغيير output إلى 'standalone' لتحسين الأداء على Netlify
  output: 'standalone',
  // تعطيل strict mode إذا كان يسبب مشاكل في التطوير، لكن يفضل تركه مفعلاً
  reactStrictMode: true,
  // إعدادات الصور إذا كنت تستخدم Next Image
  images: {
    domains: ['ocjxewdtihtlhckhrxit.supabase.co'],
  },
}

module.exports = nextConfig
