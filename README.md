# Pandizot Shop - E-Ticaret Platformu

Modern, yüksek teknoloji odaklı pandizot (araç ses sistemi) özelleştirme ve e-ticaret platformu. Kullanıcılar araçlarına özel ses sistemleri tasarlayabilir, sepet yönetebilir, sipariş verebilir. Admin paneli sipariş ve fiyat yönetimi sağlar.

## Özellikler

- **Özelleştirme**: Araç marka/model seçimi, hoparlör tipi (4x20, 4x16, oval), tiz/ek özellik ekleme, dinamik fiyat hesaplama.
- **Sepet & Checkout**: Zustand ile persist sepet, guest checkout, adres bilgisi.
- **Auth**: JWT tabanlı giriş/kayıt (bcrypt hash), rol bazlı (user/admin).
- **Sipariş Takibi**: Durum güncelleme (hazırlanıyor/kargoya/tamamlandı), mail bildirimleri (Nodemailer, Ethereal dummy).
- **Admin Panel**: Dashboard istatistikler (Chart.js), sipariş listesi/durum değiştirme, fiyat kuralları CRUD, kullanıcı listesi, stok/manuel kontrol, mesaj yönetimi.
- **Tasarım**: TailwindCSS, Framer Motion animasyonlar, parallax efektler, responsive (mobil uyumlu).
- **SEO**: NextSeo ile meta tags, OpenGraph/Twitter cards.
- **Veritabanı**: MongoDB (Mongoose schemas: User, Order, PricingRule).
- **API**: Next.js API routes (auth, pricing compute, orders CRUD, middleware JWT).

## Teknoloji Yığını

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, TailwindCSS, Framer Motion, Zustand (state/cart/auth).
- **Backend**: Next.js API Routes (Node.js).
- **Database**: MongoDB (Mongoose).
- **Auth**: JWT, bcrypt.
- **Mail**: Nodemailer (SMTP).
- **Charts**: Chart.js + react-chartjs-2.
- **Deployment**: Vercel/Netlify uyumlu.

## Kurulum

1. **Prerequisites**:
   - Node.js 18+.
   - MongoDB (local or Atlas cloud - ücretsiz tier mevcut).
   - SMTP (Ethereal.app için dummy test mail - https://ethereal.email/).

2. **Clone & Install**:
   ```
   git clone <repo-url>
   cd pandizot-shop/frontend
   npm install
   ```

3. **Environment Variables** (`.env.local` oluşturun):
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key (en az 32 karakter)
   MONGODB_DB=your-db-name
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=your-ethereal-user
   SMTP_PASS=your-ethereal-pass
   ```

4. **Database Seed** (test verisi):
   - `cd frontend`
   - `npm install -g ts-node` (eğer global değilse)
   - `ts-node scripts/seed.ts`
   - Bu, admin (admin@example.com / admin), user (user@example.com / password), pricing rules, test orders ekler.

5. **Development**:
   ```
   cd frontend
   npm run dev
   ```
   - http://localhost:3000
   - Demo login: admin@example.com / admin (admin panel), user@example.com / password (user).
   - Özelleştirme test: /customize, sepet ekle, checkout (mock), siparişler /orders.

6. **Production Deploy**:
   - **Vercel**: `vercel --prod` (env vars dashboard'da set edin).
   - **Netlify/Vercel**: MongoDB Atlas bağlayın, SMTP (SendGrid/Mailgun).
   - **Docker** (opsiyonel): MongoDB container + Next.js build.
   - **SEO**: Production'da og-image.jpg, twitter-image.jpg public/ ekleyin.

## Kullanım

- **Kullanıcı**:
  - /customize: Marka/model seç, hoparlör tipi, ek özellikler ekle, fiyat anlık güncellenir.
  - Sepete ekle → /cart → Ödeme (mock, adres gir).
  - Giriş/kayıt: /login /register.
  - Sipariş geçmişi: /orders (durum: hazırlanıyor/kargoya/tamamlandı).

- **Admin** (/admin):
  - Dashboard: İstatistikler, grafikler (popüler modeller).
  - Siparişler: /admin/orders (durum değiştir dropdown).
  - Fiyat Kuralları: /admin/pricing (CRUD, marka/model baz fiyat/tiz).
  - Kullanıcılar: /admin/users (liste).
  - Stok: /admin/stocks (manuel kontrol, mock).
  - Mesajlar: /admin/messages (mock).

## Geliştirme Notları

- **Animasyonlar**: Framer Motion ile fade-in, slide-up, hover efektler.
- **Responsive**: Tailwind ile mobile-first, parallax mobil fallback.
- **Güvenlik**: JWT HttpOnly cookie, bcrypt hash, rate limit yok (ekleyin production için).
- **Örnek Veri**: Seed script çalıştırın, yoksa API'ler boş döner.
- **Test**: Console log'lar var, browser dev tools'tan kontrol edin. End-to-end: özelleştir → sepet → sipariş → admin'den gör.
- **Genişletme**: Gerçek ödeme (Stripe), gerçek stok modeli, mesaj DB entegrasyonu ekleyin.

## Sorun Giderme

- MongoDB bağlantı hatası: URI kontrol edin (Atlas'ta IP whitelist).
- Mail hatası: Ethereal kullanın (ücretsiz test), veya console.log ile debug.
- JWT hatası: SECRET uzun olsun, env doğru set.
- API 500: Console.error log'lara bakın.

Platform hazır, geliştirilebilir yapıda. Sorular için README'yi genişletin veya yeni task açın.