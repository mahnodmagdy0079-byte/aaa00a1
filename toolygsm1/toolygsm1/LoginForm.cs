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
            email = txtUsername.Text;
            string password = txtPassword.Text;
            var loginResult = await GetUserObjectAsync(email, password);
            if (loginResult != null)
            {
                userId = loginResult["user"]?["id"]?.ToString();
                fullName = loginResult["user"]?["user_metadata"]?["full_name"]?.ToString() ?? email;
                string token = loginResult["access_token"]?.ToString() ?? "";
                this.Tag = new Tuple<string, string, string, string>(userId, fullName, email, token);
                MessageBox.Show("تم تسجيل الدخول بنجاح!", "نجاح", MessageBoxButtons.OK, MessageBoxIcon.Information);
                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            else
            {
                var errorContent = await GetLastErrorContent(email, password);
                MessageBox.Show($"اسم المستخدم أو كلمة المرور غير صحيحة!\n\nتفاصيل الخطأ:\n{errorContent}", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async Task<JObject> GetUserObjectAsync(string email, string password)
        {
            using (var client = new HttpClient())
            {
                // استخدام API endpoint الجديد بدلاً من Supabase مباشرة
                client.BaseAddress = new Uri("https://eskuly.org");
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
                client.BaseAddress = new Uri("https://eskuly.org");
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
    }
}

