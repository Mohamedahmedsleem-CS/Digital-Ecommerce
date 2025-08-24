'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, AlertTriangle, Package, Star } from 'lucide-react';

function ProductDetails({ product }) {
  const [activeTab, setActiveTab] = useState('benefits'); // تغيير التبويب الافتراضي إلى الفوائد لاختبار الحل

  // دالة محسنة للتعامل مع تنسيق Slate.js JSON
  const renderRichText = (content) => {
    // إذا كان المحتوى فارغاً
    if (!content) {
      return <div className="text-gray-500">لا توجد بيانات متاحة</div>;
    }

    // إذا كان المحتوى سلسلة نصية JSON، نحاول تحليله
    if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse JSON string', e);
        // إذا فشل التحليل، نعرض المحتوى كما هو
        return <div className="whitespace-pre-wrap">{content}</div>;
      }
    }

    // إذا كان المحتوى مصفوفة (تنسيق Slate.js)
    if (Array.isArray(content)) {
      return (
        <div className="space-y-4 rtl">
          {content.map((node, index) => {
            if (node.type === 'paragraph') {
              return (
                <p key={index} className="mb-2 text-right">
                  {node.children?.map((child, childIndex) => (
                    <React.Fragment key={childIndex}>
                      {child.text}
                    </React.Fragment>
                  ))}
                </p>
              );
            }
            
            if (node.type === 'heading-one' || node.type === 'heading-two') {
              const HeadingTag = node.type === 'heading-one' ? 'h1' : 'h2';
              const className = node.type === 'heading-one' 
                ? "text-2xl font-bold mb-3 text-right" 
                : "text-xl font-bold mb-2 text-right";
                
              return (
                <HeadingTag key={index} className={className}>
                  {node.children?.map((child, childIndex) => (
                    <React.Fragment key={childIndex}>
                      {child.text}
                    </React.Fragment>
                  ))}
                </HeadingTag>
              );
            }
            
            if (node.type === 'bulleted-list') {
              return (
                <ul key={index} className="list-disc pr-5 mb-4 text-right">
                  {node.children?.map((child, childIndex) => (
                    <li key={childIndex} className="mb-1">
                      {child.children?.map((textChild, textIndex) => (
                        <React.Fragment key={textIndex}>
                          {textChild.text}
                        </React.Fragment>
                      ))}
                    </li>
                  ))}
                </ul>
              );
            }
            
            return null;
          })}
        </div>
      );
    }

    // إذا كان المحتوى نصاً عادياً
    if (typeof content === 'string') {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }

    // حالات أخرى
    return <div className="text-gray-500">نوع محتوى غير مدعوم</div>;
  };

  // تحديد التبويبات المتاحة
  const availableTabs = [
    { id: 'whatsIncluded', label: 'المحتوى', icon: Package, color: 'blue', data: product?.whatsIncluded },
    { id: 'benefits', label: 'الفوائد', icon: CheckCircle, color: 'green', data: product?.benefits },
    { id: 'usageMethods', label: 'طرق الاستخدام', icon: Info, color: 'indigo', data: product?.usageMethods },
    { id: 'warnings', label: 'التحذيرات', icon: AlertTriangle, color: 'red', data: product?.warnings }
  ].filter(tab => tab.data); // إظهار التبويبات التي تحتوي على بيانات فقط

  // إذا لم تكن هناك بيانات، لا نعرض المكون
  if (availableTabs.length === 0) {
    return null;
  }

  // تحديد التبويب الافتراضي
  const defaultTab = availableTabs[0]?.id || 'benefits';
  if (activeTab !== defaultTab && !availableTabs.find(tab => tab.id === activeTab)) {
    setActiveTab(defaultTab);
  }

  const getTabStyles = (tabId, color) => {
    const isActive = activeTab === tabId;
    const colorClasses = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-500' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-50 text-green-700 border-green-500' : 'text-green-600 hover:bg-green-50',
      indigo: isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'text-indigo-600 hover:bg-indigo-50',
      red: isActive ? 'bg-red-50 text-red-700 border-red-500' : 'text-red-600 hover:bg-red-50'
    };
    
    return `flex-1 py-4 px-4 text-sm font-medium transition-colors ${
      isActive ? `${colorClasses[color]} border-b-2` : colorClasses[color]
    }`;
  };

  const getIconColor = (tabId, color) => {
    const isActive = activeTab === tabId;
    const colorClasses = {
      blue: isActive ? 'text-blue-600' : 'text-blue-400',
      green: isActive ? 'text-green-600' : 'text-green-400',
      indigo: isActive ? 'text-indigo-600' : 'text-indigo-400',
      red: isActive ? 'text-red-600' : 'text-red-400'
    };
    
    return colorClasses[color];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* عنوان القسم */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">تفاصيل المنتج</h2>
            <p className="text-sm text-gray-600">معلومات شاملة عن المنتج وفوائده</p>
          </div>
        </div>
      </div>

      {/* أزرار التبويبات */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {availableTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={getTabStyles(tab.id, tab.color)}
            >
              <div className="flex items-center justify-center gap-2">
                <IconComponent className={`w-5 h-5 ${getIconColor(tab.id, tab.color)}`} />
                <span className="font-medium">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* محتوى التبويبات */}
      <div className="p-6 min-h-[300px]">
        {/* المحتوى المرفق */}
        {activeTab === 'whatsIncluded' && product?.whatsIncluded && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">المحتوى المرفق</h3>
                <p className="text-sm text-gray-600">ما يتم تضمينه مع المنتج</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-blue-800 leading-relaxed">
                {renderRichText(product.whatsIncluded)}
              </div>
            </div>
          </div>
        )}

        {/* فوائد المنتج */}
        {activeTab === 'benefits' && product?.benefits && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">فوائد المنتج</h3>
                <p className="text-sm text-gray-600">المزايا والفوائد الصحية</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 leading-relaxed">
                {renderRichText(product.benefits)}
              </div>
            </div>
          </div>
        )}

        {/* طرق الاستخدام */}
        {activeTab === 'usageMethods' && product?.usageMethods && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Info className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">طرق الاستخدام</h3>
                <p className="text-sm text-gray-600">تعليمات الاستخدام الصحيحة</p>
              </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="text-indigo-800 leading-relaxed">
                {renderRichText(product.usageMethods)}
              </div>
            </div>
          </div>
        )}

        {/* التحذيرات */}
        {activeTab === 'warnings' && product?.warnings && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">تحذيرات هامة</h3>
                <p className="text-sm text-gray-600">معلومات السلامة والتحذيرات</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 leading-relaxed">
                {renderRichText(product.warnings)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* معلومات إضافية في الأسفل */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>تم تحديث المعلومات في {new Date().toLocaleDateString('ar-SA')}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            معلومات موثوقة
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;