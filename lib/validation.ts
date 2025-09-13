// Input validation utilities
// أدوات التحقق من صحة المدخلات

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// تنظيف النصوص من الأحرف الضارة
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // إزالة علامات HTML
    .replace(/['"]/g, '') // إزالة علامات الاقتباس
    .replace(/[;]/g, '') // إزالة الفاصلة المنقوطة
    .substring(0, 1000); // تحديد الطول الأقصى
}

// التحقق من صحة البريد الإلكتروني
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('البريد الإلكتروني مطلوب');
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('البريد الإلكتروني غير صحيح');
  }
  
  if (email.length > 255) {
    errors.push('البريد الإلكتروني طويل جداً');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة كلمة المرور
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('كلمة المرور مطلوبة');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }
  
  if (password.length > 128) {
    errors.push('كلمة المرور طويلة جداً');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة معرف الجهاز
export function validateDeviceId(deviceId: string): ValidationResult {
  const errors: string[] = [];
  
  if (!deviceId) {
    errors.push('معرف الجهاز مطلوب');
    return { isValid: false, errors };
  }
  
  // التحقق من أن معرف الجهاز يحتوي على أحرف وأرقام فقط
  const deviceIdRegex = /^[a-zA-Z0-9_-]+$/;
  if (!deviceIdRegex.test(deviceId)) {
    errors.push('معرف الجهاز يحتوي على أحرف غير مسموحة');
  }
  
  if (deviceId.length < 3 || deviceId.length > 50) {
    errors.push('معرف الجهاز يجب أن يكون بين 3 و 50 حرف');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة نوع الأداة
export function validateToolType(toolType: string): ValidationResult {
  const errors: string[] = [];
  
  if (!toolType) {
    errors.push('نوع الأداة مطلوب');
    return { isValid: false, errors };
  }
  
  const allowedTools = [
    'unlock_tool',
    'amttsm_tool',
    'cf_tool',
    'tfm_tool',
    'cheetah_tool',
    'global_unlocker_pro',
    'oxygen_forensics',
    'all_tablets_format'
  ];
  
  if (!allowedTools.includes(toolType)) {
    errors.push('نوع الأداة غير صحيح');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة موديل الهاتف
export function validatePhoneModel(phoneModel: string): ValidationResult {
  const errors: string[] = [];
  
  if (!phoneModel) {
    errors.push('موديل الهاتف مطلوب');
    return { isValid: false, errors };
  }
  
  const sanitized = sanitizeString(phoneModel);
  if (sanitized.length < 2 || sanitized.length > 100) {
    errors.push('موديل الهاتف يجب أن يكون بين 2 و 100 حرف');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة نوع المشكلة
export function validateProblemType(problemType: string): ValidationResult {
  const errors: string[] = [];
  
  if (!problemType) {
    errors.push('نوع المشكلة مطلوب');
    return { isValid: false, errors };
  }
  
  const allowedTypes = ['frp', 'pattern', 'software', 'unlock', 'other'];
  if (!allowedTypes.includes(problemType)) {
    errors.push('نوع المشكلة غير صحيح');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة الوصف
export function validateDescription(description: string): ValidationResult {
  const errors: string[] = [];
  
  if (!description) {
    errors.push('الوصف مطلوب');
    return { isValid: false, errors };
  }
  
  const sanitized = sanitizeString(description);
  if (sanitized.length < 10 || sanitized.length > 1000) {
    errors.push('الوصف يجب أن يكون بين 10 و 1000 حرف');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة الميزانية
export function validateBudget(budget: string): ValidationResult {
  const errors: string[] = [];
  
  if (!budget) {
    return { isValid: true, errors: [] }; // الميزانية اختيارية
  }
  
  const budgetNumber = parseFloat(budget);
  if (isNaN(budgetNumber)) {
    errors.push('الميزانية يجب أن تكون رقماً');
  } else if (budgetNumber < 0) {
    errors.push('الميزانية لا يمكن أن تكون سالبة');
  } else if (budgetNumber > 10000) {
    errors.push('الميزانية كبيرة جداً');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة الموقع
export function validateLocation(location: string): ValidationResult {
  const errors: string[] = [];
  
  if (!location) {
    return { isValid: true, errors: [] }; // الموقع اختياري
  }
  
  const sanitized = sanitizeString(location);
  if (sanitized.length > 100) {
    errors.push('الموقع طويل جداً');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة موديل التابلت
export function validateTabletModel(tabletModel: string): ValidationResult {
  const errors: string[] = [];
  
  if (!tabletModel) {
    return { isValid: true, errors: [] }; // موديل التابلت اختياري
  }
  
  const sanitized = sanitizeString(tabletModel);
  if (sanitized.length < 2 || sanitized.length > 100) {
    errors.push('موديل التابلت يجب أن يكون بين 2 و 100 حرف');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة الملاحظات
export function validateNotes(notes: string): ValidationResult {
  const errors: string[] = [];
  
  if (!notes) {
    return { isValid: true, errors: [] }; // الملاحظات اختيارية
  }
  
  const sanitized = sanitizeString(notes);
  if (sanitized.length > 500) {
    errors.push('الملاحظات طويلة جداً');
  }
  
  return { isValid: errors.length === 0, errors };
}

// التحقق من صحة مفتاح الترخيص
export function validateLicenseKey(licenseKey: string): ValidationResult {
  const errors: string[] = [];
  
  if (!licenseKey) {
    errors.push('مفتاح الترخيص مطلوب');
    return { isValid: false, errors };
  }
  
  // التحقق من أن مفتاح الترخيص يحتوي على أحرف وأرقام فقط
  const licenseKeyRegex = /^[a-zA-Z0-9_-]+$/;
  if (!licenseKeyRegex.test(licenseKey)) {
    errors.push('مفتاح الترخيص يحتوي على أحرف غير مسموحة');
  }
  
  if (licenseKey.length < 10 || licenseKey.length > 100) {
    errors.push('مفتاح الترخيص يجب أن يكون بين 10 و 100 حرف');
  }
  
  return { isValid: errors.length === 0, errors };
}
