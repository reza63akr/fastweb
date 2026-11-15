import { site } from "../data/site";
import { isValidEmail, isValidIranMobile, toLatinDigits } from "./utils";

export interface LeadPayload {
  /** منبع فرم: سفارش یا تماس */
  source: "order" | "contact";
  fields: Record<string, string>;
  file?: File | null;
}

export interface LeadResult {
  ok: boolean;
  /** true اگر فقط در مرورگر ذخیره شده باشد (بدون بک‌اند) */
  storedLocally: boolean;
  message?: string;
}

const STORAGE_KEY = "fastweb96:leads";

const storeLocally = (payload: LeadPayload): void => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    list.push({
      ...payload,
      file: payload.file ? { name: payload.file.name, size: payload.file.size } : null,
      createdAt: new Date().toISOString(),
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    // اگر حافظه‌ی مرورگر در دسترس نبود، جلوی ارسال را نمی‌گیریم.
  }
};

/** فرم سفارش را به relay تلگرام می‌فرستد؛ فرم تماس همان رفتار محلی قبلی را نگه می‌دارد. */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  if (payload.source !== "order") {
    storeLocally(payload);
    return { ok: true, storedLocally: true };
  }

  const endpoint = site.endpoints.leads;
  if (!endpoint) {
    storeLocally(payload);
    return {
      ok: false,
      storedLocally: true,
      message: "اتصال فرم سفارش هنوز تنظیم نشده است؛ لطفاً با ما تماس بگیرید.",
    };
  }

  const body = {
    name: payload.fields.fullName?.trim() ?? "",
    phone: payload.fields.phone?.trim() ?? "",
    email: payload.fields.email?.trim() ?? "",
    business: payload.fields.businessType ?? "",
    siteType: payload.fields.siteType ?? "",
    budget: payload.fields.budget ?? "",
    details: payload.fields.projectDescription?.trim() ?? "",
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; message?: string }
      | null;
    if (!response.ok || result?.ok !== true) {
      storeLocally(payload);
      return {
        ok: false,
        storedLocally: true,
        message: result?.message ?? "ارسال درخواست به تلگرام انجام نشد؛ لطفاً دوباره تلاش کنید.",
      };
    }
    return { ok: true, storedLocally: false };
  } catch {
    storeLocally(payload);
    return {
      ok: false,
      storedLocally: true,
      message: "اتصال به سرور برقرار نشد؛ اطلاعات در این مرورگر نگه داشته شد. لطفاً دوباره تلاش کنید.",
    };
  }
}

export const validateOrderField = (name: string, value: string): string | null => {
  const trimmed = toLatinDigits(value).trim();

  switch (name) {
    case "fullName":
      if (!value.trim()) return "نام و نام خانوادگی را وارد کنید.";
      if (value.trim().length < 3) return "نام باید حداقل ۳ حرف باشد.";
      return null;
    case "phone":
      if (!value.trim()) return "شماره تماس را وارد کنید.";
      if (!isValidIranMobile(value)) return "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۱۲۳۴۵۶۷).";
      return null;
    case "email":
      if (!value.trim()) return null;
      if (!isValidEmail(value)) return "ایمیل معتبر نیست.";
      return null;
    case "businessType":
      if (!value) return "نوع کسب‌وکار را انتخاب کنید.";
      return null;
    case "siteType":
      if (!value) return "نوع سایت مورد نیاز را انتخاب کنید.";
      return null;
    case "budget":
      if (!value) return "بودجه تقریبی پروژه را انتخاب کنید.";
      return null;
    case "projectDescription":
      if (!value.trim()) return "توضیحات پروژه را بنویسید.";
      if (trimmed.length < 10) return "لطفاً کمی بیشتر درباره‌ی پروژه توضیح دهید (حداقل ۱۰ حرف).";
      return null;
    default:
      return null;
  }
};
