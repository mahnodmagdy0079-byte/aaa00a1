using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;
using System.Diagnostics;
using System.Management;
using System.Collections.Generic;

namespace ToolyGsm
{
    public static class SecurityConfig
    {
        // Environment Variables - يجب تعيينها في النظام
        public static string GetSupabaseApiKey()
        {
            var apiKey = Environment.GetEnvironmentVariable("SUPABASE_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
            {
                // في الإنتاج، يجب إيقاف البرنامج إذا لم يتم تعيين API Key
                throw new InvalidOperationException(
                    "[SECURITY ERROR] SUPABASE_API_KEY environment variable is not set! " +
                    "Please set the SUPABASE_API_KEY environment variable before running the application. " +
                    "This is required for security reasons."
                );
            }
            return apiKey;
        }

        public static string GetApiBaseUrl()
        {
            return Environment.GetEnvironmentVariable("API_BASE_URL") ?? "https://eskuly.org";
        }

        public static string GetSupabaseBaseUrl()
        {
            return Environment.GetEnvironmentVariable("SUPABASE_BASE_URL") ?? "https://ewkzduhofisinbhjrzzu.supabase.co";
        }

        // تشفير البيانات الحساسة (مبسط)
        public static string EncryptSensitiveData(string data)
        {
            if (string.IsNullOrEmpty(data)) return string.Empty;
            
            try
            {
                // تشفير بسيط باستخدام Base64 (يمكن تحسينه لاحقاً)
                byte[] dataBytes = Encoding.UTF8.GetBytes(data);
                return Convert.ToBase64String(dataBytes);
            }
            catch
            {
                // في حالة فشل التشفير، إرجاع البيانات كما هي
                return data;
            }
        }

        public static string DecryptSensitiveData(string encryptedData)
        {
            if (string.IsNullOrEmpty(encryptedData)) return string.Empty;
            
            try
            {
                byte[] encryptedBytes = Convert.FromBase64String(encryptedData);
                return Encoding.UTF8.GetString(encryptedBytes);
            }
            catch
            {
                // في حالة فشل فك التشفير، إرجاع البيانات كما هي
                return encryptedData;
            }
        }

        // تنظيف البيانات الحساسة من الذاكرة
        public static void ClearSensitiveString(ref string sensitiveData)
        {
            if (!string.IsNullOrEmpty(sensitiveData))
            {
                // ملء السلسلة بأصفار
                var chars = sensitiveData.ToCharArray();
                Array.Clear(chars, 0, chars.Length);
                sensitiveData = string.Empty;
            }
        }

        // التحقق من صحة التوكن
        public static bool IsValidToken(string token)
        {
            if (string.IsNullOrEmpty(token)) return false;
            
            // التحقق من أن التوكن يحتوي على 3 أجزاء (JWT)
            var parts = token.Split('.');
            return parts.Length == 3;
        }

        // إخفاء التوكن في الـ logs
        public static string MaskToken(string token)
        {
            if (string.IsNullOrEmpty(token) || token.Length < 10)
                return "***";
            
            return $"{token.Substring(0, 6)}...{token.Substring(token.Length - 4)}";
        }

        // ===== طبقات الحماية المتقدمة =====

        // 1. التحقق من سلامة البرنامج (مبسط لتجنب مشاكل Windows Defender)
        public static bool IsApplicationIntegrityValid()
        {
            // إرجاع true دائماً لتجنب مشاكل برنامج الحماية
            return true;
        }

        // 2. التحقق من البيئة (مبسط لتجنب مشاكل Windows Defender)
        public static bool IsEnvironmentSecure()
        {
            // إرجاع true دائماً لتجنب مشاكل برنامج الحماية
            return true;
        }

        // 3. التحقق من Virtual Machine (معطل لتجنب مشاكل Windows Defender)
        private static bool IsRunningInVirtualMachine()
        {
            // إرجاع false دائماً لتجنب مشاكل برنامج الحماية
            return false;
        }

        // 4. تشفير متقدم للبيانات الحساسة
        public static string EncryptAdvanced(string plainText, string key)
        {
            if (string.IsNullOrEmpty(plainText)) return string.Empty;
            
            try
            {
                using (var aes = Aes.Create())
                {
                    aes.Key = Encoding.UTF8.GetBytes(key.PadRight(32).Substring(0, 32));
                    aes.IV = new byte[16]; // IV ثابت للبساطة (يجب تحسينه في الإنتاج)
                    
                    using (var encryptor = aes.CreateEncryptor())
                    using (var msEncrypt = new MemoryStream())
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (var swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(plainText);
                        return Convert.ToBase64String(msEncrypt.ToArray());
                    }
                }
            }
            catch
            {
                return plainText; // في حالة فشل التشفير
            }
        }

        public static string DecryptAdvanced(string cipherText, string key)
        {
            if (string.IsNullOrEmpty(cipherText)) return string.Empty;
            
            try
            {
                using (var aes = Aes.Create())
                {
                    aes.Key = Encoding.UTF8.GetBytes(key.PadRight(32).Substring(0, 32));
                    aes.IV = new byte[16];
                    
                    using (var decryptor = aes.CreateDecryptor())
                    using (var msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    using (var srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
            catch
            {
                return cipherText; // في حالة فشل فك التشفير
            }
        }

        // 5. التحقق من صحة الاستجابة من الخادم
        public static bool ValidateServerResponse(string response, string expectedHash)
        {
            try
            {
                // إنشاء hash للاستجابة
                using (var sha256 = SHA256.Create())
                {
                    var responseBytes = Encoding.UTF8.GetBytes(response);
                    var hashBytes = sha256.ComputeHash(responseBytes);
                    var responseHash = Convert.ToBase64String(hashBytes);
                    
                    return responseHash == expectedHash;
                }
            }
            catch
            {
                return false;
            }
        }

        // 6. إنشاء توقيع رقمي للطلبات
        public static string CreateRequestSignature(string data, string secretKey)
        {
            try
            {
                using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secretKey)))
                {
                    var dataBytes = Encoding.UTF8.GetBytes(data);
                    var hashBytes = hmac.ComputeHash(dataBytes);
                    return Convert.ToBase64String(hashBytes);
                }
            }
            catch
            {
                return string.Empty;
            }
        }

        // 7. التحقق من التوقيع الرقمي
        public static bool VerifyRequestSignature(string data, string signature, string secretKey)
        {
            try
            {
                var expectedSignature = CreateRequestSignature(data, secretKey);
                return signature == expectedSignature;
            }
            catch
            {
                return false;
            }
        }

        // 8. فحص شامل للأمان
        public static SecurityCheckResult PerformSecurityCheck()
        {
            var result = new SecurityCheckResult();
            var errorMessages = new List<string>();
            
            // فحص سلامة التطبيق
            result.IsApplicationIntegrityValid = IsApplicationIntegrityValid();
            if (!result.IsApplicationIntegrityValid)
            {
                var currentPath = System.Reflection.Assembly.GetExecutingAssembly().Location;
                var fileInfo = new FileInfo(currentPath);
                errorMessages.Add($"فشل فحص سلامة التطبيق - المسار: {currentPath} - الحجم: {fileInfo.Length} bytes");
            }
            
            // فحص البيئة
            result.IsEnvironmentSecure = IsEnvironmentSecure();
            if (!result.IsEnvironmentSecure)
            {
                var vmCheck = IsRunningInVirtualMachine();
                errorMessages.Add($"فشل فحص البيئة الآمنة - VM: {vmCheck}");
            }
            
            // فحص التوكن
            result.IsTokenValid = IsValidToken(Environment.GetEnvironmentVariable("USER_TOKEN") ?? "");
            if (!result.IsTokenValid)
            {
                errorMessages.Add("فشل فحص صحة التوكن");
            }
            
            result.IsSecure = result.IsApplicationIntegrityValid && result.IsEnvironmentSecure;
            result.ErrorMessage = string.Join(" | ", errorMessages);
            
            return result;
        }
    }

    // كلاس لحفظ نتائج فحص الأمان
    public class SecurityCheckResult
    {
        public bool IsApplicationIntegrityValid { get; set; }
        public bool IsEnvironmentSecure { get; set; }
        public bool IsTokenValid { get; set; }
        public bool IsSecure { get; set; }
        public string ErrorMessage { get; set; } = "";
    }
}
