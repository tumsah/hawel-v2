// src/pages/Home.js
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeroCalculator from "../components/HeroCalculator";
import { LanguageContext } from "../LanguageContext";

export default function Home() {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  // Simple i18n helpers
  const isAR = language === "ar";
  const t = (en, ar) => (isAR ? ar : en);

  return (
    <main dir={isAR ? "rtl" : "ltr"}>
      {/* Modern hero with calculator (dark or switch to light by changing variant) */}
      <HeroCalculator
        variant="dark"
        logoSrc="/assets/logo.png"
        onMakeTransfer={() => navigate("/make-transfer")}
        onTrack={() => navigate("/track-transfer")}
        onRegister={() => navigate("/register")}
        onLogin={() => navigate("/login")}
      />

      {/* Below-the-fold content (Tailwind for quick styling) */}
      <section className="max-w-[1200px] mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-3">
          {t("Why Hawel?", "لماذا حوال؟")}
        </h2>
        <p className="text-[#5b6761] m-0">
          {t(
            "Fast, clear and secure transfers to Sudan. Transparent fees, PDPL-compliant privacy, and manual oversight while we operate as a technology platform pending licensing/partner approval.",
            "تحويلات سريعة وواضحة وآمنة إلى السودان. رسوم شفافة، وخصوصية متوافقة مع PDPL، وإشراف يدوي أثناء عملنا كمنصة تقنية إلى حين الحصول على ترخيص/شريك."
          )}
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <FeatureCard
            title={t("Transparent fees", "رسوم شفافة")}
            body={t(
              "See what you pay before you send. No surprises.",
              "اعرف الرسوم قبل الإرسال — بلا مفاجآت."
            )}
          />
          <FeatureCard
            title={t("Secure onboarding", "انضمام آمن")}
            body={t(
              "GCC residents onboard online; others go to EDD/manual review.",
              "المقيمون في دول مجلس التعاون ينضمون إلكترونيًا؛ وغير ذلك عبر EDD/مراجعة يدوية."
            )}
          />
          <FeatureCard
            title={t("Compliance by design", "امتثال مدمج")}
            body={t(
              "Sanctions & PEP checks, consent logging, and audit trails.",
              "فحوصات العقوبات وPEP، وتسجيل الموافقات، وسجلات تدقيق."
            )}
          />
          <FeatureCard
            title={t("Support that listens", "دعم يستجيب")}
            body={t(
              "We’re here to help — support@hawelmoney.com",
              "نحن هنا للمساعدة — support@hawelmoney.com"
            )}
          />
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 pt-2 pb-12">
        <h2 className="text-2xl font-bold mb-3">
          {t("How it works", "كيف تعمل الخدمة")}
        </h2>
        <ol className="text-[#5b6761] list-decimal ps-6 leading-7">
          <li>{t("Register (EN now; AR/RTL next).", "سجّل (الآن بالإنجليزية؛ قريبًا بالعربية).")}</li>
          <li>
            {t(
              "If you’re a GCC resident (BH/SA/AE/KW/OM/QA), complete online onboarding.",
              "إذا كنت مقيمًا في مجلس التعاون (البحرين/السعودية/الإمارات/الكويت/عمان/قطر)، أكمل الانضمام إلكترونيًا."
            )}
          </li>
          <li>
            {t(
              "Non-GCC? Submit details — we’ll place you in EDD/manual review.",
              "غير مقيم بدول مجلس التعاون؟ أرسل التفاصيل — سنحوّلك إلى EDD/مراجعة يدوية."
            )}
          </li>
          <li>
            {t(
              "Create a transfer (demo capped at USD 5,000 per customer).",
              "أنشئ تحويلًا (حد العرض التجريبي 5000 دولار لكل عميل)."
            )}
          </li>
          <li>{t("Track your transfer and get support any time.", "تتبّع تحويلك واحصل على الدعم في أي وقت.")}</li>
        </ol>

        {/* Optional extra CTAs / About link to keep parity with your previous page */}
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            to="/make-transfer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-full"
          >
            {t("Make a Transfer", "إجراء تحويل")}
          </Link>
          <Link
            to="/track-transfer"
            className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-semibold py-2 px-4 rounded-full"
          >
            {t("Track a Transfer", "تتبع التحويل")}
          </Link>
          <Link
            to="/about"
            className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-2 px-4 rounded-full"
          >
            {t("About Us", "معلومات عنا")}
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, body }) {
  return (
    <div className="border border-[#e7efea] bg-white rounded-2xl p-4 shadow-[0_6px_24px_rgba(10,20,15,.06)]">
      <h3 className="m-0 mb-1 text-lg font-semibold">{title}</h3>
      <p className="m-0 text-[#5b6761]">{body}</p>
    </div>
  );
}
