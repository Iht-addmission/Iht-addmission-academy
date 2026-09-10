import i18next from 'i18next';
import { format } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';

export const formatNumber = (num: number | string) => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat(i18next.language === 'bn' ? 'bn-BD' : 'en-US').format(n);
};

export const formatDate = (date: string | Date, formatStr: string = 'PP') => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr, {
    locale: i18next.language === 'bn' ? bn : enUS
  });
};

export const formatPrice = (price: number | string) => {
  const p = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat(i18next.language === 'bn' ? 'bn-BD' : 'en-US', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(p).replace('BDT', '৳');
};
