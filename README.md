# ORDINO B2B Pazaryeri
ORDINO, restoranların, kafelerin ve yerel marketlerin toptancılardan ve distribütörlerden ürün tedarik etmesini sağlayan çoklu satıcılı (multi-vendor) bir B2B e-ticaret platformudur.

## 🚀 Başlarken (Getting Started)

Proje, **Turborepo** kullanılarak **Monorepo** mimarisiyle inşa edilmiştir. NestJS backend'i ve üç farklı Next.js uygulamasını içerir.

### Ön Şartlar
- **Node.js**: v20+ (Next.js 15+ ve NestJS 11+ gereksinimi için)
- **Docker & Docker Compose**
- **npm**: v10+

### Lokal Geliştirme Ortamı

1. **Bağımlılıkları Yükleyin:**
   Kök dizindeyken npm paketlerini indirin.
   ```bash
   npm install
   ```

2. **Veritabanı Şemasını Basın:**
   Postgres SQL altyapınızın hazır olduğundan emin olun (ya da önce Docker ile ortamı ayağa kaldırın).
   ```bash
   npx turbo run db:push
   ```

3. **Geliştirme Sunucusunu Başlatma:**
   Tüm uygulamaları ve backend'i tek komutta aynı anda ayağa kaldırın:
   ```bash
   npm run dev
   ```
   *Bu komut; API (`3000`), Admin (`3001`), Buyer (`3002`) ve Seller (`3003`) panellerini çalıştırır.*

---

## 🏗️ Dağıtım (Deployment)

Proje tamamen üretim ortamına (Production) hazırdır. 

Production'da tüm servisi ayağa kaldırmak için **Docker Compose** ortamı yapılandırılmıştır. Kök dizinde yer alan `deploy.sh` scripti aracılığıyla izole bir Linux VPS ortamında rahatça kurulum yapabilirsiniz.

```bash
chmod +x deploy.sh
./deploy.sh
```

**Güvenlik Notu:**
Dağıtımdan önce kök dizine bir `.env` dosyası oluşturun ve `JWT_SECRET`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DATABASE_URL` değişkenlerinizi mutlaka belirleyin. 

---

## 📦 Proje Yapısı (Workspace)
- `apps/api`: NestJS Backend Servisi (Port: 3000)
- `apps/admin-web`: Yöneticiler için Next.js Paneli (Port: 3001)
- `apps/buyer-web`: Restoranlar için Next.js E-Ticaret Paneli (Port: 3002)
- `apps/seller-web`: Toptancılar için Next.js Teklif Paneli (Port: 3003)
- `packages/database`: Paylaşılan Prisma ORM Şemaları
- `packages/ui`: Paylaşılan React UI Kütüphanesi (Tailwind & Radix tabanlı)
