using Guna.UI2.WinForms;

namespace toolygsm1
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.sidebarPanel = new Guna.UI2.WinForms.Guna2Panel();
            this.btnSupport = new Guna.UI2.WinForms.Guna2Button();
            this.guna2Separator1 = new Guna.UI2.WinForms.Guna2Separator();
            this.pictureBoxLogo = new Guna.UI2.WinForms.Guna2PictureBox();
            this.btnHome = new Guna.UI2.WinForms.Guna2Button();
            this.btnToolsFree = new Guna.UI2.WinForms.Guna2Button();
            this.btnToolsWithCredit = new Guna.UI2.WinForms.Guna2Button();
            this.separatorHomeToWithCredit = new Guna.UI2.WinForms.Guna2Separator();
            this.separatorWithCreditToFree = new Guna.UI2.WinForms.Guna2Separator();
            this.btnLog = new Guna.UI2.WinForms.Guna2Button();
            this.userNameLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            this.infoCardPackage = new Guna.UI2.WinForms.Guna2ShadowPanel();
            this.lblCardPackageValue = new Guna.UI2.WinForms.Guna2HtmlLabel();
            this.packagePic = new Guna.UI2.WinForms.Guna2PictureBox();
            this.infoCardBalance = new Guna.UI2.WinForms.Guna2ShadowPanel();
            this.lblCardBalanceTitle = new Guna.UI2.WinForms.Guna2HtmlLabel();
            this.lblCardBalanceValue = new Guna.UI2.WinForms.Guna2HtmlLabel();
            this.infoCardEndDate = new Guna.UI2.WinForms.Guna2ShadowPanel();
            this.lblCardEndDateTitle = new Guna.UI2.WinForms.Guna2HtmlLabel();
            this.lblCardEndDateValue = new Guna.UI2.WinForms.Guna2HtmlLabel();
            this.userMenu = new Guna.UI2.WinForms.Guna2ContextMenuStrip();
            this.btnRequestsLog = new Guna.UI2.WinForms.Guna2Button();
            this.recentActivityCard1 = new Guna.UI2.WinForms.Guna2ShadowPanel();
            this.lblToolName1 = new System.Windows.Forms.Label();
            this.lblPrice1 = new System.Windows.Forms.Label();
            this.lblDetails1 = new System.Windows.Forms.Label();
            this.recentActivityCard2 = new Guna.UI2.WinForms.Guna2ShadowPanel();
            this.lblToolName2 = new System.Windows.Forms.Label();
            this.lblPrice2 = new System.Windows.Forms.Label();
            this.lblDetails2 = new System.Windows.Forms.Label();
            this.lblRecentActivity = new System.Windows.Forms.Label();
            this.picRecentActivity = new System.Windows.Forms.PictureBox();
            this.userMenuArrow = new Guna.UI2.WinForms.Guna2PictureBox();
            this.userPic = new Guna.UI2.WinForms.Guna2PictureBox();
            this.customTitleBar = new System.Windows.Forms.Panel();
            this.lblTitleBar = new System.Windows.Forms.Label();
            this.btnClose = new System.Windows.Forms.Button();
            this.btnMinimize = new System.Windows.Forms.Button();
            this.supportPanel = new System.Windows.Forms.Panel();
            this.guna2Button1 = new Guna.UI2.WinForms.Guna2Button();
            this.btnShowMore = new Guna.UI2.WinForms.Guna2Button();
            this.sidebarPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxLogo)).BeginInit();
            this.infoCardPackage.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.packagePic)).BeginInit();
            this.infoCardBalance.SuspendLayout();
            this.infoCardEndDate.SuspendLayout();
            this.recentActivityCard1.SuspendLayout();
            this.recentActivityCard2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picRecentActivity)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.userMenuArrow)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.userPic)).BeginInit();
            this.customTitleBar.SuspendLayout();
            this.supportPanel.SuspendLayout();
            this.SuspendLayout();
            // 
            // sidebarPanel
            // 
            this.sidebarPanel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(8)))), ((int)(((byte)(8)))), ((int)(((byte)(8)))));
            this.sidebarPanel.Controls.Add(this.btnSupport);
            this.sidebarPanel.Controls.Add(this.guna2Separator1);
            this.sidebarPanel.Controls.Add(this.pictureBoxLogo);
            this.sidebarPanel.Controls.Add(this.btnHome);
            this.sidebarPanel.Controls.Add(this.btnToolsFree);
            this.sidebarPanel.Controls.Add(this.btnToolsWithCredit);
            this.sidebarPanel.Controls.Add(this.separatorHomeToWithCredit);
            this.sidebarPanel.Controls.Add(this.separatorWithCreditToFree);
            this.sidebarPanel.Controls.Add(this.btnLog);
            this.sidebarPanel.Dock = System.Windows.Forms.DockStyle.Left;
            this.sidebarPanel.Location = new System.Drawing.Point(0, 0);
            this.sidebarPanel.Name = "sidebarPanel";
            this.sidebarPanel.Size = new System.Drawing.Size(180, 697);
            this.sidebarPanel.TabIndex = 0;
            this.sidebarPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.sidebarPanel_Paint);
            // 
            // btnSupport
            // 
            this.btnSupport.AutoRoundedCorners = true;
            this.btnSupport.BorderRadius = 19;
            this.btnSupport.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnSupport.FillColor = System.Drawing.Color.Transparent;
            this.btnSupport.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.btnSupport.ForeColor = System.Drawing.Color.White;
            this.btnSupport.Image = global::toolygsm1.Properties.Resources.support;
            this.btnSupport.ImageAlign = System.Windows.Forms.HorizontalAlignment.Left;
            this.btnSupport.ImageSize = new System.Drawing.Size(28, 28);
            this.btnSupport.Location = new System.Drawing.Point(12, 630);
            this.btnSupport.Name = "btnSupport";
            this.btnSupport.Size = new System.Drawing.Size(141, 40);
            this.btnSupport.TabIndex = 10;
            this.btnSupport.Text = "تواصل معنا";
            this.btnSupport.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // guna2Separator1
            // 
            this.guna2Separator1.BackColor = System.Drawing.Color.Transparent;
            this.guna2Separator1.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(23)))), ((int)(((byte)(23)))), ((int)(((byte)(23)))));
            this.guna2Separator1.FillThickness = 3;
            this.guna2Separator1.Location = new System.Drawing.Point(27, 344);
            this.guna2Separator1.Name = "guna2Separator1";
            this.guna2Separator1.Size = new System.Drawing.Size(113, 15);
            this.guna2Separator1.TabIndex = 7;
            this.guna2Separator1.UseTransparentBackground = true;
            // 
            // pictureBoxLogo
            // 
            this.pictureBoxLogo.Image = ((System.Drawing.Image)(resources.GetObject("pictureBoxLogo.Image")));
            this.pictureBoxLogo.ImageLocation = "https://i.ibb.co/RGh04RYS/Tooly-GSM-Logo-PNG.png";
            this.pictureBoxLogo.ImageRotate = 0F;
            this.pictureBoxLogo.Location = new System.Drawing.Point(27, 39);
            this.pictureBoxLogo.Name = "pictureBoxLogo";
            this.pictureBoxLogo.Size = new System.Drawing.Size(113, 97);
            this.pictureBoxLogo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBoxLogo.TabIndex = 4;
            this.pictureBoxLogo.TabStop = false;
            // 
            // btnHome
            // 
            this.btnHome.AccessibleName = "";
            this.btnHome.AutoRoundedCorners = true;
            this.btnHome.BorderRadius = 19;
            this.btnHome.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnHome.FillColor = System.Drawing.Color.Transparent;
            this.btnHome.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.btnHome.ForeColor = System.Drawing.Color.White;
            this.btnHome.Image = global::toolygsm1.Properties.Resources.home1;
            this.btnHome.Location = new System.Drawing.Point(12, 169);
            this.btnHome.Name = "btnHome";
            this.btnHome.Size = new System.Drawing.Size(120, 40);
            this.btnHome.TabIndex = 0;
            this.btnHome.Text = "الرئيسية";
            this.btnHome.Click += new System.EventHandler(this.btnHome_Click_1);
            // 
            // btnToolsFree
            // 
            this.btnToolsFree.AutoRoundedCorners = true;
            this.btnToolsFree.BorderRadius = 19;
            this.btnToolsFree.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnToolsFree.FillColor = System.Drawing.Color.Transparent;
            this.btnToolsFree.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.btnToolsFree.ForeColor = System.Drawing.Color.White;
            this.btnToolsFree.Image = global::toolygsm1.Properties.Resources.tool;
            this.btnToolsFree.Location = new System.Drawing.Point(27, 236);
            this.btnToolsFree.Name = "btnToolsFree";
            this.btnToolsFree.Size = new System.Drawing.Size(130, 40);
            this.btnToolsFree.TabIndex = 1;
            this.btnToolsFree.Text = "لغير المشتركين";
            this.btnToolsFree.Click += new System.EventHandler(this.btnToolsFree_Click);
            // 
            // btnToolsWithCredit
            // 
            this.btnToolsWithCredit.AutoRoundedCorners = true;
            this.btnToolsWithCredit.BorderRadius = 19;
            this.btnToolsWithCredit.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnToolsWithCredit.FillColor = System.Drawing.Color.Transparent;
            this.btnToolsWithCredit.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.btnToolsWithCredit.ForeColor = System.Drawing.Color.White;
            this.btnToolsWithCredit.Image = global::toolygsm1.Properties.Resources.tool;
            this.btnToolsWithCredit.Location = new System.Drawing.Point(-22, 298);
            this.btnToolsWithCredit.Name = "btnToolsWithCredit";
            this.btnToolsWithCredit.Size = new System.Drawing.Size(199, 40);
            this.btnToolsWithCredit.TabIndex = 2;
            this.btnToolsWithCredit.Text = "المشتركين";
            this.btnToolsWithCredit.Click += new System.EventHandler(this.btnToolsWithCredit_Click_1);
            // 
            // separatorHomeToWithCredit
            // 
            this.separatorHomeToWithCredit.BackColor = System.Drawing.Color.Transparent;
            this.separatorHomeToWithCredit.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(22)))), ((int)(((byte)(22)))), ((int)(((byte)(22)))));
            this.separatorHomeToWithCredit.FillThickness = 3;
            this.separatorHomeToWithCredit.Location = new System.Drawing.Point(27, 215);
            this.separatorHomeToWithCredit.Name = "separatorHomeToWithCredit";
            this.separatorHomeToWithCredit.Size = new System.Drawing.Size(113, 15);
            this.separatorHomeToWithCredit.TabIndex = 5;
            this.separatorHomeToWithCredit.UseTransparentBackground = true;
            this.separatorHomeToWithCredit.Click += new System.EventHandler(this.separatorHomeToWithCredit_Click);
            // 
            // separatorWithCreditToFree
            // 
            this.separatorWithCreditToFree.BackColor = System.Drawing.Color.Transparent;
            this.separatorWithCreditToFree.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(23)))), ((int)(((byte)(23)))), ((int)(((byte)(23)))));
            this.separatorWithCreditToFree.FillThickness = 3;
            this.separatorWithCreditToFree.Location = new System.Drawing.Point(27, 282);
            this.separatorWithCreditToFree.Name = "separatorWithCreditToFree";
            this.separatorWithCreditToFree.Size = new System.Drawing.Size(113, 10);
            this.separatorWithCreditToFree.TabIndex = 6;
            this.separatorWithCreditToFree.UseTransparentBackground = true;
            // 
            // btnLog
            // 
            this.btnLog.AutoRoundedCorners = true;
            this.btnLog.BorderRadius = 16;
            this.btnLog.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnLog.FillColor = System.Drawing.Color.Transparent;
            this.btnLog.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.btnLog.ForeColor = System.Drawing.Color.White;
            this.btnLog.Image = ((System.Drawing.Image)(resources.GetObject("btnLog.Image")));
            this.btnLog.ImageSize = new System.Drawing.Size(23, 23);
            this.btnLog.Location = new System.Drawing.Point(-9, 365);
            this.btnLog.Name = "btnLog";
            this.btnLog.Size = new System.Drawing.Size(149, 34);
            this.btnLog.TabIndex = 8;
            this.btnLog.Text = "السجل";
            this.btnLog.Click += new System.EventHandler(this.btnLog_Click);
            // 
            // userNameLabel
            // 
            this.userNameLabel.BackColor = System.Drawing.Color.Transparent;
            this.userNameLabel.Font = new System.Drawing.Font("Segoe UI", 8F, System.Drawing.FontStyle.Bold);
            this.userNameLabel.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.userNameLabel.Location = new System.Drawing.Point(920, 35);
            this.userNameLabel.Name = "userNameLabel";
            this.userNameLabel.Size = new System.Drawing.Size(54, 15);
            this.userNameLabel.TabIndex = 6;
            this.userNameLabel.Text = "username";
            this.userNameLabel.Click += new System.EventHandler(this.UserMenu_Show);
            // 
            // infoCardPackage
            // 
            this.infoCardPackage.BackColor = System.Drawing.Color.Transparent;
            this.infoCardPackage.Controls.Add(this.lblCardPackageValue);
            this.infoCardPackage.Controls.Add(this.packagePic);
            this.infoCardPackage.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.infoCardPackage.Location = new System.Drawing.Point(200, 50);
            this.infoCardPackage.Name = "infoCardPackage";
            this.infoCardPackage.Radius = 10;
            this.infoCardPackage.ShadowColor = System.Drawing.Color.Black;
            this.infoCardPackage.ShadowStyle = Guna.UI2.WinForms.Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
            this.infoCardPackage.Size = new System.Drawing.Size(158, 171);
            this.infoCardPackage.TabIndex = 1;
            this.infoCardPackage.Paint += new System.Windows.Forms.PaintEventHandler(this.infoCardPackage_Paint);
            // 
            // lblCardPackageValue
            // 
            this.lblCardPackageValue.BackColor = System.Drawing.Color.Transparent;
            this.lblCardPackageValue.Font = new System.Drawing.Font("Segoe UI", 18F, System.Drawing.FontStyle.Bold);
            this.lblCardPackageValue.ForeColor = System.Drawing.Color.White;
            this.lblCardPackageValue.Location = new System.Drawing.Point(17, 72);
            this.lblCardPackageValue.Name = "lblCardPackageValue";
            this.lblCardPackageValue.Size = new System.Drawing.Size(24, 34);
            this.lblCardPackageValue.TabIndex = 1;
            this.lblCardPackageValue.Text = "...";
            this.lblCardPackageValue.Click += new System.EventHandler(this.lblCardPackageValue_Click);
            // 
            // packagePic
            // 
            this.packagePic.BackColor = System.Drawing.Color.Transparent;
            this.packagePic.Image = global::toolygsm1.Properties.Resources.package;
            this.packagePic.ImageRotate = 0F;
            this.packagePic.Location = new System.Drawing.Point(47, 30);
            this.packagePic.Name = "packagePic";
            this.packagePic.Size = new System.Drawing.Size(64, 64);
            this.packagePic.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.packagePic.TabIndex = 2;
            this.packagePic.TabStop = false;
            // 
            // infoCardBalance
            // 
            this.infoCardBalance.BackColor = System.Drawing.Color.Transparent;
            this.infoCardBalance.Controls.Add(this.lblCardBalanceTitle);
            this.infoCardBalance.Controls.Add(this.lblCardBalanceValue);
            this.infoCardBalance.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.infoCardBalance.Location = new System.Drawing.Point(373, 50);
            this.infoCardBalance.Name = "infoCardBalance";
            this.infoCardBalance.Radius = 10;
            this.infoCardBalance.ShadowColor = System.Drawing.Color.Black;
            this.infoCardBalance.ShadowStyle = Guna.UI2.WinForms.Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
            this.infoCardBalance.Size = new System.Drawing.Size(148, 117);
            this.infoCardBalance.TabIndex = 2;
            // 
            // lblCardBalanceTitle
            // 
            this.lblCardBalanceTitle.BackColor = System.Drawing.Color.Transparent;
            this.lblCardBalanceTitle.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.lblCardBalanceTitle.ForeColor = System.Drawing.Color.White;
            this.lblCardBalanceTitle.Location = new System.Drawing.Point(24, 25);
            this.lblCardBalanceTitle.Name = "lblCardBalanceTitle";
            this.lblCardBalanceTitle.Size = new System.Drawing.Size(50, 19);
            this.lblCardBalanceTitle.TabIndex = 0;
            this.lblCardBalanceTitle.Text = "Balance";
            // 
            // lblCardBalanceValue
            // 
            this.lblCardBalanceValue.BackColor = System.Drawing.Color.Transparent;
            this.lblCardBalanceValue.Font = new System.Drawing.Font("Segoe UI", 18F, System.Drawing.FontStyle.Bold);
            this.lblCardBalanceValue.ForeColor = System.Drawing.Color.White;
            this.lblCardBalanceValue.Location = new System.Drawing.Point(24, 52);
            this.lblCardBalanceValue.Name = "lblCardBalanceValue";
            this.lblCardBalanceValue.Size = new System.Drawing.Size(24, 34);
            this.lblCardBalanceValue.TabIndex = 1;
            this.lblCardBalanceValue.Text = "...";
            this.lblCardBalanceValue.Click += new System.EventHandler(this.lblCardBalanceValue_Click);
            // 
            // infoCardEndDate
            // 
            this.infoCardEndDate.BackColor = System.Drawing.Color.Transparent;
            this.infoCardEndDate.Controls.Add(this.lblCardEndDateTitle);
            this.infoCardEndDate.Controls.Add(this.lblCardEndDateValue);
            this.infoCardEndDate.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.infoCardEndDate.Location = new System.Drawing.Point(536, 50);
            this.infoCardEndDate.Name = "infoCardEndDate";
            this.infoCardEndDate.Radius = 10;
            this.infoCardEndDate.ShadowColor = System.Drawing.Color.Black;
            this.infoCardEndDate.ShadowStyle = Guna.UI2.WinForms.Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
            this.infoCardEndDate.Size = new System.Drawing.Size(148, 117);
            this.infoCardEndDate.TabIndex = 3;
            this.infoCardEndDate.Paint += new System.Windows.Forms.PaintEventHandler(this.infoCardEndDate_Paint);
            // 
            // lblCardEndDateTitle
            // 
            this.lblCardEndDateTitle.BackColor = System.Drawing.Color.Transparent;
            this.lblCardEndDateTitle.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.lblCardEndDateTitle.ForeColor = System.Drawing.Color.White;
            this.lblCardEndDateTitle.Location = new System.Drawing.Point(15, 25);
            this.lblCardEndDateTitle.Name = "lblCardEndDateTitle";
            this.lblCardEndDateTitle.Size = new System.Drawing.Size(58, 19);
            this.lblCardEndDateTitle.TabIndex = 0;
            this.lblCardEndDateTitle.Text = "Days left";
            // 
            // lblCardEndDateValue
            // 
            this.lblCardEndDateValue.BackColor = System.Drawing.Color.Transparent;
            this.lblCardEndDateValue.Font = new System.Drawing.Font("Segoe UI", 18F, System.Drawing.FontStyle.Bold);
            this.lblCardEndDateValue.ForeColor = System.Drawing.Color.White;
            this.lblCardEndDateValue.Location = new System.Drawing.Point(15, 52);
            this.lblCardEndDateValue.Name = "lblCardEndDateValue";
            this.lblCardEndDateValue.Size = new System.Drawing.Size(24, 34);
            this.lblCardEndDateValue.TabIndex = 1;
            this.lblCardEndDateValue.Text = "...";
            // 
            // userMenu
            // 
            this.userMenu.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(30)))), ((int)(((byte)(30)))), ((int)(((byte)(30)))));
            this.userMenu.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold);
            this.userMenu.ForeColor = System.Drawing.Color.Orange;
            this.userMenu.Name = "userMenu";
            this.userMenu.RenderStyle.ArrowColor = System.Drawing.Color.FromArgb(((int)(((byte)(151)))), ((int)(((byte)(143)))), ((int)(((byte)(255)))));
            this.userMenu.RenderStyle.BorderColor = System.Drawing.Color.Gainsboro;
            this.userMenu.RenderStyle.ColorTable = null;
            this.userMenu.RenderStyle.RoundedEdges = true;
            this.userMenu.RenderStyle.SelectionArrowColor = System.Drawing.Color.White;
            this.userMenu.RenderStyle.SelectionBackColor = System.Drawing.Color.FromArgb(((int)(((byte)(100)))), ((int)(((byte)(88)))), ((int)(((byte)(255)))));
            this.userMenu.RenderStyle.SelectionForeColor = System.Drawing.Color.White;
            this.userMenu.RenderStyle.SeparatorColor = System.Drawing.Color.Gainsboro;
            this.userMenu.RenderStyle.TextRenderingHint = System.Drawing.Text.TextRenderingHint.SystemDefault;
            this.userMenu.Size = new System.Drawing.Size(61, 4);
            // 
            // btnRequestsLog
            // 
            this.btnRequestsLog.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.btnRequestsLog.ForeColor = System.Drawing.Color.White;
            this.btnRequestsLog.Location = new System.Drawing.Point(0, 0);
            this.btnRequestsLog.Name = "btnRequestsLog";
            this.btnRequestsLog.Size = new System.Drawing.Size(180, 45);
            this.btnRequestsLog.TabIndex = 0;
            // 
            // recentActivityCard1
            // 
            this.recentActivityCard1.BackColor = System.Drawing.Color.Transparent;
            this.recentActivityCard1.Controls.Add(this.lblToolName1);
            this.recentActivityCard1.Controls.Add(this.lblPrice1);
            this.recentActivityCard1.Controls.Add(this.lblDetails1);
            this.recentActivityCard1.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(20)))), ((int)(((byte)(20)))), ((int)(((byte)(20)))));
            this.recentActivityCard1.Location = new System.Drawing.Point(200, 298);
            this.recentActivityCard1.Margin = new System.Windows.Forms.Padding(10, 10, 3, 3);
            this.recentActivityCard1.Name = "recentActivityCard1";
            this.recentActivityCard1.Radius = 10;
            this.recentActivityCard1.ShadowColor = System.Drawing.Color.Black;
            this.recentActivityCard1.ShadowStyle = Guna.UI2.WinForms.Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
            this.recentActivityCard1.Size = new System.Drawing.Size(300, 99);
            this.recentActivityCard1.TabIndex = 0;
            // 
            // lblToolName1
            // 
            this.lblToolName1.AutoSize = true;
            this.lblToolName1.Font = new System.Drawing.Font("Segoe UI", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblToolName1.ForeColor = System.Drawing.Color.White;
            this.lblToolName1.Location = new System.Drawing.Point(10, 10);
            this.lblToolName1.Name = "lblToolName1";
            this.lblToolName1.Size = new System.Drawing.Size(113, 25);
            this.lblToolName1.TabIndex = 0;
            this.lblToolName1.Text = "ToolName1";
            // 
            // lblPrice1
            // 
            this.lblPrice1.AutoSize = true;
            this.lblPrice1.Font = new System.Drawing.Font("Segoe UI Semibold", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPrice1.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.lblPrice1.Location = new System.Drawing.Point(10, 39);
            this.lblPrice1.Name = "lblPrice1";
            this.lblPrice1.Size = new System.Drawing.Size(34, 17);
            this.lblPrice1.TabIndex = 1;
            this.lblPrice1.Text = "100$";
            // 
            // lblDetails1
            // 
            this.lblDetails1.AutoSize = true;
            this.lblDetails1.Font = new System.Drawing.Font("Segoe UI", 10F);
            this.lblDetails1.ForeColor = System.Drawing.Color.Gainsboro;
            this.lblDetails1.Location = new System.Drawing.Point(10, 62);
            this.lblDetails1.Name = "lblDetails1";
            this.lblDetails1.Size = new System.Drawing.Size(85, 19);
            this.lblDetails1.TabIndex = 2;
            this.lblDetails1.Text = "2024-01-01";
            // 
            // recentActivityCard2
            // 
            this.recentActivityCard2.BackColor = System.Drawing.Color.Transparent;
            this.recentActivityCard2.Controls.Add(this.lblToolName2);
            this.recentActivityCard2.Controls.Add(this.lblPrice2);
            this.recentActivityCard2.Controls.Add(this.lblDetails2);
            this.recentActivityCard2.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(20)))), ((int)(((byte)(20)))), ((int)(((byte)(20)))));
            this.recentActivityCard2.Location = new System.Drawing.Point(200, 400);
            this.recentActivityCard2.Margin = new System.Windows.Forms.Padding(10, 0, 3, 10);
            this.recentActivityCard2.Name = "recentActivityCard2";
            this.recentActivityCard2.Radius = 10;
            this.recentActivityCard2.ShadowColor = System.Drawing.Color.Black;
            this.recentActivityCard2.ShadowStyle = Guna.UI2.WinForms.Guna2ShadowPanel.ShadowMode.ForwardDiagonal;
            this.recentActivityCard2.Size = new System.Drawing.Size(300, 99);
            this.recentActivityCard2.TabIndex = 1;
            // 
            // lblToolName2
            // 
            this.lblToolName2.AutoSize = true;
            this.lblToolName2.Font = new System.Drawing.Font("Segoe UI", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblToolName2.ForeColor = System.Drawing.Color.White;
            this.lblToolName2.Location = new System.Drawing.Point(10, 10);
            this.lblToolName2.Name = "lblToolName2";
            this.lblToolName2.Size = new System.Drawing.Size(113, 25);
            this.lblToolName2.TabIndex = 0;
            this.lblToolName2.Text = "ToolName2";
            // 
            // lblPrice2
            // 
            this.lblPrice2.AutoSize = true;
            this.lblPrice2.Font = new System.Drawing.Font("Segoe UI Semibold", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPrice2.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.lblPrice2.Location = new System.Drawing.Point(10, 39);
            this.lblPrice2.Name = "lblPrice2";
            this.lblPrice2.Size = new System.Drawing.Size(36, 17);
            this.lblPrice2.TabIndex = 1;
            this.lblPrice2.Text = "200$";
            // 
            // lblDetails2
            // 
            this.lblDetails2.AutoSize = true;
            this.lblDetails2.Font = new System.Drawing.Font("Segoe UI", 10F);
            this.lblDetails2.ForeColor = System.Drawing.Color.Gainsboro;
            this.lblDetails2.Location = new System.Drawing.Point(10, 62);
            this.lblDetails2.Name = "lblDetails2";
            this.lblDetails2.Size = new System.Drawing.Size(85, 19);
            this.lblDetails2.TabIndex = 2;
            this.lblDetails2.Text = "2024-01-02";
            // 
            // lblRecentActivity
            // 
            this.lblRecentActivity.AutoSize = true;
            this.lblRecentActivity.BackColor = System.Drawing.Color.Transparent;
            this.lblRecentActivity.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Bold);
            this.lblRecentActivity.ForeColor = System.Drawing.Color.White;
            this.lblRecentActivity.Location = new System.Drawing.Point(227, 260);
            this.lblRecentActivity.Name = "lblRecentActivity";
            this.lblRecentActivity.Size = new System.Drawing.Size(143, 25);
            this.lblRecentActivity.TabIndex = 100;
            this.lblRecentActivity.Text = "Recent Activity";
            // 
            // picRecentActivity
            // 
            this.picRecentActivity.BackColor = System.Drawing.Color.Transparent;
            this.picRecentActivity.Image = global::toolygsm1.Properties.Resources.history;
            this.picRecentActivity.Location = new System.Drawing.Point(200, 260);
            this.picRecentActivity.Name = "picRecentActivity";
            this.picRecentActivity.Size = new System.Drawing.Size(28, 28);
            this.picRecentActivity.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picRecentActivity.TabIndex = 101;
            this.picRecentActivity.TabStop = false;
            // 
            // userMenuArrow
            // 
            this.userMenuArrow.BackColor = System.Drawing.Color.Transparent;
            this.userMenuArrow.Image = ((System.Drawing.Image)(resources.GetObject("userMenuArrow.Image")));
            this.userMenuArrow.ImageRotate = 0F;
            this.userMenuArrow.Location = new System.Drawing.Point(1006, 35);
            this.userMenuArrow.Name = "userMenuArrow";
            this.userMenuArrow.Size = new System.Drawing.Size(13, 15);
            this.userMenuArrow.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.userMenuArrow.TabIndex = 7;
            this.userMenuArrow.TabStop = false;
            this.userMenuArrow.Click += new System.EventHandler(this.UserMenu_Show);
            // 
            // userPic
            // 
            this.userPic.BackColor = System.Drawing.Color.Transparent;
            this.userPic.Image = ((System.Drawing.Image)(resources.GetObject("userPic.Image")));
            this.userPic.ImageLocation = "https://i.ibb.co/SwZfTGbT/user.png";
            this.userPic.ImageRotate = 0F;
            this.userPic.Location = new System.Drawing.Point(883, 28);
            this.userPic.Name = "userPic";
            this.userPic.Size = new System.Drawing.Size(31, 30);
            this.userPic.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.userPic.TabIndex = 5;
            this.userPic.TabStop = false;
            this.userPic.Click += new System.EventHandler(this.UserMenu_Show);
            // 
            // customTitleBar
            // 
            this.customTitleBar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(8)))), ((int)(((byte)(8)))), ((int)(((byte)(8)))));
            this.customTitleBar.Controls.Add(this.lblTitleBar);
            this.customTitleBar.Controls.Add(this.btnClose);
            this.customTitleBar.Controls.Add(this.btnMinimize);
            this.customTitleBar.Dock = System.Windows.Forms.DockStyle.Top;
            this.customTitleBar.Location = new System.Drawing.Point(180, 0);
            this.customTitleBar.Name = "customTitleBar";
            this.customTitleBar.Size = new System.Drawing.Size(956, 29);
            this.customTitleBar.TabIndex = 102;
            this.customTitleBar.MouseDown += new System.Windows.Forms.MouseEventHandler(this.CustomTitleBar_MouseDown);
            // 
            // lblTitleBar
            // 
            this.lblTitleBar.AutoSize = true;
            this.lblTitleBar.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Bold);
            this.lblTitleBar.ForeColor = System.Drawing.Color.White;
            this.lblTitleBar.Location = new System.Drawing.Point(337, 2);
            this.lblTitleBar.Name = "lblTitleBar";
            this.lblTitleBar.Size = new System.Drawing.Size(119, 25);
            this.lblTitleBar.TabIndex = 0;
            this.lblTitleBar.Text = "TOOLY GSM";
            // 
            // btnClose
            // 
            this.btnClose.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnClose.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(8)))), ((int)(((byte)(8)))), ((int)(((byte)(8)))));
            this.btnClose.FlatAppearance.BorderSize = 0;
            this.btnClose.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnClose.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Bold);
            this.btnClose.ForeColor = System.Drawing.Color.White;
            this.btnClose.Location = new System.Drawing.Point(920, 0);
            this.btnClose.Name = "btnClose";
            this.btnClose.Size = new System.Drawing.Size(36, 29);
            this.btnClose.TabIndex = 1;
            this.btnClose.Text = "X";
            this.btnClose.UseVisualStyleBackColor = false;
            // 
            // btnMinimize
            // 
            this.btnMinimize.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnMinimize.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(8)))), ((int)(((byte)(8)))), ((int)(((byte)(8)))));
            this.btnMinimize.FlatAppearance.BorderSize = 0;
            this.btnMinimize.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnMinimize.Font = new System.Drawing.Font("Segoe UI", 14F, System.Drawing.FontStyle.Bold);
            this.btnMinimize.ForeColor = System.Drawing.Color.White;
            this.btnMinimize.Location = new System.Drawing.Point(878, 0);
            this.btnMinimize.Name = "btnMinimize";
            this.btnMinimize.Size = new System.Drawing.Size(36, 26);
            this.btnMinimize.TabIndex = 2;
            this.btnMinimize.Text = "-";
            this.btnMinimize.UseVisualStyleBackColor = false;
            // 
            // supportPanel
            // 
            this.supportPanel.BackColor = System.Drawing.Color.Transparent;
            this.supportPanel.Controls.Add(this.guna2Button1);
            this.supportPanel.Controls.Add(this.btnShowMore);
            this.supportPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.supportPanel.Location = new System.Drawing.Point(0, 0);
            this.supportPanel.Name = "supportPanel";
            this.supportPanel.Size = new System.Drawing.Size(1136, 697);
            this.supportPanel.TabIndex = 200;
            this.supportPanel.Visible = false;
            // 
            // guna2Button1
            // 
            this.guna2Button1.AutoRoundedCorners = true;
            this.guna2Button1.BorderRadius = 19;
            this.guna2Button1.DisabledState.BorderColor = System.Drawing.Color.DarkGray;
            this.guna2Button1.DisabledState.CustomBorderColor = System.Drawing.Color.DarkGray;
            this.guna2Button1.DisabledState.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(169)))), ((int)(((byte)(169)))), ((int)(((byte)(169)))));
            this.guna2Button1.DisabledState.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(141)))), ((int)(((byte)(141)))), ((int)(((byte)(141)))));
            this.guna2Button1.FillColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(104)))), ((int)(((byte)(44)))));
            this.guna2Button1.Font = new System.Drawing.Font("Impact", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.guna2Button1.ForeColor = System.Drawing.Color.White;
            this.guna2Button1.Location = new System.Drawing.Point(200, 512);
            this.guna2Button1.Name = "guna2Button1";
            this.guna2Button1.Size = new System.Drawing.Size(95, 41);
            this.guna2Button1.TabIndex = 0;
            this.guna2Button1.Text = "عرض المزيد";
            // 
            // btnShowMore
            // 
            this.btnShowMore.AutoRoundedCorners = true;
            this.btnShowMore.BorderRadius = 19;
            this.btnShowMore.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnShowMore.FillColor = System.Drawing.Color.Transparent;
            this.btnShowMore.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.btnShowMore.ForeColor = System.Drawing.Color.White;
            this.btnShowMore.ImageAlign = System.Windows.Forms.HorizontalAlignment.Left;
            this.btnShowMore.ImageSize = new System.Drawing.Size(28, 28);
            this.btnShowMore.Location = new System.Drawing.Point(200, 559);
            this.btnShowMore.Name = "btnShowMore";
            this.btnShowMore.Size = new System.Drawing.Size(150, 40);
            this.btnShowMore.TabIndex = 1;
            this.btnShowMore.Text = "عرض المزيد";
            this.btnShowMore.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            this.btnShowMore.Click += new System.EventHandler(this.btnShowMore_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoValidate = System.Windows.Forms.AutoValidate.Disable;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(11)))), ((int)(((byte)(11)))), ((int)(((byte)(11)))));
            this.ClientSize = new System.Drawing.Size(1136, 697);
            this.Controls.Add(this.customTitleBar);
            this.Controls.Add(this.picRecentActivity);
            this.Controls.Add(this.lblRecentActivity);
            this.Controls.Add(this.userMenuArrow);
            this.Controls.Add(this.infoCardEndDate);
            this.Controls.Add(this.userPic);
            this.Controls.Add(this.userNameLabel);
            this.Controls.Add(this.sidebarPanel);
            this.Controls.Add(this.infoCardPackage);
            this.Controls.Add(this.infoCardBalance);
            this.Controls.Add(this.recentActivityCard1);
            this.Controls.Add(this.recentActivityCard2);
            this.Controls.Add(this.supportPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Form1";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.sidebarPanel.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBoxLogo)).EndInit();
            this.infoCardPackage.ResumeLayout(false);
            this.infoCardPackage.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.packagePic)).EndInit();
            this.infoCardBalance.ResumeLayout(false);
            this.infoCardBalance.PerformLayout();
            this.infoCardEndDate.ResumeLayout(false);
            this.infoCardEndDate.PerformLayout();
            this.recentActivityCard1.ResumeLayout(false);
            this.recentActivityCard1.PerformLayout();
            this.recentActivityCard2.ResumeLayout(false);
            this.recentActivityCard2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picRecentActivity)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.userMenuArrow)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.userPic)).EndInit();
            this.customTitleBar.ResumeLayout(false);
            this.customTitleBar.PerformLayout();
            this.supportPanel.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Guna2Panel sidebarPanel;
        private Guna2Button btnHome;
        private Guna2Button btnToolsFree;
        private Guna2Button btnToolsWithCredit;
        private Guna2PictureBox pictureBoxLogo;
        private Guna2ShadowPanel infoCardPackage;
        private Guna2ShadowPanel infoCardBalance;
        private Guna2ShadowPanel infoCardEndDate;
        private Guna2HtmlLabel lblCardPackageValue;
        private Guna2HtmlLabel lblCardBalanceTitle;
        private Guna2HtmlLabel lblCardBalanceValue;
        private Guna2HtmlLabel lblCardEndDateTitle;
        private Guna2HtmlLabel lblCardEndDateValue;
        private Guna2PictureBox userPic;
        private Guna2HtmlLabel userNameLabel;
        private Guna2ContextMenuStrip userMenu;
        private Guna2PictureBox userMenuArrow;
        private Guna2Button btnRequestsLog;
        private Guna2Separator separatorHomeToWithCredit;
        private Guna2Separator separatorWithCreditToFree;
        private Guna2Separator guna2Separator1;
        private Guna2Button btnLog;
        private Guna2PictureBox packagePic;
        private System.Windows.Forms.Panel customTitleBar;
        private System.Windows.Forms.Label lblTitleBar;
        private System.Windows.Forms.Button btnClose;
        private System.Windows.Forms.Button btnMinimize;
        private Guna2Button btnSupport;
        private System.Windows.Forms.Panel supportPanel;
        private Guna2ShadowPanel recentActivityCard1;
        private Guna2ShadowPanel recentActivityCard2;
        private System.Windows.Forms.Label lblRecentActivity;
        private System.Windows.Forms.PictureBox picRecentActivity;
        private System.Windows.Forms.Label lblToolName1;
        private System.Windows.Forms.Label lblPrice1;
        private System.Windows.Forms.Label lblDetails1;
        private System.Windows.Forms.Label lblToolName2;
        private System.Windows.Forms.Label lblPrice2;
        private System.Windows.Forms.Label lblDetails2;
        private Guna2Button guna2Button1;
        private Guna2Button btnShowMore;
    }
}

