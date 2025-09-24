using System;
using System.Windows.Forms;
using System.Drawing;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using ToolyGsm;

namespace toolygsm1
{
    public partial class LoginForm : Form
    {
        private string userId = "";
        private string fullName = "";
        private string email = "";

        public LoginForm()
        {
            InitializeComponent();
            // إضافة حدث الضغط على Create New Account
            if (lblCreateAccount != null)
            {
                lblCreateAccount.Cursor = Cursors.Hand;
                lblCreateAccount.Click += (s, e) =>
                {
                    System.Diagnostics.Process.Start("https://eskuly.org/auth/signup");
                };
            }
            // أحداث أزرار الشريط المخصص
            btnClose.Click += (s, e) => this.Close();
            btnMinimize.Click += (s, e) => this.WindowState = FormWindowState.Minimized;
            // دعم سحب النافذة عند الضغط على الشريط
            customTitleBar.MouseDown += CustomTitleBar_MouseDown;
        }

        // دعم سحب النافذة
        private bool dragging = false;
        private Point dragCursorPoint;
        private Point dragFormPoint;
        private void CustomTitleBar_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                dragging = true;
                dragCursorPoint = Cursor.Position;
                dragFormPoint = this.Location;
                customTitleBar.MouseMove += CustomTitleBar_MouseMove;
                customTitleBar.MouseUp += CustomTitleBar_MouseUp;
            }
        }
        private void CustomTitleBar_MouseMove(object sender, MouseEventArgs e)
        {
            if (dragging)
            {
                Point diff = Point.Subtract(Cursor.Position, new Size(dragCursorPoint));
                this.Location = Point.Add(dragFormPoint, new Size(diff));
            }
        }
        private void CustomTitleBar_MouseUp(object sender, MouseEventArgs e)
        {
            dragging = false;
            customTitleBar.MouseMove -= CustomTitleBar_MouseMove;
            customTitleBar.MouseUp -= CustomTitleBar_MouseUp;
        }

        private async void BtnLogin_Click(object sender, EventArgs e)
        {
            // تحقق الحد الأدنى للإصدار قبل أي تسجيل دخول
            var enforceOk = await EnforceMinVersionOrExitAsync();
            if (!enforceOk)
            {
                return; // تم إنهاء التطبيق داخل الدالة
            }
            email = txtUsername.Text;
            string password = txtPassword.Text;
            var loginResult = await GetUserObjectAsync(email, password);
            if (loginResult != null)
            {
                userId = loginResult["user"]?["id"]?.ToString();
                fullName = loginResult["user"]?["user_metadata"]?["full_name"]?.ToString() ?? email;
                string token = loginResult["token"]?.ToString() ?? "";
                
                this.Tag = new Tuple<string, string, string, string>(userId, fullName, email, token);
                MessageBox.Show("تم تسجيل الدخول بنجاح!", "نجاح", MessageBoxButtons.OK, MessageBoxIcon.Information);
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            else
            {
                // تسجيل محاولة تسجيل دخول فاشلة
                LogError("LoginAttempt", new Exception("Invalid credentials"));
                MessageBox.Show("اسم المستخدم أو كلمة المرور غير صحيحة!", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private Version GetCurrentAppVersion()
        {
            try
            {
                var asm = System.Reflection.Assembly.GetExecutingAssembly();
                var ver = asm.GetName().Version;
                if (ver != null) return new Version(ver.Major, ver.Minor, ver.Build);
            }
            catch { }
            // fallback ثابت لو النسخة غير متوفرة
            return new Version(1, 0, 0);
        }

        private bool IsVersionLess(Version a, Version b)
        {
            if (a == null || b == null) return false;
            return a.CompareTo(b) < 0;
        }

        private async Task<bool> EnforceMinVersionOrExitAsync()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                    client.BaseAddress = new Uri(apiBaseUrl);
                    client.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                    client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                    var resp = await client.GetAsync("/api/app/min-version");
                    var json = await resp.Content.ReadAsStringAsync();
                    var obj = JObject.Parse(json);
                    if (obj["success"]?.ToString()?.ToLower() == "true")
                    {
                        var minStr = obj["minSupportedVersion"]?.ToString() ?? "0.0.0";
                        var force = obj["forceUpdate"]?.ToString()?.ToLower() == "true";
                        var downloadUrl = obj["downloadUrl"]?.ToString() ?? "";
                        var message = obj["message"]?.ToString() ?? "";

                        Version minVer;
                        if (!Version.TryParse(minStr, out minVer)) minVer = new Version(0, 0, 0);
                        var current = GetCurrentAppVersion();

                        if (force && IsVersionLess(current, minVer))
                        {
                            var text = string.IsNullOrWhiteSpace(message) ?
                                $"الإصدار الحالي ({current}) غير مدعوم. الحد الأدنى: {minVer}. يرجى التحديث." : message;
                            var result = MessageBox.Show(text + "\n\nهل تريد تحميل التحديث الآن؟", "تحديث مطلوب",
                                MessageBoxButtons.OKCancel, MessageBoxIcon.Warning);
                            if (result == DialogResult.OK)
                            {
                                try
                                {
                                    if (!string.IsNullOrWhiteSpace(downloadUrl))
                                        System.Diagnostics.Process.Start(downloadUrl);
                                }
                                catch { }
                                Application.Exit();
                                return false;
                            }
                            else
                            {
                                Application.Exit();
                                return false;
                            }
                        }
                    }
                }
            }
            catch { }
            return true;
        }

        private async Task<JObject> GetUserObjectAsync(string email, string password)
        {
            using (var client = new HttpClient())
            {
                // استخدام API endpoint الجديد بدلاً من Supabase مباشرة
                var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                client.BaseAddress = new Uri(apiBaseUrl);
                client.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                var data = new JObject
                {
                    ["email"] = email,
                    ["password"] = password
                };
                var content = new StringContent(data.ToString(), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/api/auth/signin", content);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var obj = JObject.Parse(json);
                    return obj; // إرجاع كامل الاستجابة بدلاً من user فقط
                }
                return null;
            }
        }

        private async Task<string> GetLastErrorContent(string email, string password)
        {
            using (var client = new HttpClient())
            {
                var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                client.BaseAddress = new Uri(apiBaseUrl);
                client.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                var data = new JObject
                {
                    ["email"] = email,
                    ["password"] = password
                };
                var content = new StringContent(data.ToString(), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/api/auth/signin", content);
                return await response.Content.ReadAsStringAsync();
            }
        }

        private void LoginForm_Load(object sender, EventArgs e)
        {

        }

        private void lblCreateAccount_Click(object sender, EventArgs e)
        {

        }

        // دالة تسجيل الأخطاء الآمنة
        private void LogError(string methodName, Exception ex)
        {
            try
            {
                // تسجيل الخطأ في ملف log آمن
                var logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {methodName}: {ex.GetType().Name} - {ex.Message}";
                
                // في الإنتاج، يجب إرسال الـ logs إلى خدمة logging آمنة
                System.Diagnostics.Debug.WriteLine(logMessage);
            }
            catch
            {
                // في حالة فشل تسجيل الخطأ، لا نفعل شيئاً
            }
        }
    }
}

