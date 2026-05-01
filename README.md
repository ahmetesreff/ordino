# ORDINO B2B Pazaryeri

ORDINO, restoranların, kafelerin ve yerel marketlerin toptancılardan ve distribütörlerden ürün tedarik etmesini sağlayan çoklu satıcılı (multi-vendor) bir B2B e-ticaret platformudur.

---

## Gereksinimler

- **Docker** ve **Docker Compose** (v2+)
- **Node.js** v20+ ve **npm** v10+ (yalnızca lokal geliştirme için)
- **WSL2** (Windows kullanıcıları için)

---

## Docker ile Ayağa Kaldırma (Önerilen)

### 1. Ortam Değişkenlerini Hazırla

Kök dizindeki `.env.example` dosyasını kopyalayarak `.env` oluştur:

```bash
cp .env.example .env
```

> Production ortamı için `.env` içindeki `JWT_SECRET` değerini mutlaka güçlü bir değerle değiştir.

### 2. Uygulamayı Başlat

```bash
docker compose up --build
```

İlk çalıştırmada Docker imajları build edilir (~3-5 dakika sürebilir). Sonraki başlatmalarda cache'den hızlıca açılır:

```bash
docker compose up
```

### 3. Servislere Eriş

| Servis | Adres | Açıklama |
|---|---|---|
| Buyer (Alıcı) | http://localhost:3002 | Restoran / kafe paneli |
| Seller (Satıcı) | http://localhost:3003 | Toptancı paneli |
| Admin | http://localhost:3001 | Platform yönetim paneli |
| API | http://localhost:3000 | NestJS REST API |
| Swagger | http://localhost:3000/api | API dokümantasyonu |

### Demo Hesapları

Uygulama ilk açılışta aşağıdaki test hesaplarını otomatik oluşturur:

| Rol | E-posta | Şifre |
|---|---|---|
| Alıcı | buyer@sefininyeri.com | buyer123 |
| Satıcı | seller@emintoptan.com | seller123 |
| Admin | admin@ordino.com | admin123 |

### Durdurma

```bash
docker compose down
```

Veritabanı verilerini de silmek için:

```bash
docker compose down -v
```

---

## Lokal Geliştirme (Docker olmadan)

Geliştirme ortamında PostgreSQL ve Redis'in ayrıca kurulu ve çalışır durumda olması gerekir.

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarla

```bash
cp .env.example .env
# DATABASE_URL ve REDIS_URL değerlerini lokal bağlantı bilgilerinle güncelle
```

### 3. Veritabanı Şemasını Oluştur ve Seed'i Çalıştır

```bash
cd packages/database
npm run db:push
npm run db:seed
```

### 4. Geliştirme Sunucularını Başlat

```bash
npm run dev
```

Tüm uygulamalar ve API aynı anda başlar.

---

## Proje Yapısı

```
ordino/
├── apps/
│   ├── api/          NestJS backend (Port 3000)
│   ├── admin-web/    Admin paneli — Next.js (Port 3001)
│   ├── buyer-web/    Alıcı paneli — Next.js (Port 3002)
│   └── seller-web/   Satıcı paneli — Next.js (Port 3003)
└── packages/
    ├── database/     Prisma şeması ve veritabanı istemcisi
    ├── ui/           Paylaşılan React bileşen kütüphanesi
    ├── eslint-config/ Paylaşılan ESLint yapılandırması
    └── typescript-config/ Paylaşılan TypeScript yapılandırması
```

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Monorepo | Turborepo |
| Backend | NestJS 11, Prisma 6, PostgreSQL 16 |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Kimlik Doğrulama | JWT + Passport |
| Kuyruk / Cache | BullMQ + Redis 7 |
| Konteyner | Docker, Docker Compose |
