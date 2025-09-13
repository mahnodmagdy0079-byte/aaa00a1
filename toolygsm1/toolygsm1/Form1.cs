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
using System.Drawing;

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
        private FlowLayoutPanel requestsFlowPanel;
        private int requestsPage = 0;
        private const int requestsPageSize = 4;
        private Guna2Button btnNextRequests;
        private FlowLayoutPanel freeToolsFlowPanel;

        public Form1(string userId, string fullName, string email)
        {
            InitializeComponent();
            this.userId = userId;
            this.fullName = fullName;
            this.email = email;
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

            // إضافة panel لعرض الطلبات
            requestsFlowPanel = new FlowLayoutPanel();
            requestsFlowPanel.Dock = DockStyle.None;
            requestsFlowPanel.AutoScroll = false;
            requestsFlowPanel.Size = new Size(900, 350);
            requestsFlowPanel.Location = new Point(sidebarPanel.Width + 20, 50);
            requestsFlowPanel.FlowDirection = FlowDirection.TopDown;
            requestsFlowPanel.WrapContents = false;
            this.Controls.Add(requestsFlowPanel);
            requestsFlowPanel.Visible = false;
            // زر التالي
            btnNextRequests = new Guna2Button();
            btnNextRequests.Text = "عرض المزيد";
            btnNextRequests.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            btnNextRequests.Size = new Size(120, 40);
            btnNextRequests.Location = new Point(requestsFlowPanel.Right - btnNextRequests.Width - 10, requestsFlowPanel.Top + requestsFlowPanel.Height - btnNextRequests.Height - 20);
            btnNextRequests.Visible = false;
            btnNextRequests.FillColor = Color.Orange;
            btnNextRequests.ForeColor = Color.White;
            btnNextRequests.BorderRadius = 18;
            btnNextRequests.Click += BtnNextRequests_Click;
            this.Controls.Add(btnNextRequests);

            // إضافة panel لعرض الأدوات المجانية
            freeToolsFlowPanel = new FlowLayoutPanel();
            freeToolsFlowPanel.Dock = DockStyle.None;
            freeToolsFlowPanel.AutoScroll = true;
            freeToolsFlowPanel.Size = new Size(900, this.ClientSize.Height - 100); // اجعل الطول ديناميكي
            freeToolsFlowPanel.Location = new Point(sidebarPanel.Width + 20, 50);
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
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(SupabaseConfig.BaseUrl);
                client.DefaultRequestHeaders.Add("apikey", SupabaseConfig.ApiKey);
                client.DefaultRequestHeaders.Add("Authorization", SupabaseConfig.ApiKey);
                try
                {
                    // إزالة العرض القديم للقيم
                    if (lblPackage != null) lblPackage.Visible = false;
                    if (lblBalance != null) lblBalance.Visible = false;
                    if (lblEndDate != null) lblEndDate.Visible = false;
                    // جلب الرصيد من user_wallets
                    var response = await client.GetAsync($"/rest/v1/{TableNames.UserWallets}?select=balance&user_id=eq.{userId}");
                    var walletsJson = await response.Content.ReadAsStringAsync();
                    // تم حذف MessageBox الخاص بالرصيد
                    JArray wallets = null;
                    try { wallets = JArray.Parse(walletsJson); } catch { wallets = new JArray(); }
                    var balance = wallets.Count > 0 ? wallets[0]["balance"]?.ToString() : "0";
                    lblBalance.Text = $"Balance: {balance}";
                    // جلب أحدث طلب شراء من purchase_requests
                    response = await client.GetAsync($"/rest/v1/{TableNames.PurchaseRequests}?select=package_name,user_id&user_id=eq.{userId}&order=created_at.desc&limit=1");
                    var purchasesJson = await response.Content.ReadAsStringAsync();
                    // تم حذف MessageBox الخاص بطلبات الشراء
                    JArray purchases = null;
                    try { purchases = JArray.Parse(purchasesJson); } catch { purchases = new JArray(); }
                    string purchasePackage = purchases.Count > 0 ? purchases[0]["package_name"]?.ToString() : "-";
                    lblPackage.Text = $"Package: {purchasePackage}";
                    // البحث عن الباقة من جدول licenses فقط باسم المستخدم
                    string userName = fullName;
                    if (email.Contains("@"))
                        userName = email.Split('@')[0];
                    JArray licenses = null;
                    string licensesJson = "";
                    response = await client.GetAsync($"/rest/v1/{TableNames.Licenses}?select=package_name,end_date,user_id,user_email,user_name&user_name=eq.{userName}");
                    licensesJson = await response.Content.ReadAsStringAsync();
                    // تم حذف MessageBox الخاص بالباقات
                    licenses = null;
                    try { licenses = JArray.Parse(licensesJson); } catch { licenses = new JArray(); }
                    string package = "-";
                    string endDate = "-";
                    foreach (var lic in licenses)
                    {
                        var endDateStr = lic["end_date"]?.ToString();
                        if (DateTime.TryParse(endDateStr, out DateTime endDateDt) && endDateDt > DateTime.Now)
                        {
                            package = lic["package_name"]?.ToString() ?? "-";
                            endDate = lic["end_date"]?.ToString() ?? "-";
                            break;
                        }
                    }
                    lblPackage.Text = $"Package: {package}";
                    lblEndDate.Text = $"End Date: {endDate}";
                    var daysLeft = "-";
                    if (DateTime.TryParse(endDate, out DateTime endDateDt2))
                    {
                        daysLeft = ((int)Math.Ceiling((endDateDt2 - DateTime.Now).TotalDays)).ToString();
                    }
                    // فقط عدد الأيام المتبقة
                    lblEndDate.Text = daysLeft != "-" ? $"Days left: {daysLeft}" : "Days left: -";

                    // تحديث القيم في البانلز الجديدة
                    lblCardPackageValue.Text = package;
                    lblCardBalanceValue.Text = balance;
                    lblCardEndDateValue.Text = daysLeft;

                    // جلب آخر طلبين للمستخدم
                    var recentResponse = await client.GetAsync($"/rest/v1/{TableNames.ToolRequests}?select=tool_name,price,status_ar,created_at&user_name=eq.{userName}&order=created_at.desc&limit=2");
                    var recentJson = await recentResponse.Content.ReadAsStringAsync();
                    JArray recentRequests = null;
                    try { recentRequests = JArray.Parse(recentJson); } catch { recentRequests = new JArray(); }
                    var activities = new List<(string toolName, string price, string status, string details, string icon)>();
                    foreach (var req in recentRequests)
                    {
                        string toolName = req["tool_name"]?.ToString() ?? "-";
                        string price = req["price"]?.ToString() ?? "-";
                        string status = req["status_ar"]?.ToString() ?? "-";
                        string details = $"تاريخ: {req["created_at"]?.ToString()?.Split('T')[0] ?? "-"}";
                        string icon = status == "جاري" ? "🟠" : (status == "منتهي" || status == "تم") ? "🟢" : "🔴";
                        activities.Add((toolName, price, status, details, icon));
                    }
                    UpdateRecentActivityUI(activities);
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"حدث خطأ أثناء جلب البيانات: {ex.Message}", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void btnToolsWithCredit_Click(object sender, EventArgs e)
        {

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
            this.Controls.Add(lblEndDate);
            lblEndDate.BringToFront();
        }

        private void btnHome_Click(object sender, EventArgs e)
        {
            ShowHomeSection(true);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false; // إخفاء الأدوات المجانية عند العودة للرئيسية
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
            MessageBox.Show("Profile clicked!", "Profile", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        private void UserMenu_Settings_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Settings clicked!", "Settings", MessageBoxButtons.OK, MessageBoxIcon.Information);
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
            MessageBox.Show("سجل الطلبات سيتم عرضه هنا.", "السجل", MessageBoxButtons.OK, MessageBoxIcon.Information);
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
            ShowHomeSection(false);
            requestsPage = 0;
            requestsFlowPanel.Visible = true;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false; // إخفاء الأدوات عند عرض السجل
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
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(SupabaseConfig.BaseUrl);
                client.DefaultRequestHeaders.Add("apikey", SupabaseConfig.ApiKey);
                client.DefaultRequestHeaders.Add("Authorization", SupabaseConfig.ApiKey);
                try
                {
                    string userName = fullName;
                    if (email.Contains("@"))
                        userName = email.Split('@')[0];
                    int offset = requestsPage * requestsPageSize;
                    var response = await client.GetAsync($"/rest/v1/{TableNames.ToolRequests}?select=user_name,tool_name,created_at,status_ar,price&user_name=eq.{userName}&order=created_at.desc&limit={requestsPageSize}&offset={offset}");
                    var json = await response.Content.ReadAsStringAsync();
                    JArray requests = null;
                    try { requests = JArray.Parse(json); } catch { requests = new JArray(); }
                    requestsFlowPanel.Controls.Clear();
                    requestsFlowPanel.Visible = true;
                    btnNextRequests.Visible = requests.Count == requestsPageSize;
                    if (btnNextRequests.Visible && requestsFlowPanel.Controls.Count > 0)
                    {
                        var lastCard = requestsFlowPanel.Controls[requestsFlowPanel.Controls.Count - 1];
                        // اجعل الزر تحت الكارت الأخير بفارق 1.5 سم تقريباً (حوالي 56 بكسل)
                        int y = lastCard.Bottom + 56;
                        // لا تجعله ينزل أكثر من الحافة السفلية للـ requestsFlowPanel
                        y = Math.Min(y, requestsFlowPanel.Bottom - btnNextRequests.Height - 10);
                        btnNextRequests.Location = new Point(requestsFlowPanel.Right - btnNextRequests.Width - 10, y);
                        btnNextRequests.BringToFront();
                    }
                    if (requests.Count == 0 && requestsPage == 0)
                    {
                        var lbl = new Label();
                        lbl.Text = "لا يوجد طلبات أدوات لهذا المستخدم.";
                        lbl.Font = new Font("Segoe UI", 12, FontStyle.Bold);
                        lbl.ForeColor = Color.Orange;
                        lbl.AutoSize = true;
                        requestsFlowPanel.Controls.Add(lbl);
                        btnNextRequests.Visible = false;
                        return;
                    }
                    foreach (var req in requests)
                    {
                        var card = new Guna2ShadowPanel();
                        card.Size = new Size(requestsFlowPanel.Width - 30, 100);
                        card.Margin = new Padding(10);
                        card.Radius = 12;
                        card.ShadowColor = Color.Black;
                        card.ShadowStyle = Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
                        card.FillColor = Color.FromArgb(20, 20, 20); // اللون الموحد للكارت

                        // مؤشر الحالة على اليمين
                        var progress = new Guna2CircleProgressBar();
                        progress.Size = new Size(60, 60);
                        progress.Location = new Point(card.Width - progress.Width - 20, 20);
                        progress.Minimum = 0;
                        progress.Maximum = 100;
                        progress.Value = 0;
                        progress.FillColor = Color.FromArgb(200, 213, 218, 223);
                        progress.Font = new Font("Segoe UI", 10, FontStyle.Bold);
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
                        lblTool.Font = new Font("Segoe UI", 12, FontStyle.Bold);
                        lblTool.ForeColor = Color.White;
                        lblTool.Location = new Point(20, 15);
                        lblTool.AutoSize = true;

                        // السعر تحت اسم الأداة
                        var lblPrice = new Label();
                        lblPrice.Text = $"السعر: {req["price"]?.ToString() ?? "-"}";
                        lblPrice.Font = new Font("Segoe UI", 11, FontStyle.Regular);
                        lblPrice.ForeColor = Color.Orange;
                        lblPrice.Location = new Point(20, lblTool.Bottom + 2);
                        lblPrice.AutoSize = true;

                        // تاريخ الطلب تحت السعر
                        var lblDate = new Label();
                        lblDate.Text = $"تاريخ الطلب: {req["created_at"]?.ToString() ?? "-"}";
                        lblDate.Font = new Font("Segoe UI", 10, FontStyle.Regular);
                        lblDate.ForeColor = Color.White;
                        lblDate.Location = new Point(20, lblPrice.Bottom + 2);
                        lblDate.AutoSize = true;

                        card.Controls.Add(lblTool);
                        card.Controls.Add(lblPrice);
                        card.Controls.Add(lblDate);
                        card.Controls.Add(progress);
                        requestsFlowPanel.Controls.Add(card);
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"حدث خطأ أثناء جلب سجل الطلبات: {ex.Message}", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void guna2RadialGauge1_ValueChanged(object sender, EventArgs e)
        {

        }

        private async Task LoadFreeToolsAsync()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(SupabaseConfig.BaseUrl);
                client.DefaultRequestHeaders.Add("apikey", SupabaseConfig.ApiKey);
                client.DefaultRequestHeaders.Add("Authorization", SupabaseConfig.ApiKey);
                try
                {
                    var response = await client.GetAsync($"/rest/v1/{TableNames.Tools}?select=id,name,price,duration_hours,image_url");
                    var json = await response.Content.ReadAsStringAsync();
                    JArray tools = null;
                    try { tools = JArray.Parse(json); } catch { tools = new JArray(); }
                    freeToolsFlowPanel.Controls.Clear();
                    // إعادة تفعيل التمرير الافتراضي للـ FlowLayoutPanel
                    freeToolsFlowPanel.AutoScroll = true;
                    if (tools.Count == 0)
                    {
                        var lbl = new Label();
                        lbl.Text = "لا يوجد أدوات متاحة حالياً.";
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
                        card.FillColor = Color.FromArgb(20, 20, 20); // اللون الموحد للكارت

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
                        lblName.Text = tool["name"]?.ToString() ?? "-";
                        lblName.Font = new Font("Segoe UI", 13, FontStyle.Bold);
                        lblName.ForeColor = Color.White;
                        lblName.BackColor = Color.Transparent;
                        lblName.AutoSize = true;
                        lblName.Location = new Point(140, 20);
                        card.Controls.Add(lblName);

                        // السعر
                        var lblPrice = new Label();
                        lblPrice.Text = $"السعر: {tool["price"]?.ToString() ?? "-"}";
                        lblPrice.Font = new Font("Segoe UI", 12, FontStyle.Regular);
                        lblPrice.ForeColor = Color.Orange;
                        lblPrice.Location = new Point(140, lblName.Bottom + 8);
                        lblPrice.AutoSize = true;
                        card.Controls.Add(lblPrice);

                        // مدة الاستخدام
                        var lblDuration = new Label();
                        lblDuration.Text = $"مدة الاستخدام: {tool["duration_hours"]?.ToString() ?? "-"} ساعة";
                        lblDuration.Font = new Font("Segoe UI", 12, FontStyle.Regular);
                        lblDuration.ForeColor = Color.White;
                        lblDuration.Location = new Point(140, lblPrice.Bottom + 8);
                        lblDuration.AutoSize = true;
                        card.Controls.Add(lblDuration);

                        // زر شراء
                        var btnBuy = new Guna2Button();
                        btnBuy.Text = "شراء";
                        btnBuy.Font = new Font("Segoe UI", 12, FontStyle.Bold);
                        btnBuy.Size = new Size(90, 36);
                        btnBuy.FillColor = Color.Orange;
                        btnBuy.ForeColor = Color.White;
                        btnBuy.BorderRadius = 14;
                        btnBuy.Location = new Point(card.Width - btnBuy.Width - 20, card.Height - btnBuy.Height - 20);
                        string toolName = tool["name"]?.ToString() ?? "";
                        string toolPriceStr = tool["price"]?.ToString() ?? "-";
                        string toolDuration = tool["duration_hours"]?.ToString() ?? "-";
                        decimal toolPrice = 0;
                        decimal.TryParse(toolPriceStr, out toolPrice);
                        if (toolName.Replace(" ", "").Equals("UNLOCKTOOL", StringComparison.OrdinalIgnoreCase))
                        {
                            btnBuy.Click += async (s, e) =>
                            {
                                // جلب رصيد المستخدم
                                decimal userBalance = 0;
                                using (var client2 = new HttpClient())
                                {
                                    client2.BaseAddress = new Uri(SupabaseConfig.BaseUrl);
                                    client2.DefaultRequestHeaders.Add("apikey", SupabaseConfig.ApiKey);
                                    client2.DefaultRequestHeaders.Add("Authorization", SupabaseConfig.ApiKey);
                                    var response2 = await client2.GetAsync($"/rest/v1/{TableNames.UserWallets}?select=balance&user_id=eq.{userId}");
                                    var walletsJson = await response2.Content.ReadAsStringAsync();
                                    JArray wallets = null;
                                    try { wallets = JArray.Parse(walletsJson); } catch { wallets = new JArray(); }
                                    if (wallets.Count > 0)
                                        decimal.TryParse(wallets[0]["balance"]?.ToString() ?? "0", out userBalance);
                                }
                                if (userBalance < toolPrice)
                                {
                                    var result = MessageBox.Show("رصيدك لا يكفي لشراء هذه الأدة.\nهل تريد شراء رصيد؟", "الرصيد غير كاف", MessageBoxButtons.YesNo, MessageBoxIcon.Warning);
                                    if (result == DialogResult.Yes)
                                    {
                                        System.Diagnostics.Process.Start("https://api.whatsapp.com/send?phone=201098049153&text=%D8%B4%D8%B1%D8%A7%D9%81%D8%B5%D9%8A%D9%83%D9%84%D9%8A%D9%83");
                                    }
                                    return;
                                }
                                var msg = $"هل أنت متأكد من شراء الأداة؟\nالسعر: {toolPrice}\nالمدة: {toolDuration} ساعة";
                                var confirm = MessageBox.Show(msg, "تأكيد شراء الأداة", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                                if (confirm == DialogResult.Yes)
                                {
                                    toolygsm1.Automation.UnlockToolAutomation.StartUnlockToolAutomation();
                                }
                            };
                        }
                        card.Controls.Add(btnBuy);

                        freeToolsFlowPanel.Controls.Add(card);
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"حدث خطأ أثناء جلب الأدوات: {ex.Message}", "خطأ", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void btnToolsFree_Click(object sender, EventArgs e)
        {
            ShowHomeSection(false);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
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
                new { Name = "Website", Resource = Properties.Resources.website, Url = "https://toolygsm.com" },
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
            if (currentSectionButton != null)
                currentSectionButton.ForeColor = Color.White;
            currentSectionButton = btnSupport;
            HighlightSection(currentSectionButton);
            ShowHomeSection(false);
            requestsFlowPanel.Visible = false;
            btnNextRequests.Visible = false;
            freeToolsFlowPanel.Visible = false;
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
            if (show)
            {
                // اجعل الشريط ملاصق لليمين بجانب freeToolsFlowPanel
                freeToolsFlowPanel.Location = new Point(sidebarPanel.Width + 20, 50);
            }
        }

        // مثال: إذا كان اسم الزر btnShowMore
        private void btnShowMore_Click(object sender, EventArgs e)
        {
            btnLog_Click(sender, e);
        }
    }
}
