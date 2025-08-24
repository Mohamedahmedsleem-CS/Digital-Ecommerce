'use client';

import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Shield, 
  Heart,
  ExternalLink,
  Mail
} from 'lucide-react';

function Footer() {
  // رقم الواتساب
  const whatsappNumber = '+966555506637';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}`;
  
  // موقع المتجر (افتراضي)
  const storeAddress = 'شارع الملك فهد، حي النزهة، الرياض، المملكة العربية السعودية';
  const mapUrl = 'https://maps.google.com/?q=24.7136,46.6753'; // إحداثيات افتراضية للرياض
  
  // فتح الواتساب
  const openWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  
  // فتح الخريطة
  const openMap = () => {
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm text-white">
      {/* القسم الرئيسي */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* معلومات المتجر */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold font-cairo">عطارة المكارم</h3>
            </div>
            <p className="text-gray-300 leading-relaxed font-cairo">
              متجر متخصص في بيع أجود أنواع الأعشاب والتوابل الطبيعية، 
              نقدم لكم أفضل المنتجات الصحية والطبيعية.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>كل ايام الاسبوع ( 10 ص - 12 م )</span>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-cairo border-b border-primary pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-primary transition-colors duration-200 font-cairo">
                  الصفحة الرئيسية
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-primary transition-colors duration-200 font-cairo">
                  المنتجات
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-primary transition-colors duration-200 font-cairo">
                  من نحن
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-primary transition-colors duration-200 font-cairo">
                  اتصل بنا
                </a>
              </li>
            </ul>
          </div>

          {/* قسم التواصل عبر واتساب */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-cairo border-b border-primary pb-2">
              التواصل عبر واتساب
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium font-cairo">للاستفسار والشكاوى</p>
                  <p className="text-sm text-gray-300">{whatsappNumber}</p>
                </div>
              </div>
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-cairo"
                aria-label="فتح محادثة واتساب"
              >
                <MessageCircle className="w-5 h-5" />
                ابدأ المحادثة
              </button>
            </div>
          </div>

          {/* قسم موقع المتجر */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold font-cairo border-b border-primary pb-2">
              موقع المتجر
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed font-cairo">
                    {storeAddress}
                  </p>
                </div>
              </div>
              <button
                onClick={openMap}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 font-cairo"
                aria-label="فتح موقع المتجر في الخريطة"
              >
                <ExternalLink className="w-5 h-5" />
                عرض في الخريطة
              </button>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* معلومات الاتصال */}
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-400">اتصل بنا</p>
                <p className="font-medium font-cairo">{whatsappNumber}</p>
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                <p className="font-medium font-cairo">info@almakarem.com</p>
              </div>
            </div>

            {/* ضمان الجودة */}
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-400">ضمان الجودة</p>
                <p className="font-medium font-cairo">منتجات طبيعية 100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="bg-black/20 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400 font-cairo">
                © 2024 عطارة المكارم. جميع الحقوق محفوظة.
              </p>
            </div>
            {/* <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-primary transition-colors duration-200 font-cairo">
                سياسة الخصوصية
              </a>
              <a href="/terms" className="text-gray-400 hover:text-primary transition-colors duration-200 font-cairo">
                شروط الاستخدام
              </a>
              <a href="/shipping" className="text-gray-400 hover:text-primary transition-colors duration-200 font-cairo">
                سياسة الشحن
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;