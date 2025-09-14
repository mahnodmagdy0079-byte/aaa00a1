using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Guna.UI2.WinForms;
using Newtonsoft.Json.Linq;
using ToolyGsm;

namespace toolygsm1
{
    public partial class Form1 : Form
    {
        private Guna2Button currentSectionButton;
        private Guna2HtmlLabel lblPackage;
        private Guna2HtmlLabel lblBalance;
        private Guna2HtmlLabel lblEndDate;
        private string userId = "";
        private string fullName = "";
        private string email = "";
        private string userToken = ""; // إضافة متغير لحفظ التوكن
        private FlowLayoutPanel requestsFlowPanel;
        private int requestsPage = 0;
        private const int requestsPageSize = 10;
        private Guna2Button btnNextRequests;
        private FlowLayoutPanel freeToolsFlowPanel;
        private Guna2TextBox searchBox;
        private Guna2Button searchButton;
        private List<JObject> allTools = new List<JObject>(); // لحفظ جميع الأدوات للبحث

        public Form1(string userId, string fullName, string email, string token = "")
        {
            InitializeComponent();
            
            // فحص الأمان مبسط لتجنب مشاكل Windows Defender
            // تم تعطيل الفحص المتقدم لتجنب مشاكل برنامج الحماية
            
            this.userId = userId;
            this.fullName = fullName;
            this.email = email;
            this.userToken = token; // حفظ التوكن
            
            // تم إزالة رسالة التحديث كما طلب المستخدم
            // أحداث أزرار الشريط المخصص
            btnClose.Click += (s, e) => this.Close();
            btnMinimize.Click += (s, e) => this.WindowState = FormWindowState.Minimized;
            // دعم سحب النافذة عند الضغط على الشريط
            customTitleBar.MouseDown += CustomTitleBar_MouseDown;
            btnHome.MouseEnter += SectionButton_MouseEnter;
            btnToolsFree.MouseEnter += SectionButton_MouseEnter;
            btnToolsWithCredit.MouseEnter += SectionButton_MouseEnter;
            btnHome.MouseLeave += SectionButton_MouseLeave;
            btnToolsFree.MouseLeave += SectionButton_MouseLeave;
            btnToolsWithCredit.MouseLeave += SectionButton_MouseLeave;
            btnHome.Click += SectionButton_Click;
            btnToolsFree.Click += SectionButton_Click;
            btnToolsWithCredit.Click += SectionButton_Click;
            btnToolsWithCredit.Click += btnToolsWithCredit_Click;
            // btnLog القسم الرابع
            btnLog.MouseEnter += SectionButton_MouseEnter;
            btnLog.MouseLeave += SectionButton_MouseLeave;
            btnLog.Click += SectionButton_Click;
            btnLog.Click += btnLog_Click;
            // btnRequestsLog موجود في ملف التصميم، فقط اربطه بالحدث
            btnRequestsLog.Click += btnRequestsLog_Click;
            currentSectionButton = btnHome;
            HighlightSection(currentSectionButton);
            AddWelcomeLabel();

            // منع النسخ العام من التطبيق
            this.KeyPreview = true;
            this.KeyDown += Form1_KeyDown;

            // إضافة panel لعرض الطلبات
            requestsFlowPanel = new FlowLayoutPanel();
            requestsFlowPanel.Dock = DockStyle.None;
            requestsFlowPanel.AutoScroll = true; // تفعيل التمرير
            requestsFlowPanel.Size = new Size(900, 600); // زيادة الارتفاع
            requestsFlowPanel.Location = new Point(sidebarPanel.Width + 20, 50);
            requestsFlowPanel.FlowDirection = FlowDirection.TopDown;
            requestsFlowPanel.WrapContents = false;
            this.Controls.Add(requestsFlowPanel);
            requestsFlowPanel.Visible = false;
            // زر التالي
            btnNextRequests = new Guna2Button();
            btnNextRequests.Text = "عرض المزيد";
            btnNextRequests.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnNextRequests.Size = new Size(150, 45);
            btnNextRequests.Location = new Point(requestsFlowPanel.Right - btnNextRequests.Width - 20, requestsFlowPanel.Top + requestsFlowPanel.Height - btnNextRequests.Height - 30);
            btnNextRequests.Visible = false;
            btnNextRequests.FillColor = Color.FromArgb(255, 165, 0);
            btnNextRequests.ForeColor = Color.White;
            btnNextRequests.BorderRadius = 22;
            btnNextRequests.Click += BtnNextRequests_Click;
            this.Controls.Add(btnNextRequests);

            // إضافة search box للأدوات المجانية
            searchBox = new Guna2TextBox();
            searchBox.PlaceholderText = "ابحث عن أداة...";
            searchBox.Font = new Font("Segoe UI", 12);
            searchBox.Size = new Size(300, 40);
            searchBox.Location = new Point(sidebarPanel.Width + 20, 50);
            searchBox.BorderRadius = 20;
            searchBox.FillColor = Color.FromArgb(30, 30, 30);
            searchBox.BorderColor = Color.FromArgb(255, 165, 0);
            searchBox.ForeColor = Color.White;
            searchBox.TextChanged += SearchBox_TextChanged;
            this.Controls.Add(searchBox);
            searchBox.Visible = false;

            // زر البحث
            searchButton = new Guna2Button();
            searchButton.Text = "🔍";
            searchButton.Font = new Font("Segoe UI", 14);
            searchButton.Size = new Size(50, 40);
            searchButton.Location = new Point(searchBox.Right + 10, 50);
            searchButton.BorderRadius = 20;
            searchButton.FillColor = Color.FromArgb(255, 165, 0);
            searchButton.ForeColor = Color.White;
            searchButton.Click += SearchButton_Click;
            this.Controls.Add(searchButton);
            searchButton.Visible = false;

            // إضافة panel لعرض الأدوات المجانية
            freeToolsFlowPanel = new FlowLayoutPanel();
            freeToolsFlowPanel.Dock = DockStyle.None;
            freeToolsFlowPanel.AutoScroll = true;
            freeToolsFlowPanel.Size = new Size(900, this.ClientSize.Height - 150); // تقليل الارتفاع لإفساح المجال للبحث
            freeToolsFlowPanel.Location = new Point(sidebarPanel.Width + 20, 100); // تحريك لأسفل لإفساح المجال للبحث
            freeToolsFlowPanel.FlowDirection = FlowDirection.TopDown;
            freeToolsFlowPanel.WrapContents = false;
            this.Controls.Add(freeToolsFlowPanel);
            freeToolsFlowPanel.Visible = false;
            // إعادة تفعيل التمرير الافتراضي للـ FlowLayoutPanel
            freeToolsFlowPanel.AutoScroll = true;
            // إزالة كل أكواد التمرير اليدوي وشريط Guna2VScrollBar

            // تحديث القيم عند إضافة الأدوات أو تغيير الحجم
            freeToolsFlowPanel.ControlAdded += (s, e) => UpdateFreeToolsScrollBar();
            freeToolsFlowPanel.SizeChanged += (s, e) => UpdateFreeToolsScrollBar();
            void UpdateFreeToolsScrollBar()
            {
                // لم يعد هناك حاجة لأي كود هنا بعد إزالة شريط Guna2
            }

            // ربط حدث btnHome.Click بالصفحة الرئيسية فعلياً
            btnHome.Click += btnHome_Click;
            btnSupport.Click += BtnSupport_Click;
            InitializeSupportPanel();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // إزالة كل خصائص شريط العنوان الافتراضي نهائياً
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.ControlBox = false;
            this.Text = string.Empty;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.ShowIcon = false;
            this.ShowInTaskbar = true;
            this.TopMost = false;
            this.Opacity = 1.0;
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.TransparencyKey = System.Drawing.Color.Empty;
            // في حدث OnLoad، اجعل المقاس دائماً يبدأ من المقاس الذي في Designer
            this.ClientSize = new Size(1136, 697);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            // لا تعيد أي خصائص لشريط العنوان الافتراضي هنا
            // فقط إعدادات الواجهة المخصصة
            // إضافة عناصر للقائمة إذا لم تكن موجودة
            if (userMenu.Items.Count == 0)
            {
                userMenu.Items.Add("Profile", null, UserMenu_Profile_Click);
                userMenu.Items.Add("Settings", null, UserMenu_Settings_Click);
                userMenu.Items.Add("Logout", null, UserMenu_Logout_Click);
            }
            // تحديث اسم المستخدم في الـ sidebar بعد تسجيل الدخول
            userNameLabel.Text = fullName;
            // تحميل البيانات بشكل غير متزامن بدون تعليق الواجهة
            _ = LoadUserDataAsync();
            // ضبط Anchor للعناصر
            infoCardPackage.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            infoCardBalance.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            infoCardEndDate.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            lblCardPackageValue.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            lblCardBalanceTitle.Anchor = AnchorStyles.Top | AnchorStyles.Left;
            lblCardBalanceValue.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            lblCardEndDateTitle.Anchor = AnchorStyles.Top | AnchorStyles.Left;
            lblCardEndDateValue.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;

            lblCardPackageValue.Font = new Font("Segoe UI", 14.4F, FontStyle.Bold); // تصغير بنسبة 20%
            // ضبط مكان الصورة في منتصف الكارت بعد حساب الحجم
            if (packagePic != null && infoCardPackage != null)
            {
                packagePic.Location = new Point((infoCardPackage.Width - packagePic.Width) / 2, 30);
            }
            // ضبط مكان النص في منتصف الكارت تحت الصورة
            UpdatePackageLabelPosition();
        }

        protected override void OnResize(EventArgs e)
        {
            base.OnResize(e);
            // ضبط panels الأخرى إذا لزم الأمر
            // ضبط مكان الصورة في منتصف الكارت عند تغيير الحجم
            if (packagePic != null && infoCardPackage != null)
            {
                packagePic.Location = new Point((infoCardPackage.Width - packagePic.Width) / 2, 30);
            }
            UpdatePackageLabelPosition();
        }

        private async Task LoadUserDataAsync()
        {
            // جلب الرصيد والترخيص عبر API
            using (var apiClient = new HttpClient())
            {
                var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                apiClient.BaseAddress = new Uri(apiBaseUrl);
                apiClient.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                apiClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                if (!string.IsNullOrEmpty(userToken) && SecurityConfig.IsValidToken(userToken))
                {
                    apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
                }
                
                try
                {
                    // إزالة العرض القديم للقيم
                    if (lblPackage != null) lblPackage.Visible = false;
                    if (lblBalance != null) lblBalance.Visible = false;
                    if (lblEndDate != null) lblEndDate.Visible = false;

                    // جلب رصيد المحفظة عبر API
                    var balanceData = new JObject { ["user_id"] = userId };
                    var balanceContent = new StringContent(balanceData.ToString(), Encoding.UTF8, "application/json");
                    var balanceResponse = await apiClient.PostAsync("/api/wallet/balance", balanceContent);
                    var balance = "0";
                    if (balanceResponse.IsSuccessStatusCode)
                    {
                        var balanceJson = await balanceResponse.Content.ReadAsStringAsync();
                        var balanceObj = JObject.Parse(balanceJson);
                        if (balanceObj["success"]?.ToString().ToLower() == "true")
                        {
                            balance = balanceObj["balance"]?.ToString() ?? "0";
                        }
                    }
                    lblBalance.Text = $"Balance: {balance}";

                    // جلب معلومات الباقة عبر API
                    var licenseResponse = await apiClient.PostAsync("/api/license/check", new StringContent("{}", Encoding.UTF8, "application/json"));
                    
                    string package = "-";
                    string endDate = "-";
                    if (licenseResponse.IsSuccessStatusCode)
                    {
                        var licenseJson = await licenseResponse.Content.ReadAsStringAsync();
                        var licenseObj = JObject.Parse(licenseJson);
                        if (licenseObj["valid"]?.ToString() == "True")
                        {
                            var license = licenseObj["license"];
                            package = license["package_name"]?.ToString() ?? "-";
                            endDate = license["end_date"]?.ToString() ?? "-";
                        }
                    }

                    lblPackage.Text = $"Package: {package}";
                    lblEndDate.Text = $"End Date: {endDate}";
                    var daysLeft = "-";
                    if (DateTime.TryParse(endDate, out DateTime endDateDt2))
                    {
                        daysLeft = ((int)Math.Ceiling((endDateDt2 - DateTime.Now).TotalDays)).ToString();
                    }
                    // فقط عدد الأيام المتبقية
                    lblEndDate.Text = daysLeft != "-" ? $"Days left: {daysLeft}" : "Days left: -";

                    // تحديث القيم في البانلز الجديدة
                    lblCardPackageValue.Text = package;
                    lblCardBalanceValue.Text = balance;
                    lblCardEndDateValue.Text = daysLeft;

                    // جلب آخر طلبين للمستخدم عبر API
                    var historyData = new JObject { ["user_email"] = email };
                    var historyContent = new StringContent(historyData.ToString(), Encoding.UTF8, "application/json");
                    var historyResponse = await apiClient.PostAsync("/api/tool-requests/history", historyContent);
                    
                    var activities = new List<(string toolName, string price, string status, string details, string icon)>();
                    if (historyResponse.IsSuccessStatusCode)
                    {
                        var historyJson = await historyResponse.Content.ReadAsStringAsync();
                        var historyObj = JObject.Parse(historyJson);
                        if (historyObj["success"]?.ToString().ToLower() == "true")
                        {
                            var requests = historyObj["requests"] as JArray;
                            if (requests != null)
                            {
                                var recentRequests = requests.Take(2);
                                foreach (var req in recentRequests)
                                {
                                    string toolName = req["tool_name"]?.ToString() ?? "-";
                                    string price = req["price"]?.ToString() ?? "-";
                                    string status = req["status_ar"]?.ToString() ?? "-";
                                    string details = $"تاريخ: {req["created_at"]?.ToString()?.Split('T')[0] ?? "-"}";
                                    string icon = status == "جاري" ? "🟠" : (status == "منتهي" || status == "تم") ? "🟢" : "🔴";
                                    activities.Add((toolName, price, status, details, icon));
                                }
                            }
                        }
                    }
                    UpdateRecentActivityUI(activities);
                }
                catch (Exception ex)
                {
                    // تسجيل الخطأ بشكل آمن
                    LogError("LoadUserDataAsync", ex);
                    MessageBox.Show("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void btnToolsWithCredit_Click(object sender, EventArgs e)
        {
            ShowComingSoonPanel();
        }

        // دالة عرض صفحة Coming Soon للمشتركين
        private void ShowComingSoonPanel()
        {
            // إخفاء جميع اللوحات الأخرى
            ShowHomeSection(false);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false;
            supportPanel.Visible = false;
            searchBox.Visible = false;
            searchButton.Visible = false;

            // إنشاء لوحة Coming Soon
            var comingSoonPanel = new Panel();
            comingSoonPanel.Size = new Size(this.ClientSize.Width - sidebarPanel.Width, this.ClientSize.Height - customTitleBar.Height);
            comingSoonPanel.Location = new Point(sidebarPanel.Width, customTitleBar.Height);
            comingSoonPanel.BackColor = Color.FromArgb(15, 15, 15);
            comingSoonPanel.Visible = true;
            comingSoonPanel.Name = "comingSoonPanel";

            // إزالة اللوحة القديمة إذا كانت موجودة
            var existingPanel = this.Controls.Find("comingSoonPanel", false).FirstOrDefault();
            if (existingPanel != null)
            {
                this.Controls.Remove(existingPanel);
            }

            // إضافة اللوحة الجديدة
            this.Controls.Add(comingSoonPanel);
            comingSoonPanel.BringToFront();

            // عنوان Coming Soon
            var lblComingSoon = new Label();
            lblComingSoon.Text = "🚀 قريباً";
            lblComingSoon.Font = new Font("Segoe UI", 48, FontStyle.Bold);
            lblComingSoon.ForeColor = Color.FromArgb(255, 100, 0);
            lblComingSoon.AutoSize = true;
            lblComingSoon.BackColor = Color.Transparent;
            lblComingSoon.Location = new Point((comingSoonPanel.Width - 300) / 2, 80);
            comingSoonPanel.Controls.Add(lblComingSoon);

            // النص التوضيحي
            var lblDescription = new Label();
            lblDescription.Text = "صفحة المشتركين قيد التطوير\nستكون متاحة قريباً مع ميزات حصرية";
            lblDescription.Font = new Font("Segoe UI", 18, FontStyle.Regular);
            lblDescription.ForeColor = Color.White;
            lblDescription.AutoSize = false;
            lblDescription.Size = new Size(600, 100);
            lblDescription.TextAlign = ContentAlignment.MiddleCenter;
            lblDescription.BackColor = Color.Transparent;
            lblDescription.Location = new Point((comingSoonPanel.Width - 600) / 2, 180);
            comingSoonPanel.Controls.Add(lblDescription);

            // أيقونة التطوير
            var lblIcon = new Label();
            lblIcon.Text = "⚙️";
            lblIcon.Font = new Font("Segoe UI", 72, FontStyle.Regular);
            lblIcon.ForeColor = Color.FromArgb(255, 100, 0);
            lblIcon.AutoSize = true;
            lblIcon.BackColor = Color.Transparent;
            lblIcon.Location = new Point((comingSoonPanel.Width - 100) / 2, 320);
            comingSoonPanel.Controls.Add(lblIcon);

            // رسالة إضافية
            var lblMessage = new Label();
            lblMessage.Text = "نعمل على تطوير ميزات حصرية للمشتركين\nشكراً لصبركم!";
            lblMessage.Font = new Font("Segoe UI", 14, FontStyle.Italic);
            lblMessage.ForeColor = Color.FromArgb(200, 200, 200);
            lblMessage.AutoSize = false;
            lblMessage.Size = new Size(500, 60);
            lblMessage.TextAlign = ContentAlignment.MiddleCenter;
            lblMessage.BackColor = Color.Transparent;
            lblMessage.Location = new Point((comingSoonPanel.Width - 500) / 2, 450);
            comingSoonPanel.Controls.Add(lblMessage);

            // زر العودة للرئيسية
            var btnBackToHome = new Guna2Button();
            btnBackToHome.Text = "العودة للرئيسية";
            btnBackToHome.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnBackToHome.Size = new Size(200, 45);
            btnBackToHome.Location = new Point((comingSoonPanel.Width - 200) / 2, 550);
            btnBackToHome.FillColor = Color.FromArgb(255, 100, 0);
            btnBackToHome.ForeColor = Color.White;
            btnBackToHome.BorderRadius = 8;
            btnBackToHome.Cursor = Cursors.Hand;
            btnBackToHome.Click += (s, e) => {
                this.Controls.Remove(comingSoonPanel);
                btnHome_Click(s, e);
            };
            comingSoonPanel.Controls.Add(btnBackToHome);
        }

        private void SectionButton_MouseEnter(object sender, EventArgs e)
        {
            var btn = sender as Guna2Button;
            btn.ForeColor = Color.Orange;
        }

        private void SectionButton_MouseLeave(object sender, EventArgs e)
        {
            var btn = sender as Guna2Button;
            if (btn != currentSectionButton)
                btn.ForeColor = Color.White;
        }

        private void SectionButton_Click(object sender, EventArgs e)
        {
            if (currentSectionButton != null)
                currentSectionButton.ForeColor = Color.White;
            currentSectionButton = sender as Guna2Button;
            HighlightSection(currentSectionButton);
        }

        private void HighlightSection(Guna2Button btn)
        {
            btn.ForeColor = Color.Orange;
        }

        private void AddWelcomeLabel()
        {
            lblPackage = new Guna2HtmlLabel();
            lblPackage.Text = "Package: ...";
            lblPackage.Font = new Font("Segoe UI", 14, FontStyle.Bold);
            lblPackage.ForeColor = Color.Orange;
            lblPackage.BackColor = Color.Transparent;
            lblPackage.AutoSize = true;
            lblPackage.Location = new Point((this.ClientSize.Width - lblPackage.Width) / 2 + 90, 70);
            lblPackage.Anchor = AnchorStyles.Top;
            PreventTextSelection(lblPackage);
            this.Controls.Add(lblPackage);
            lblPackage.BringToFront();

            lblBalance = new Guna2HtmlLabel();
            lblBalance.Text = "Balance: ...";
            lblBalance.Font = new Font("Segoe UI", 14, FontStyle.Bold);
            lblBalance.ForeColor = Color.Orange;
            lblBalance.BackColor = Color.Transparent;
            lblBalance.AutoSize = true;
            lblBalance.Location = new Point((this.ClientSize.Width - lblBalance.Width) / 2 + 90, 110);
            lblBalance.Anchor = AnchorStyles.Top;
            PreventTextSelection(lblBalance);
            this.Controls.Add(lblBalance);
            lblBalance.BringToFront();

            lblEndDate = new Guna2HtmlLabel();
            lblEndDate.Text = "End Date: ...";
            lblEndDate.Font = new Font("Segoe UI", 14, FontStyle.Bold);
            lblEndDate.ForeColor = Color.Orange;
            lblEndDate.BackColor = Color.Transparent;
            lblEndDate.AutoSize = true;
            lblEndDate.Location = new Point((this.ClientSize.Width - lblEndDate.Width) / 2 + 90, 150);
            lblEndDate.Anchor = AnchorStyles.Top;
            PreventTextSelection(lblEndDate);
            this.Controls.Add(lblEndDate);
            lblEndDate.BringToFront();
        }

        private void btnHome_Click(object sender, EventArgs e)
        {
            // إزالة لوحة Coming Soon إذا كانت موجودة
            var comingSoonPanel = this.Controls.Find("comingSoonPanel", false).FirstOrDefault();
            if (comingSoonPanel != null)
            {
                this.Controls.Remove(comingSoonPanel);
            }
            
            ShowHomeSection(true);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false; // إخفاء الأدوات المجانية عند العودة للرئيسية
            searchBox.Visible = false;
            searchButton.Visible = false;
            supportPanel.Visible = false;
            // إعادة تحميل بيانات المستخدم عند العودة للرئيسية
            _ = LoadUserDataAsync();
        }

        private void Form1_Shown(object sender, EventArgs e)
        {
            // تغيير لون خلفية الـ sidebarPanel
            sidebarPanel.BackColor = Color.FromArgb(30, 30, 30);
            // تغيير لون خلفية نافذة البرنامج الرئيسية
            this.BackColor = Color.FromArgb(27, 27, 27);
            // تحديث اسم المستخدم في الـ sidebar بعد تسجيل الدخول
            userNameLabel.Text = fullName;
        }

        private void userPic_Click(object sender, EventArgs e)
        {

        }

        private void guna2Button1_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void UserMenu_Show(object sender, EventArgs e)
        {
            Control ctrl = sender as Control;
            if (ctrl != null && userMenu != null)
                userMenu.Show(ctrl, new System.Drawing.Point(0, ctrl.Height));
        }
        private void UserMenu_Profile_Click(object sender, EventArgs e)
        {
            // تم إزالة رسالة debugging
        }
        private void UserMenu_Settings_Click(object sender, EventArgs e)
        {
            // تم إزالة رسالة debugging
        }
        private void UserMenu_Logout_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }

        private void btnRequestsLog_Click(object sender, EventArgs e)
        {
            // هنا يمكنك فتحنافذة سجل الطلبات أو عرض محتوى القسم
            // تم إزالة رسالة debugging
        }

        private void infoCardPackage_Paint(object sender, PaintEventArgs e)
        {

        }

        private void btnHome_Click_1(object sender, EventArgs e)
        {

        }

        private void sidebarPanel_Paint(object sender, PaintEventArgs e)
        {
            // رسم بلور (ظل خفيف) خلف الفواصل
            // الفاصل الأول
            int sep1X = separatorHomeToWithCredit.Location.X;
            int sep1Y = separatorHomeToWithCredit.Location.Y + separatorHomeToWithCredit.Height / 2;
            int sep1W = separatorHomeToWithCredit.Width;
            for (int i = 1; i <= 8; i++)
            {
                using (var pen = new Pen(Color.FromArgb(20 - i*2, 0, 0, 0), i))
                {
                    e.Graphics.DrawLine(pen, sep1X, sep1Y + i, sep1X + sep1W, sep1Y + i);
                }
            }
            // الفاصل الثاني
            int sep2X = separatorWithCreditToFree.Location.X;
            int sep2Y = separatorWithCreditToFree.Location.Y + separatorWithCreditToFree.Height / 2;
            int sep2W = separatorWithCreditToFree.Width;
            for (int i = 1; i <= 8; i++)
            {
                using (var pen = new Pen(Color.FromArgb(20 - i*2, 0, 0, 0), i))
                {
                    e.Graphics.DrawLine(pen, sep2X, sep2Y + i, sep2X + sep2W, sep2Y + i);
                }
            }
        }

        private void btnToolsWithCredit_Click_1(object sender, EventArgs e)
        {

        }

        private void btnLog_Click(object sender, EventArgs e)
        {
            // إزالة لوحة Coming Soon إذا كانت موجودة
            var comingSoonPanel = this.Controls.Find("comingSoonPanel", false).FirstOrDefault();
            if (comingSoonPanel != null)
            {
                this.Controls.Remove(comingSoonPanel);
            }
            
            ShowHomeSection(false);
            requestsPage = 0;
            requestsFlowPanel.Visible = true;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false; // إخفاء الأدوات عند عرض السجل
            supportPanel.Visible = false;
            
            // إخفاء البحث عند عرض السجل
            searchBox.Visible = false;
            searchButton.Visible = false;
            
            // تم إزالة العنوان كما طلب المستخدم
            
            _ = ShowUserToolRequestsAsync();
        }

        private void BtnNextRequests_Click(object sender, EventArgs e)
        {
            requestsPage++;
            _ = ShowUserToolRequestsAsync();
        }

        private void ShowHomeSection(bool show)
        {
            infoCardPackage.Visible = show;
            infoCardBalance.Visible = show;
            infoCardEndDate.Visible = show;
            lblCardPackageValue.Visible = show;
            lblCardBalanceTitle.Visible = show;
            lblCardBalanceValue.Visible = show;
            lblCardEndDateTitle.Visible = show;
            lblCardEndDateValue.Visible = show;
            lblPackage.Visible = show;
            
            // إخفاء البحث عند العودة للرئيسية
            searchBox.Visible = false;
            searchButton.Visible = false;
            lblBalance.Visible = show;
            lblEndDate.Visible = show;
            // إظهار أو إخفاء كروت السجل وكلمة Recent Activity فقط في الرئيسية
            recentActivityCard1.Visible = show;
            recentActivityCard2.Visible = show;
            lblRecentActivity.Visible = show;
            picRecentActivity.Visible = show;
            supportPanel.Visible = false;
        }

        private async Task ShowUserToolRequestsAsync()
        {
            // تم إزالة رسالة التحميل كما طلب المستخدم
            
            // جلب سجل الطلبات عبر API
            using (var apiClient = new HttpClient())
            {
                var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                apiClient.BaseAddress = new Uri(apiBaseUrl);
                apiClient.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                apiClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                if (!string.IsNullOrEmpty(userToken) && SecurityConfig.IsValidToken(userToken))
                {
                    apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
                }
                try
                {
                    // جلب سجل الطلبات عبر API
                    var historyData = new JObject { ["user_email"] = email };
                    var historyContent = new StringContent(historyData.ToString(), Encoding.UTF8, "application/json");
                    var historyResponse = await apiClient.PostAsync("/api/tool-requests/history", historyContent);
                    
                    requestsFlowPanel.Controls.Clear();
                    requestsFlowPanel.Visible = true;
                    btnNextRequests.Visible = false;
                    
                    if (historyResponse.IsSuccessStatusCode)
                    {
                        var historyJson = await historyResponse.Content.ReadAsStringAsync();
                        var historyObj = JObject.Parse(historyJson);
                        
                        if (historyObj["success"]?.ToString().ToLower() == "true")
                        {
                            var requests = historyObj["requests"] as JArray;
                            if (requests != null && requests.Count > 0)
                            {
                                // تطبيق pagination
                                int offset = requestsPage * requestsPageSize;
                                var pageRequests = requests.Skip(offset).Take(requestsPageSize);
                                
                                foreach (var req in pageRequests)
                                {
                                    
                                    var card = new Guna2ShadowPanel();
                                    card.Size = new Size(requestsFlowPanel.Width - 60, 150); // تصغير العرض لإزالة الـ scroll الأفقي
                                    card.Margin = new Padding(20, 15, 20, 15); // زيادة الهوامش
                                    card.Radius = 20; // زيادة نصف القطر
                                    card.ShadowColor = Color.Black;
                                    card.ShadowStyle = Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
                                    card.FillColor = Color.FromArgb(20, 20, 20); // نفس لون كارت الأدوات المجانية

                                    // مؤشر الحالة على اليمين
                                    var progress = new Guna2CircleProgressBar();
                                    progress.Size = new Size(70, 70);
                                    progress.Location = new Point(card.Width - progress.Width - 25, 25);
                                    progress.Minimum = 0;
                                    progress.Maximum = 100;
                                    progress.Value = 0;
                                    progress.FillColor = Color.FromArgb(200, 213, 218, 223);
                                    progress.Font = new Font("Segoe UI", 12, FontStyle.Bold);
                                    progress.ForeColor = Color.White;
                                    
                                    string status = req["status_ar"]?.ToString()?.Trim() ?? "-";
                                    if (status == "جاري" || status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
                                    {
                                        progress.ProgressColor = Color.Orange;
                                        progress.Value = 50;
                                    }
                                    else if (status == "مكتمل" || status == "تم" || status.Equals("Done", StringComparison.OrdinalIgnoreCase))
                                    {
                                        progress.ProgressColor = Color.Green;
                                        progress.Value = 100;
                                    }
                                    else if (status == "مرفوض" || status.Equals("Rejected", StringComparison.OrdinalIgnoreCase))
                                    {
                                        progress.ProgressColor = Color.Red;
                                        progress.Value = 100;
                                    }
                                    else
                                    {
                                        progress.ProgressColor = Color.Gray;
                                        progress.Value = 0;
                                    }

                                    // اسم الأداة على الشمال
                                    var lblTool = new Label();
                                    lblTool.Text = req["tool_name"]?.ToString() ?? "-";
                                    lblTool.Font = new Font("Segoe UI", 14, FontStyle.Bold);
                                    lblTool.ForeColor = Color.White;
                                    lblTool.Location = new Point(25, 20);
                                    lblTool.AutoSize = true;

                                    // السعر تحت اسم الأداة
                                    var lblPrice = new Label();
                                    var price = req["price"]?.ToString() ?? "0";
                                    var priceText = price == "0" ? "مجاني" : $"{price} جنيه";
                                    lblPrice.Text = $"السعر: {priceText}";
                                    lblPrice.Font = new Font("Segoe UI", 12, FontStyle.Regular);
                                    lblPrice.ForeColor = Color.FromArgb(255, 165, 0);
                                    lblPrice.Location = new Point(25, lblTool.Bottom + 5);
                                    lblPrice.AutoSize = true;

                                    // نوع الشراء
                                    var lblPurchaseType = new Label();
                                    var purchaseType = req["purchase_type"]?.ToString() ?? "-";
                                    var purchaseTypeText = purchaseType == "subscription" ? "عن طريق الباقة" : 
                                                          purchaseType == "credit" ? "عن طريق الكريدت" : purchaseType;
                                    lblPurchaseType.Text = $"النوع: {purchaseTypeText}";
                                    lblPurchaseType.Font = new Font("Segoe UI", 10, FontStyle.Regular);
                                    lblPurchaseType.ForeColor = Color.FromArgb(200, 200, 200);
                                    lblPurchaseType.Location = new Point(25, lblPrice.Bottom + 3);
                                    lblPurchaseType.AutoSize = true;

                                    // تاريخ الطلب
                                    var lblDate = new Label();
                                    var createdDate = req["created_at"]?.ToString() ?? "-";
                                    if (DateTime.TryParse(createdDate, out DateTime parsedDate))
                                    {
                                        lblDate.Text = $"التاريخ: {parsedDate:yyyy-MM-dd HH:mm}";
                                    }
                                    else
                                    {
                                        lblDate.Text = $"التاريخ: {createdDate}";
                                    }
                                    lblDate.Font = new Font("Segoe UI", 10, FontStyle.Regular);
                                    lblDate.ForeColor = Color.FromArgb(180, 180, 180);
                                    lblDate.Location = new Point(25, lblPurchaseType.Bottom + 3);
                                    lblDate.AutoSize = true;

                                    card.Controls.Add(lblTool);
                                    card.Controls.Add(lblPrice);
                                    card.Controls.Add(lblPurchaseType);
                                    card.Controls.Add(lblDate);
                                    card.Controls.Add(progress);
                                    requestsFlowPanel.Controls.Add(card);
                                }
                                
                                // إظهار زر "عرض المزيد" إذا كان هناك المزيد من الطلبات
                                btnNextRequests.Visible = requests.Count > (offset + requestsPageSize);
                            }
                            else
                            {
                                var noRequestsPanel = new Guna2ShadowPanel();
                                noRequestsPanel.Size = new Size(requestsFlowPanel.Width - 60, 150);
                                noRequestsPanel.Margin = new Padding(15, 20, 15, 20);
                                noRequestsPanel.Radius = 15;
                                noRequestsPanel.FillColor = Color.FromArgb(30, 30, 30);
                                
                                var lbl = new Label();
                                lbl.Text = "لا يوجد طلبات أدوات لهذا المستخدم";
                                lbl.Font = new Font("Segoe UI", 16, FontStyle.Bold);
                                lbl.ForeColor = Color.FromArgb(255, 165, 0);
                                lbl.AutoSize = true;
                                lbl.Location = new Point((noRequestsPanel.Width - lbl.Width) / 2, 50);
                                
                                var lblSub = new Label();
                                lblSub.Text = "ستظهر طلباتك هنا بعد إرسالها";
                                lblSub.Font = new Font("Segoe UI", 12, FontStyle.Regular);
                                lblSub.ForeColor = Color.FromArgb(200, 200, 200);
                                lblSub.AutoSize = true;
                                lblSub.Location = new Point((noRequestsPanel.Width - lblSub.Width) / 2, lbl.Bottom + 10);
                                
                                noRequestsPanel.Controls.Add(lbl);
                                noRequestsPanel.Controls.Add(lblSub);
                                requestsFlowPanel.Controls.Add(noRequestsPanel);
                                btnNextRequests.Visible = false;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    // تسجيل الخطأ بشكل آمن
                    LogError("ShowUserToolRequestsAsync", ex);
                    MessageBox.Show("حدث خطأ أثناء جلب سجل الطلبات. يرجى المحاولة مرة أخرى.", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void guna2RadialGauge1_ValueChanged(object sender, EventArgs e)
        {

        }

        private async Task LoadFreeToolsAsync()
        {
            // جلب الأدوات مباشرة من Supabase
            using (var supabaseClient = new HttpClient())
            {
                var supabaseBaseUrl = SecurityConfig.GetSupabaseBaseUrl();
                var supabaseApiKey = SecurityConfig.GetSupabaseApiKey();
                supabaseClient.BaseAddress = new Uri(supabaseBaseUrl);
                supabaseClient.DefaultRequestHeaders.Add("apikey", supabaseApiKey);
                supabaseClient.DefaultRequestHeaders.Add("Authorization", supabaseApiKey);
                
                try
                {
                    // جلب الأدوات مباشرة من Supabase مثل الموقع
                    var response = await supabaseClient.GetAsync("/rest/v1/tools?select=*&order=name");
                    var json = await response.Content.ReadAsStringAsync();
                    JArray tools = null;
                    try { tools = JArray.Parse(json); } catch { tools = new JArray(); }
                    
                    // حفظ جميع الأدوات في allTools للبحث
                    allTools.Clear();
                    foreach (var tool in tools)
                    {
                        allTools.Add((JObject)tool);
                    }
                    
                    freeToolsFlowPanel.Controls.Clear();
                    // إعادة تفعيل التمرير الافتراضي للـ FlowLayoutPanel
                    freeToolsFlowPanel.AutoScroll = true;
                    
                    // عرض جميع الأدوات باستخدام دالة DisplayTools
                    DisplayTools(allTools);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"حدث خطأ أثناء جلب الأدوات: {ex.Message}", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void btnToolsFree_Click(object sender, EventArgs e)
        {
            // إزالة لوحة Coming Soon إذا كانت موجودة
            var comingSoonPanel = this.Controls.Find("comingSoonPanel", false).FirstOrDefault();
            if (comingSoonPanel != null)
            {
                this.Controls.Remove(comingSoonPanel);
            }
            
            ShowHomeSection(false);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
            supportPanel.Visible = false;
            ShowFreeToolsPanel(true);
            _ = LoadFreeToolsAsync();
        }

        private void infoCardEndDate_Paint(object sender, PaintEventArgs e)
        {

        }

        private void separatorHomeToWithCredit_Click(object sender, EventArgs e)
        {

        }

        private void lblCardBalanceValue_Click(object sender, EventArgs e)
        {

        }

        private void UpdatePackageLabelPosition()
        {
            // اجعل النص دائماً في منتصف الكارت تحت الصورة
            if (lblCardPackageValue != null && infoCardPackage != null && packagePic != null)
            {
                lblCardPackageValue.AutoSize = false;
                lblCardPackageValue.Width = infoCardPackage.Width;
                int underPicY = packagePic.Bottom + 10;
                lblCardPackageValue.Location = new Point(0, underPicY);
                lblCardPackageValue.TextAlignment = System.Drawing.ContentAlignment.MiddleCenter;
                lblCardPackageValue.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            }
        }

        private void lblCardPackageValue_Click(object sender, EventArgs e)
        {
            UpdatePackageLabelPosition();
        }

        private void guna2PictureBox1_Click(object sender, EventArgs e)
        {

        }

        // تحديث الأنشطة الأخيرة في وقت التشغيل
        private void UpdateRecentActivityUI(List<(string toolName, string price, string status, string details, string icon)> activities)
        {
            // تحديث الكارت الأول
            if (activities.Count > 0)
                SetRecentActivityCardContent(1, activities[0].toolName, activities[0].price, activities[0].details);
            else
                SetRecentActivityCardContent(1, "-", "-", "-");
            // تحديث الكارت الثاني
            if (activities.Count > 1)
                SetRecentActivityCardContent(2, activities[1].toolName, activities[1].price, activities[1].details);
            else
                SetRecentActivityCardContent(2, "-", "-", "-");
        }

        // تحديث النصوص فقط للعناصر الموجودة في المصمم
        private void SetRecentActivityCardContent(int cardIndex, string toolName, string price, string details)
        {
            if (cardIndex == 1)
            {
                lblToolName1.Text = toolName;
                lblPrice1.Text = price;
                lblDetails1.Text = details;
            }
            else if (cardIndex == 2)
            {
                lblToolName2.Text = toolName;
                lblPrice2.Text = price;
                lblDetails2.Text = details;
            }
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

        private void InitializeSupportPanel()
        {
            supportPanel.Controls.Clear();
            // عنوان كبير
            var lblSupport = new Label();
            lblSupport.Text = "Support";
            lblSupport.Font = new Font("Segoe UI", 48, FontStyle.Bold);
            lblSupport.ForeColor = Color.White;
            lblSupport.AutoSize = true;
            lblSupport.BackColor = Color.Transparent;
            lblSupport.Location = new Point((supportPanel.Width - 400) / 2, 60);
            supportPanel.Controls.Add(lblSupport);

            // بيانات الأزرار
            var supportItems = new[]
            {
                new { Name = "Whatsapp", Resource = Properties.Resources.whatsapp, Url = "https://wa.me/201098049153" },
                new { Name = "Website", Resource = Properties.Resources.website, Url = "https://eskuly.org" },
                new { Name = "Telegram", Resource = Properties.Resources.telegram, Url = "https://t.me/toolygsm" },
                new { Name = "Facebook", Resource = Properties.Resources.facebook, Url = "https://facebook.com/toolygsm" }
            };
            int btnSize = 180;
            int spacing = 40;
            int totalWidth = (btnSize * 4) + (spacing * 3);
            // تحريك الكروت لليسار: قلل الهامش الجانبي
            int startX = (supportPanel.Width - totalWidth) / 2 - 60;
            if (startX < 20) startX = 20;
            int y = 200;
            for (int i = 0; i < supportItems.Length; i++)
            {
                var item = supportItems[i];
                var card = new Guna2ShadowPanel();
                card.Width = card.Height = btnSize;
                card.Left = startX + i * (btnSize + spacing);
                card.Top = y;
                card.Radius = 24;
                card.ShadowColor = Color.Black;
                card.ShadowStyle = Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
                card.FillColor = Color.FromArgb(225, 104, 44);
                card.BackColor = Color.Transparent;
                // صورة
                var pic = new PictureBox();
                pic.Image = item.Resource;
                pic.SizeMode = PictureBoxSizeMode.Zoom;
                pic.Width = pic.Height = 70;
                pic.Top = 28;
                pic.Left = (btnSize - pic.Width) / 2;
                pic.BackColor = Color.Transparent;
                // نص
                var lbl = new Label();
                lbl.Text = item.Name;
                lbl.Font = new Font("Segoe UI", 16, FontStyle.Bold);
                lbl.ForeColor = Color.White;
                lbl.BackColor = Color.Transparent;
                lbl.TextAlign = ContentAlignment.MiddleCenter;
                lbl.AutoSize = false;
                lbl.Width = btnSize;
                lbl.Height = 40;
                lbl.Top = 110;
                lbl.Left = 0;
                // حدث الضغط
                card.Cursor = Cursors.Hand;
                card.Click += (s, e) => { System.Diagnostics.Process.Start(item.Url); };
                pic.Click += (s, e) => { System.Diagnostics.Process.Start(item.Url); };
                lbl.Click += (s, e) => { System.Diagnostics.Process.Start(item.Url); };
                card.Controls.Add(pic);
                card.Controls.Add(lbl);
                supportPanel.Controls.Add(card);
            }
        }

        private void BtnSupport_Click(object sender, EventArgs e)
        {
            // إزالة لوحة Coming Soon إذا كانت موجودة
            var comingSoonPanel = this.Controls.Find("comingSoonPanel", false).FirstOrDefault();
            if (comingSoonPanel != null)
            {
                this.Controls.Remove(comingSoonPanel);
            }
            
            if (currentSectionButton != null)
                currentSectionButton.ForeColor = Color.White;
            currentSectionButton = btnSupport;
            HighlightSection(currentSectionButton);
            ShowHomeSection(false);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false;
            
            // إخفاء البحث عند عرض الدعم
            searchBox.Visible = false;
            searchButton.Visible = false;
            
            supportPanel.Visible = true;
            supportPanel.BringToFront();
        }

        private void guna2HScrollBar1_Scroll(object sender, ScrollEventArgs e)
        {

        }

        // ضبط مكان شريط التمرير ليكون بجانب freeToolsFlowPanel فقط عند إظهار الأدوات المجانية
        private void ShowFreeToolsPanel(bool show)
        {
            freeToolsFlowPanel.Visible = show;
            searchBox.Visible = show;
            searchButton.Visible = show;
            if (show)
            {
                // اجعل الشريط ملاصق لليمين بجانب freeToolsFlowPanel
                freeToolsFlowPanel.Location = new Point(sidebarPanel.Width + 20, 100);
            }
        }

        // دالة البحث عند تغيير النص
        private void SearchBox_TextChanged(object sender, EventArgs e)
        {
            FilterTools();
        }

        // دالة البحث عند الضغط على زر البحث
        private void SearchButton_Click(object sender, EventArgs e)
        {
            FilterTools();
        }

        // دالة تصفية الأدوات حسب البحث
        private void FilterTools()
        {
            if (allTools.Count == 0) return;

            string searchText = searchBox.Text.Trim().ToLower();
            freeToolsFlowPanel.Controls.Clear();

            if (string.IsNullOrEmpty(searchText))
            {
                // عرض جميع الأدوات إذا كان البحث فارغ
                DisplayTools(allTools);
            }
            else
            {
                // تصفية الأدوات حسب النص
                var filteredTools = allTools.Where(tool => 
                {
                    string toolName = tool["name"]?.ToString()?.ToLower() ?? "";
                    string toolDescription = tool["description"]?.ToString()?.ToLower() ?? "";
                    return toolName.Contains(searchText) || toolDescription.Contains(searchText);
                }).ToList();

                DisplayTools(filteredTools);
            }
        }

        // دالة عرض الأدوات
        private void DisplayTools(List<JObject> tools)
        {
            if (tools.Count == 0)
            {
                var lbl = new Label();
                lbl.Text = "لا توجد أدوات تطابق البحث.";
                lbl.Font = new Font("Segoe UI", 14, FontStyle.Bold);
                lbl.ForeColor = Color.Orange;
                lbl.AutoSize = true;
                freeToolsFlowPanel.Controls.Add(lbl);
                return;
            }

            foreach (var tool in tools)
            {
                var card = new Guna2ShadowPanel();
                card.Size = new Size(freeToolsFlowPanel.Width - 40, 140);
                card.Margin = new Padding(10);
                card.Radius = 12;
                card.ShadowColor = Color.Black;
                card.ShadowStyle = Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
                card.FillColor = Color.FromArgb(20, 20, 20);

                // صورة الأداة
                var pic = new Guna2PictureBox();
                pic.Size = new Size(100, 100);
                pic.Location = new Point(20, 20);
                pic.SizeMode = PictureBoxSizeMode.Zoom;
                string imgUrl = tool["image_url"]?.ToString() ?? "";
                if (!string.IsNullOrWhiteSpace(imgUrl))
                {
                    try { pic.LoadAsync(imgUrl); } catch { }
                }
                card.Controls.Add(pic);

                // اسم الأداة
                var lblName = new Guna2HtmlLabel();
                lblName.Text = tool["name"]?.ToString() ?? "أداة غير معروفة";
                lblName.Font = new Font("Segoe UI", 13, FontStyle.Bold);
                lblName.ForeColor = Color.White;
                lblName.BackColor = Color.Transparent;
                lblName.AutoSize = true;
                lblName.Location = new Point(140, 20);
                PreventTextSelection(lblName);
                card.Controls.Add(lblName);

                // السعر
                var lblPrice = new Label();
                var price = tool["price"]?.ToString() ?? "0";
                var priceText = price == "0" ? "مجاني" : $"{price} جنيه";
                lblPrice.Text = $"السعر: {priceText}";
                lblPrice.Font = new Font("Segoe UI", 12, FontStyle.Regular);
                lblPrice.ForeColor = Color.Orange;
                lblPrice.Location = new Point(140, lblName.Bottom + 8);
                lblPrice.AutoSize = true;
                PreventTextSelection(lblPrice);
                card.Controls.Add(lblPrice);

                // مدة الاستخدام
                var lblDuration = new Label();
                lblDuration.Text = $"مدة الاستخدام: {tool["duration_hours"]?.ToString() ?? "-"} ساعة";
                lblDuration.Font = new Font("Segoe UI", 12, FontStyle.Regular);
                lblDuration.ForeColor = Color.White;
                lblDuration.Location = new Point(140, lblPrice.Bottom + 8);
                lblDuration.AutoSize = true;
                PreventTextSelection(lblDuration);
                card.Controls.Add(lblDuration);

                // زر الشراء
                var btnBuy = new Guna2Button();
                btnBuy.Text = "شراء";
                btnBuy.Font = new Font("Segoe UI", 12, FontStyle.Bold);
                btnBuy.Size = new Size(90, 36);
                btnBuy.FillColor = Color.Orange;
                btnBuy.ForeColor = Color.White;
                btnBuy.BorderRadius = 14;
                btnBuy.Location = new Point(card.Width - btnBuy.Width - 20, card.Height - btnBuy.Height - 20);
                btnBuy.Tag = tool;
                btnBuy.Click += async (s, e) =>
                {
                    var selectedTool = (JObject)btnBuy.Tag;
                    string toolName = selectedTool["name"]?.ToString() ?? "";
                    string toolPriceStr = selectedTool["price"]?.ToString() ?? "0";
                    decimal toolPrice = 0;
                    decimal.TryParse(toolPriceStr, out toolPrice);
                    
                    // تم تعطيل فحص الأمان المتقدم لتجنب مشاكل Windows Defender

                    // جلب رصيد المستخدم عبر API
                    decimal userBalance = 0;
                    using (var apiClient = new HttpClient())
                    {
                        var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                        apiClient.BaseAddress = new Uri(apiBaseUrl);
                        apiClient.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                        apiClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                        if (!string.IsNullOrEmpty(userToken))
                        {
                            apiClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
                        }
                        
                        // إضافة توقيع رقمي للطلب
                        var requestData = $"{userId}_{DateTime.UtcNow:yyyyMMddHH}";
                        var signature = SecurityConfig.CreateRequestSignature(requestData, "TOOLY-GSM-SECRET-KEY-2024");
                        apiClient.DefaultRequestHeaders.Add("X-Request-Signature", signature);
                        apiClient.DefaultRequestHeaders.Add("X-Request-Timestamp", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"));
                        
                        var balanceData = new JObject { ["user_id"] = userId };
                        var balanceContent = new StringContent(balanceData.ToString(), Encoding.UTF8, "application/json");
                        var balanceResponse = await apiClient.PostAsync("/api/wallet/balance", balanceContent);
                        
                        if (balanceResponse.IsSuccessStatusCode)
                        {
                            var balanceJson = await balanceResponse.Content.ReadAsStringAsync();
                            var balanceObj = JObject.Parse(balanceJson);
                            if (balanceObj["success"]?.ToString().ToLower() == "true")
                            {
                                decimal.TryParse(balanceObj["balance"]?.ToString() ?? "0", out userBalance);
                            }
                        }
                    }
                    
                    // فحص الرصيد
                    if (userBalance < toolPrice)
                    {
                        var result = MessageBox.Show($"رصيدك الحالي: {userBalance} جنيه\nسعر الأداة: {toolPrice} جنيه\n\nرصيدك لا يكفي لشراء هذه الأداة.\nهل تريد شراء رصيد؟", 
                            "الرصيد غير كاف", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
                        if (result == DialogResult.Yes)
                        {
                            System.Diagnostics.Process.Start("https://api.whatsapp.com/send?phone=201098049153&text=%D8%B4%D8%B1%D8%A7%D9%81%D8%B5%D9%8A%D9%83%D9%84%D9%8A%D9%83");
                        }
                        return;
                    }
                    
                    // تأكيد الشراء
                    var msg = $"هل تريد شراء أداة {toolName}؟\nالسعر: {toolPrice} جنيه\nرصيدك الحالي: {userBalance} جنيه\nالرصيد المتبقي: {userBalance - toolPrice} جنيه";
                    var confirm = MessageBox.Show(msg, "تأكيد شراء الأداة", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                    if (confirm == DialogResult.Yes)
                    {
                        // تم تعطيل فحص الأمان المتقدم لتجنب مشاكل Windows Defender

                        // إرسال طلب شراء الأداة عبر API
                        using (var purchaseClient = new HttpClient())
                        {
                            var apiBaseUrl = SecurityConfig.GetApiBaseUrl();
                            purchaseClient.BaseAddress = new Uri(apiBaseUrl);
                            purchaseClient.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                            purchaseClient.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                            if (!string.IsNullOrEmpty(userToken))
                            {
                                purchaseClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {userToken}");
                            }
                            
                            // إضافة توقيع رقمي للطلب
                            var purchaseRequestData = $"{userId}_{toolName}_{toolPrice}_{DateTime.UtcNow:yyyyMMddHH}";
                            var purchaseSignature = SecurityConfig.CreateRequestSignature(purchaseRequestData, "TOOLY-GSM-SECRET-KEY-2024");
                            purchaseClient.DefaultRequestHeaders.Add("X-Request-Signature", purchaseSignature);
                            purchaseClient.DefaultRequestHeaders.Add("X-Request-Timestamp", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"));
                            
                            var purchaseData = new JObject
                            {
                                ["user_id"] = userId,
                                ["user_name"] = fullName,
                                ["tool_name"] = toolName,
                                ["tool_price"] = toolPrice,
                                ["purchase_type"] = "credit"
                            };
                            var purchaseContent = new StringContent(purchaseData.ToString(), Encoding.UTF8, "application/json");
                            var purchaseResponse = await purchaseClient.PostAsync("/api/tool-requests/create", purchaseContent);
                            
                            if (purchaseResponse.IsSuccessStatusCode)
                            {
                                var purchaseJson = await purchaseResponse.Content.ReadAsStringAsync();
                                var purchaseObj = JObject.Parse(purchaseJson);
                                if (purchaseObj["success"]?.ToString().ToLower() == "true")
                                {
                                    MessageBox.Show("تم شراء الأداة بنجاح!", "نجاح", MessageBoxButtons.OK, MessageBoxIcon.Information);
                                    // إعادة تحميل البيانات
                                    _ = LoadUserDataAsync();
                                }
                                else
                                {
                                    MessageBox.Show($"حدث خطأ أثناء شراء الأداة: {purchaseObj["error"]?.ToString()}", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                                }
                            }
                            else
                            {
                                MessageBox.Show("حدث خطأ أثناء الاتصال بالخادم", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            }
                        }
                    }
                };

                card.Controls.Add(btnBuy);
                freeToolsFlowPanel.Controls.Add(card);
            }
        }

        // مثال: إذا كان اسم الزر btnShowMore
        private void btnShowMore_Click(object sender, EventArgs e)
        {
            btnLog_Click(sender, e);
        }

        // دالة تسجيل الأخطاء الآمنة
        private void LogError(string methodName, Exception ex)
        {
            try
            {
                // تسجيل الخطأ في ملف log آمن
                var logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {methodName}: {ex.GetType().Name} - {ex.Message}";
                
                // في الإنتاج، يجب إرسال الـ logs إلى خدمة logging آمنة
                // هنا نكتفي بطباعتها في Debug
                System.Diagnostics.Debug.WriteLine(logMessage);
                
                // يمكن إضافة تسجيل في ملف log
                // File.AppendAllText("error.log", logMessage + Environment.NewLine);
            }
            catch
            {
                // في حالة فشل تسجيل الخطأ، لا نفعل شيئاً
            }
        }

        // دالة منع النسخ العام من التطبيق
        private void Form1_KeyDown(object sender, KeyEventArgs e)
        {
            // منع Ctrl+C, Ctrl+A, Ctrl+V, Ctrl+X
            if (e.Control && (e.KeyCode == Keys.C || e.KeyCode == Keys.A || e.KeyCode == Keys.V || e.KeyCode == Keys.X))
            {
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
            
            // منع F12 (Developer Tools)
            if (e.KeyCode == Keys.F12)
            {
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
            
            // منع Ctrl+Shift+I (Developer Tools)
            if (e.Control && e.Shift && e.KeyCode == Keys.I)
            {
                e.Handled = true;
                e.SuppressKeyPress = true;
            }
        }

        // دالة منع النسخ والتحديد للنصوص الحساسة
        private void PreventTextSelection(Control control)
        {
            // منع التركيز على العنصر
            control.TabStop = false;
            
            // منع أحداث الماوس
            control.MouseDown += (s, e) => { };
            control.MouseUp += (s, e) => { };
            control.MouseMove += (s, e) => { };
            
            // منع أحداث لوحة المفاتيح
            control.KeyDown += (s, e) => { e.Handled = true; };
            control.KeyPress += (s, e) => { e.Handled = true; };
            control.KeyUp += (s, e) => { e.Handled = true; };
            
            // منع تحديد النص
            if (control is Label label)
            {
                label.UseMnemonic = false;
            }
            
            // منع السياق (كليك يمين)
            control.ContextMenuStrip = new ContextMenuStrip();
        }

        // تنظيف البيانات الحساسة عند إغلاق البرنامج
        protected override void OnFormClosed(FormClosedEventArgs e)
        {
            // تنظيف التوكن من الذاكرة
            SecurityConfig.ClearSensitiveString(ref userToken);
            SecurityConfig.ClearSensitiveString(ref userId);
            SecurityConfig.ClearSensitiveString(ref email);
            SecurityConfig.ClearSensitiveString(ref fullName);
            
            base.OnFormClosed(e);
        }
    }
}


