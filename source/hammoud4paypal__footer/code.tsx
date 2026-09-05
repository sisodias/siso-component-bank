import Link from "next/link";
import { Activity, Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-cyan-100/80 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary font-extrabold text-2xl tracking-tight focus-ring rounded-lg w-fit"
            >
              <Activity className="h-6 w-6 stroke-[2.5] text-accent" />
              <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">أمل غزة</span>
            </Link>
            <p className="text-sm text-brand-muted max-w-md leading-relaxed font-sans">
              أمل غزة هي مبادرة مستقلة للتنمية المجتمعية وتمكين الشباب. ندير مساحات تعلم رقمية، ومساحات عمل مهنية، بالإضافة إلى تنسيق شبكات الإغاثة المحلية في قطاع غزة بشفافية كاملة وسجلات تدقيق مفتوحة للجميع.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider mb-4 border-r-2 border-accent pr-2">
              استكشف
            </h3>
            <ul className="space-y-2.5 font-sans">
              <li>
                <Link
                  href="/"
                  className="text-sm text-brand-muted hover:text-primary transition-colors focus-ring rounded"
                >
                  نظرة عامة
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-brand-muted hover:text-primary transition-colors focus-ring rounded"
                >
                  لوحة الشفافية
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-sm text-brand-muted hover:text-primary transition-colors focus-ring rounded"
                >
                  تقارير الميدان
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider mb-4 border-r-2 border-accent pr-2">
              الحالة والتواصل
            </h3>
            <ul className="space-y-3.5 text-sm text-brand-muted font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>مدينة غزة، فلسطين</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:contact@amlgaza.org"
                  className="hover:text-primary transition-colors focus-ring rounded"
                >
                  contact@amlgaza.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-bold px-2.5 py-1 bg-cyan-50 text-primary border border-cyan-150/40 rounded-full">
                  سجل مالي مدقق ومفتوح
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-cyan-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-muted">
          <p className="font-sans">
            جميع الحقوق محفوظة &copy; {currentYear} مبادرة أمل غزة.
          </p>
          <div className="flex gap-4 font-sans font-semibold">
            <Link
              href="/dashboard#transparency"
              className="hover:underline hover:text-primary focus-ring rounded"
            >
              معايير التدقيق والشفافية
            </Link>
            <span>&bull;</span>
            <Link
              href="/dashboard#audit"
              className="hover:underline hover:text-primary focus-ring rounded"
            >
              سجلات التبرعات والإيصالات
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
