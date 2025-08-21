// src/pages/Terms.js
import React, { useContext } from "react";
import { LanguageContext } from "../LanguageContext";

export default function Terms() {
  const { language } = useContext(LanguageContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-4">
      <div className="bg-white p-6 rounded shadow-md max-w-2xl w-full">
        <h2 className="text-2xl font-headline mb-4">
          {language === "en" ? "Terms of Use" : "شروط الاستخدام"}
        </h2>
        <p className="mb-4 text-gray-700">
          {language === "en"
            ? "By using this service, you agree to the following terms and conditions:"
            : "باستخدام هذه الخدمة، فإنك توافق على الشروط والأحكام التالية:"}
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            {language === "en"
              ? "All transfers are final once submitted."
              : "جميع التحويلات نهائية بمجرد إرسالها."}
          </li>
          <li>
            {language === "en"
              ? "We do not offer refunds if you provide incorrect recipient information, including Bank of Khartoum account details."
              : "نحن لا نقدم أي استرداد إذا قدمت معلومات مستلم غير صحيحة، بما في ذلك تفاصيل حساب بنك الخرطوم."}
          </li>
          <li>
            {language === "en"
              ? "You are responsible for verifying all details before submitting a transfer."
              : "أنت مسؤول عن التحقق من جميع التفاصيل قبل إرسال التحويل."}
          </li>
          <li>
            {language === "en"
              ? "Your data will be kept secure and confidential."
              : "سيتم الحفاظ على بياناتك آمنة وسرية."}
          </li>
        </ul>
        <p className="mt-4 text-gray-700">
          {language === "en"
            ? "If you have any questions, please contact support."
            : "إذا كان لديك أي أسئلة، يرجى الاتصال بالدعم."}
        </p>
      </div>
    </div>
  );
}
