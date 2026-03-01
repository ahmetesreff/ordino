# ORDINO B2B Pazaryeri - Kapsamlı Proje Analizi

Bu belge, **ORDINO** toptan B2B pazaryeri projesinin mevcut durumunu, mimari yapısını, tamamlanan özellikleri ve gelecek yol haritasını detaylı bir şekilde incelemektedir.

## 1. Proje Genel Bakış
ORDINO, restoranların, kafelerin ve yerel marketlerin (Alıcılar), toptancılardan ve distribütörlerden (Satıcılar) ürün tedarik etmesini sağlayan çoklu satıcılı (multi-vendor) bir B2B e-ticaret platformudur. Proje, "Master SKU" (Ana Ürün) mantığı ile çalışıp, farklı satıcıların aynı ürüne "kör teklif" (blind offer) verebileceği rekabetçi bir yapı kurgulamaktadır.

## 2. Mimari ve Teknoloji Yığını
Proje, yüksek ölçeklenebilirlik ve kod paylaşımını maksimize etmek amacıyla **Turborepo** kullanılarak **Monorepo** mimarisinde inşa edilmiştir.

### 2.1. Backend (API Katmanı)
*   **Framework:** NestJS
*   **Veritabanı:** PostgreSQL
*   **ORM:** Prisma
*   **Önbellekleme & Kuyruk:** Redis & BullMQ
*   **Kimlik Doğrulama:** JWT (Passport.js), Rol Bazlı Erişim Kontrolü (RBAC) ve Multi-tenancy (Çoklu Kiracı/İşletme) izolasyonu.

### 2.2. Frontend (Kullanıcı Arayüzleri)
*   **Framework:** Next.js (App Router)
*   **Stil:** Tailwind CSS
*   **Paylaşımlı UI:** `@repo/ui` adında, Radix UI ve Class Variance Authority (CVA) kullanılarak oluşturulmuş, Shadcn konseptinde kendi iç kütüphanemiz.
*   **Uygulamalar:** Üç ayrı portal olarak ayrılmıştır: `admin-web`, `buyer-web`, ve `seller-web`.

### 2.3. Altyapı ve Sunucu
*   **Dağıtım (Deployment):** Docker & Docker Compose tabanlı. Tüm veritabanları ve Next.js/NestJS uygulamaları kendi Docker container'ları içinde çalışır.
*   **Scripting:** `deploy.sh` scripti ile VPS sunucularında tek tıkla ayağa kaldırma imkanı.

## 3. Sistem Modülleri ve Tamamlanan Özellikler

### 3.1. Auth ve Kullanıcı Yönetimi (`AuthModule`)
*   Sistemde 3 temel rol vardır: `ADMIN`, `BUYER`, `SELLER`.
*   NestJS `JwtStrategy` kullanılarak güvenli token doğrulaması yapılmıştır.
*   **Güvenlik:** Sadece işletme statüsü `APPROVED` (Onaylanmış) olan kullanıcılar sisteme giriş yapabilir. Token içerisinde `userId` ve `businessId` gömülüdür, bu sayede yetkisiz veri erişimi (IDOR) engellenmiştir.

### 3.2. Katalog ve Ürün Teklifleri (`CatalogModule` & `OfferModule`)
*   **Master SKU (GTIN):** Sistemdeki her ürün (örn: Komili Ayçiçek Yağı 5L) tek bir ana kayıt (Master SKU) olarak tutulur.
*   **Kör Teklif Sistemi:** Satıcılar, Master SKU'lara kendi fiyatlarını, stok miktarlarını ve minimum sipariş koşullarını girerek teklif (Offer) oluşturur.
*   **Alıcı Görünümü:** Alıcılar ürünü listelerken rekabetçi fiyatı görür. Satıcının gerçek ismi gizlenir (ör. `WHS-104` kodu ile gösterilir), böylece alıcı doğrudan toptancıyı bulup aradan platformu çıkartamaz.

### 3.3. Sepet ve Sipariş Yönetimi (`OrderModule`)
*   Siparişler Draft (Taslak/Sepet) olarak başlar. 
*   Ödeme (şu an için manuel Havale/EFT simülasyonu) yapıldığında atomik bir veritabanı işlemi (transaction) başlatılır. Satıcının stokları anında `reservedQty` (Rezerve Stok) olarak ayrılır ve sipariş `PAID` (Ödendi) statüsüne geçer.
*   Satıcılar panellerinden kendilerine atanan siparişleri gorüp `ACCEPTED` statüsüne çekebilirler.

### 3.4. Lojistik ve Finans Operasyonları
*   Lojistik şirketlerine, `ACCEPTED` durumundaki siparişleri JSON/CSV formatında çıktı veren (Export) servisler (`LogisticsModule` ve `PaymentModule`) API tarafında altyapı olarak kurgulanmıştır.

## 4. Güvenlik Geliştirmeleri (Security Hardening)
Codex incelemesi sonrası sistemde kritik denetimler sağlanmış ve kapatılmıştır:
1.  **Tam Multi-tenancy İzolasyonu:** Mock ID'ler kaldırılarak doğrudan Güvenli JWT içindeki `businessId` kullanılması zorunlu hale getirilmiştir.
2.  **Order IDOR Fix:** Satıcıların sadece **içinde kendi ürünü bulunan** siparişlere müdahale etmesi sağlanmıştır.
3.  **Global Validation Pipe:** Kötü niyetli request payload'larını kesmek için tüm API uç noktaları `class-validator` kullanılarak denetime tabi tutulmuştur.
4.  **Güvenli .env ve Ağ Yapısı:** DB ve Redis portları dışarıya (0.0.0.0) kapatılmış, sadece 127.0.0.1 lokal interface üzerinden erişilebilir kılınmış ve şifrelemeler dinamik çevre değişkenlerine (`.env`) geçirilmiştir.

## 5. Eksikler ve Gelecek Yol Haritası (Roadmap)
Projenin API iskeleti ve arayüz mockup'ları tamamen hazır olmakla beraber, prodüksiyona çıkmadan önce yapılması gereken entegrasyon işleri şunlardır:

1.  **Frontend-API Entegrasyonu:** Şu an Next.js arayüzleri görsel olarak (mock) kodlanmıştır. React Query / SWR veya Fetch ile NestJS backendinden dönen gerçek veriler arayüzlere bağlanmalıdır.
2.  **Ödeme Geçidi (PSP) Entegrasyonu:** Manuel havale yerine, iyzico, PayTR veya Craftgate gibi bir aracı kurum entegre edilerek alıcıların kredi kartıyla işlem yapması ve toptancıya hakedişlerin (Escrow) dağılması otomatikleştirilmelidir.
3.  **Resim Upload ve Bulut Depolama:** Master SKU ve Kullanıcı resimlerinin yüklenmesi için AWS S3 veya Cloudflare R2 entegrasyonu yapılmalıdır.
4.  **Admin İşlemleri UI:** Adminin gelen satıcı başvurularını reddetme, onaylama ve genel iptal/iade süreçlerini yürüteceği detay sayfaları kodlanmalıdır.
5.  **CI/CD Kurulumu:** GitHub Actions veya Gitlab CI üzerinden otomatik testlerin koşulması ve sunucuya otomatik deployment (CD) hatlarının kurulması gerekir.

---
*Bu rapor projenin teknik durumunu bildiren güncel özet belgedir.*
