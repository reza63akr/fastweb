# FastWeb96 — وب‌سایت رسمی استودیو طراحی و توسعه وب

وب‌سایت اختصاصی **FastWeb96** (طراح: رضا اکبری) — فارسی، RTL، با طراحی مدرن/مینیمال و پالت
مشکی عمیق، طلایی، آبی و کرم.

- **استک:** React 19 + TypeScript + Vite (بدون فریم‌ورک CSS؛ استایل‌ها با CSS Variables و فایل‌های modulare)
- **فونت:** Vazirmatn (فایل متغیر، self-hosted در `public/fonts`)
- **ویدیوی Hero:** `public/media/hero-video.mp4` (بدون صدا، faststart، ~۱.۳MB) + `hero-poster.jpg`

---

## اجرا

```bash
cd fastweb96-website
npm install
npm run dev        # http://localhost:3000
npm run build      # خروجی استاتیک در dist/
npm run preview    # پیش‌نمایش بیلد تولید
npm run typecheck
```

> در این محیط، سایت از طریق `docker-compose.base44.yml` در ریشه‌ی ریپو و روی پورت ۳۰۰۰ بالا می‌آید.

---

## ساختار پروژه

```
fastweb96-website/
├── index.html                 # عنوان، متا، Open Graph، JSON-LD، dir=rtl
├── public/
│   ├── fonts/                 # Vazirmatn-Variable.woff2
│   ├── media/                 # ویدیو و پوستر Hero
│   ├── images/                # تصاویر پروژه‌ها و خدمات (بهینه‌شده)
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── data/                  # ⬅️ همه‌ی محتوای قابل ویرایش
    │   ├── site.ts            # برند، طراح، تلفن، ایمیل، شبکه‌های اجتماعی، منو، endpoint فرم
    │   ├── projects.ts        # دسته‌بندی‌ها + نمونه‌کارها (گالری، featured، link)
    │   └── content.ts         # خدمات، مراحل همکاری، مزیت‌ها
    ├── components/            # کامپوننت‌های قابل استفاده‌ی مجدد
    ├── pages/                 # Home / Services / Portfolio / Project / About / Order / Contact / 404
    ├── lib/                   # هوک‌ها (اسکرول، Reveal، قفل بدنه) + ابزارها + ارسال فرم
    └── styles/                # tokens, base, layout, hero, sections, portfolio, forms
```

---

## ویرایش محتوا (بدون دست زدن به کد)

### اطلاعات تماس، شبکه‌های اجتماعی و منو
`src/data/site.ts` → بخش‌های `contact` و `socials` و `nav`.
شماره تماس، ایمیل، آدرس، ساعات کاری و لینک شبکه‌های اجتماعی همه از همین فایل خوانده می‌شوند.

### افزودن پروژه‌ی جدید به نمونه‌کارها
فقط یک آیتم به آرایه‌ی `projects` در `src/data/projects.ts` اضافه کنید:

```ts
{
  slug: "my-new-project",          // آدرس صفحه: /portfolio/my-new-project
  title: "نام پروژه",
  category: "cafe",                // یکی از idهای موجود در categories
  categoryLabel: "کافه",
  description: "توضیح کوتاه پروژه",
  image: "/images/cafe-warm.jpg",  // تصویر اصلی
  imageAlt: "توضیح تصویر برای دسترس‌پذیری و SEO",
  gallery: [{ src: "/images/…", alt: "…" }],
  link: "/portfolio/my-new-project",
  featured: false,                 // نمایش در اسلایدر شاخص‌ها
  year: "۱۴۰۴",
  tags: ["منوی دیجیتال", "رزرو میز"],
}
```

### افزودن دسته‌بندی جدید
یک آیتم به `categories` اضافه کنید (مثلاً `{ id: "fitness", label: "باشگاه ورزشی" }`)؛
فیلترها، فوتر و بج کارت‌ها خودکار به‌روز می‌شوند. نیازی به تغییر کد نیست.

### جایگزینی ویدیوی Hero
فایل `public/media/hero-video.mp4` را با نسخه‌ی وب‌بهینه (H.264، بدون صدا، `+faststart`) جایگزین
کنید و پوستر را در `public/media/hero-poster.jpg` بگذارید. مسیرها در `src/components/Hero.tsx`
ثابت‌های `HERO_VIDEO` / `HERO_POSTER` هستند.

---

## صفحات و مسیرها

| مسیر | صفحه |
| --- | --- |
| `/` | خانه (Hero اسکرول‌محور، معرفی، خدمات، پروژه ویژه، نمونه‌کارها، فرآیند، درباره، مزیت‌ها، ثبت سفارش، تماس) |
| `/services` | خدمات + فرآیند همکاری |
| `/portfolio` | نمونه‌کارها (فیلتر + اسلایدر + گرید + لایت‌باکس) |
| `/portfolio/:slug` | صفحه‌ی هر پروژه (گالری، مشخصات، پروژه‌های مشابه) |
| `/about` | درباره ما + مزیت‌ها + فرآیند |
| `/order` | ثبت سفارش |
| `/contact` | تماس با ما |

---

## فرم‌ها

فرم سفارش و فرم تماس اعتبارسنجی سمت کلاینت دارند (نام، موبایل ایران، ایمیل، انتخاب‌های الزامی،
توضیحات، حجم/نوع فایل تا ۱۰MB) و پیام موفقیت دقیقاً طبق متن درخواستی نمایش داده می‌شود.

فقط فرم «ثبت سفارش» از `src/lib/leads.ts` به endpoint عمومی موجود در `src/data/site.ts`
یعنی `https://fastweb96-m2vkzxu7.manus.space/api/order` با `POST` و JSON متنی ارسال می‌شود.
نام، تلفن، ایمیل (اختیاری)، نوع کسب‌وکار، نوع سایت، بودجه و توضیحات به relay می‌رسند؛ relay
اعتبارسنجی سرور را انجام می‌دهد و پیام را با bot تلگرام موجود ارسال می‌کند. فرم تماس و ظاهر سایت
تغییری نکرده‌اند. فایل اختیاری در رابط انتخاب می‌شود اما محتوای آن به تلگرام منتقل نمی‌شود؛ این
محدودیت پیش از ارسال و در پیام موفقیت اعلام می‌شود. اگر ارسال سفارش با خطا روبه‌رو شود، فرم موفق
نشان داده نمی‌شود و کاربر پیام تلاش دوباره می‌بیند. Bot Token و Chat ID فقط در متغیرهای امن سمت
سرور هستند و داخل bundle عمومی React قرار نمی‌گیرند.

---

## SEO و دسترس‌پذیری

- `lang="fa"` و `dir="rtl"` روی `<html>`
- Title و Meta Description مطابق درخواست در `index.html` + به‌روزرسانی هر صفحه با `PageMeta`
- سلسله‌مراتب عنوان‌ها: یک `h1` در هر صفحه و `h2`/`h3` منظم
- `alt` توصیفی برای همه‌ی تصاویر، `aria-label` برای کنترل‌های آیکونی، `skip-link`
- داده‌ی ساختاریافته‌ی `ProfessionalService` (JSON-LD)، `robots.txt` و `sitemap.xml`

---

## دامنه‌ی اختصاصی و انتشار

مسیر دارایی‌های داخلی همچنان نسبی‌اند؛ تنها مقصد فرم سفارش یک HTTPS endpoint عمومی است:
`https://fastweb96-m2vkzxu7.manus.space/api/order`.

1. push به `main` در repository `rezaa63/fastweb`، workflow موجود `.github/workflows/main.yml`
   را اجرا می‌کند؛ Vite پوشه‌ی `dist/` را برای GitHub Pages می‌سازد.
2. فایل `CNAME` دامنه‌ی اختصاصی `fastweb96.ir` را نگه می‌دارد؛ مسیرهای React/Vite با SPA fallback
   موجود منتشر می‌شوند.
3. API فقط فرم سفارش را می‌گیرد؛ سرور تنها originهای دقیق GitHub Pages و دامنهٔ `fastweb96.ir`
   را مجاز می‌داند و هیچ credential تلگرام در frontend قرار نمی‌گیرد.

> در حالت توسعه، Vite روی `0.0.0.0:3000` گوش می‌دهد و هاست‌های اضافی از طریق متغیر استاندارد
> `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` مجاز می‌شوند (بدون هارد‌کد کردن دامنه).

---

## تصاویر و مجوزها

منابع و مجوز تصاویر در [`CREDITS.md`](./CREDITS.md) آمده است. تصاویر خودروی دنا پلاس از
ویکی‌مدیا کامانز با مجوز CC BY / CC BY-SA هستند و نیاز به ذکر منبع دارند (در CREDITS انجام شده).
برای استفاده‌ی تجاری، تصاویر اختصاصی برند را جایگزین کنید.
