// -*- coding: utf-8 -*-
using System;
using System.Threading;
using System.Windows.Automation;
using System.Diagnostics;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Net.Http;
using System.Text;

namespace toolygsm1.Automation
{
    public class TsmToolAutomation
    {
        // Window title signature observed in inspector:
        // "Login UI TSM TOOL PRO v2.2.9 #Build:2025.09.14 13.53"
        // Controls (Qt):
        //  - Email edit  AutomationId="MW.LoginDialog.stackedWidget.page_2.line_EMAIL" ClassName="QtMaterialAutoComplete"
        //  - Password edit AutomationId="MW.LoginDialog.stackedWidget.page_2.line_PASSWORD" ClassName="QtMaterialAutoComplete"
        //  - Login button: not provided → we will detect a Button in same dialog whose Name contains "Login"/"Sign in"

        public static void StartTsmToolAutomation(string username, string password, string toolRequestId, string apiBaseUrl, string bearerToken)
        {
            try
            {
                var window = FindTsmWindow();
                if (window == null)
                {
                    string msg = "TSM TOOL window not found. Open the app first.";
                    ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", msg);
                    MessageBox.Show(msg, "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                string loginError = null;
                bool ok = PerformLogin(window, username, password, out loginError);
                if (!ok)
                {
                    string msg = string.IsNullOrWhiteSpace(loginError) ? "Login automation failed." : loginError;
                    ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", msg);
                    MessageBox.Show(msg, "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                // Give the app time to navigate after login
                if (WaitUntil(() => !IsOnLoginScreen(window), TimeSpan.FromSeconds(30), TimeSpan.FromMilliseconds(300)))
                {
                    ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "success");
                    return;
                }

                ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "Still on login screen after submission.");
                MessageBox.Show("Still on login screen after submission.", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", ex.Message);
                MessageBox.Show($"TSM automation error: {ex.Message}", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public static void StartTsmToolAutomation(System.Collections.Generic.List<(string Username, string Password)> accounts,
                                                  string toolRequestId, string apiBaseUrl, string bearerToken)
        {
            try
            {
                if (accounts == null || accounts.Count == 0)
                {
                    ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "No accounts provided to try.");
                    MessageBox.Show("No accounts provided to try.", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                for (int i = 0; i < accounts.Count; i++)
                {
                    var acc = accounts[i];
                    var window = FindTsmWindow();
                    if (window == null)
                    {
                        ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "TSM TOOL window not found. Open the app first.");
                        MessageBox.Show("TSM TOOL window not found. Open the app first.", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }

                    string loginError;
                    bool ok = PerformLogin(window, acc.Username, acc.Password, out loginError);
                    if (!ok)
                    {
                        // إذا فشل، جرّب الحساب التالي دون إظهار رسالة للمستخدم إلا في آخر محاولة
                        if (i == accounts.Count - 1)
                        {
                            var msg = string.IsNullOrWhiteSpace(loginError) ? "Login automation failed." : loginError;
                            ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", msg);
                            MessageBox.Show(msg, "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                        continue;
                    }

                    if (WaitUntil(() => !IsOnLoginScreen(window), TimeSpan.FromSeconds(30), TimeSpan.FromMilliseconds(300)))
                    {
                        ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "success");
                        MessageBox.Show("Operation completed successfully.", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        return;
                    }

                    if (i == accounts.Count - 1)
                    {
                        ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "Still on login screen after submission.");
                        MessageBox.Show("Still on login screen after submission.", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    }
                }
            }
            catch (Exception ex)
            {
                ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", ex.Message);
                MessageBox.Show($"TSM automation error: {ex.Message}", "TSM TOOL", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static bool PerformLogin(AutomationElement window, string username, string password, out string errorMessage)
        {
            errorMessage = null;
            try
            {
                var emailBox = FindByAutomationId(window, "MW.LoginDialog.stackedWidget.page_2.line_EMAIL");
                var passBox = FindByAutomationId(window, "MW.LoginDialog.stackedWidget.page_2.line_PASSWORD");

                if (emailBox == null || passBox == null)
                {
                    errorMessage = "Login fields not found.";
                    return false;
                }

                SetText(emailBox, username);
                Thread.Sleep(150);
                SetText(passBox, password);

                // Ensure Remember ME is turned off before submitting
                EnsureRememberOff(window);

                // Find a button to submit
                var loginBtn = FindLoginButton(window);
                if (loginBtn == null)
                {
                    // fallback: press Enter on password box
                    passBox.SetFocus();
                    Thread.Sleep(100);
                    SendKeys.SendWait("{ENTER}");
                    Thread.Sleep(5000);
                    var err2 = GetLoginError(window);
                    if (!string.IsNullOrEmpty(err2))
                    {
                        errorMessage = err2;
                        return false;
                    }
                    return true;
                }

                Click(loginBtn);
                Thread.Sleep(5000);
                var err = GetLoginError(window);
                if (!string.IsNullOrEmpty(err))
                {
                    errorMessage = err;
                    return false;
                }
                return true;
            }
            catch { return false; }
        }

        private static AutomationElement FindTsmWindow()
        {
            var windows = AutomationElement.RootElement.FindAll(TreeScope.Children, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window));
            foreach (AutomationElement win in windows)
            {
                try
                {
                    string name = win?.Current.Name ?? string.Empty;
                    string cls = win?.Current.ClassName ?? string.Empty;
                    string framework = win?.Current.FrameworkId ?? string.Empty;

                    // Heuristic 1: window caption contains TSM markers
                    bool titleLooksLikeTsm = name.IndexOf("TSM TOOL", StringComparison.OrdinalIgnoreCase) >= 0
                                              || name.IndexOf("Login UI TSM", StringComparison.OrdinalIgnoreCase) >= 0;
                    if (titleLooksLikeTsm)
                        return win;

                    // Heuristic 2: look for a TitleBar child whose Value contains the caption text you shared
                    var titleBarCond = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.TitleBar);
                    var titleBar = win.FindFirst(TreeScope.Children, titleBarCond);
                    if (titleBar != null)
                    {
                        string tbVal = string.Empty;
                        try
                        {
                            if (titleBar.TryGetCurrentPattern(ValuePattern.Pattern, out object vp))
                                tbVal = ((ValuePattern)vp).Current.Value ?? string.Empty;
                            else
                                tbVal = titleBar.Current.Name ?? string.Empty;
                        }
                        catch { }
                        if (tbVal.IndexOf("TSM TOOL", StringComparison.OrdinalIgnoreCase) >= 0
                            || tbVal.IndexOf("Login UI TSM", StringComparison.OrdinalIgnoreCase) >= 0)
                            return win;
                    }

                    // Heuristic 3: fallback to Qt window class without title check (some builds have empty Name)
                    if (cls == "Qt5QWindowIcon" || framework.Equals("Qt", StringComparison.OrdinalIgnoreCase))
                    {
                        // Search inside for known login fields to confirm it's TSM
                        var email = FindByAutomationId(win, "MW.LoginDialog.stackedWidget.page_2.line_EMAIL");
                        var pass = FindByAutomationId(win, "MW.LoginDialog.stackedWidget.page_2.line_PASSWORD");
                        if (email != null && pass != null)
                            return win;
                    }
                }
                catch { }
            }
            return null;
        }

        private static AutomationElement FindByAutomationId(AutomationElement root, string automationId)
        {
            try
            {
                var cond = new PropertyCondition(AutomationElement.AutomationIdProperty, automationId);
                return root.FindFirst(TreeScope.Descendants, cond);
            }
            catch { return null; }
        }

        private static AutomationElement FindLoginButton(AutomationElement root)
        {
            try
            {
                // Prefer a Button whose Name hints login
                var condBtn = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button);
                var buttons = root.FindAll(TreeScope.Descendants, condBtn);
                for (int i = 0; i < buttons.Count; i++)
                {
                    var b = buttons[i];
                    try
                    {
                        string n = b.Current.Name ?? string.Empty;
                        if (n.IndexOf("login", StringComparison.OrdinalIgnoreCase) >= 0 ||
                            n.IndexOf("sign", StringComparison.OrdinalIgnoreCase) >= 0)
                            return b;
                    }
                    catch { }
                }
                // Fallback: first enabled button
                for (int i = 0; i < buttons.Count; i++)
                {
                    try { if (buttons[i].Current.IsEnabled) return buttons[i]; } catch { }
                }
            }
            catch { }
            return null;
        }

        private static void SetText(AutomationElement element, string value)
        {
            if (element == null) return;
            try
            {
                element.SetFocus();
                Thread.Sleep(80);
                if (element.TryGetCurrentPattern(ValuePattern.Pattern, out object vp))
                {
                    ((ValuePattern)vp).SetValue(value);
                    Thread.Sleep(80);
                    // Verify
                    var current = ((ValuePattern)vp).Current.Value;
                    if (current == value) return;
                }
                SendKeys.SendWait("^a");
                Thread.Sleep(50);
                SendKeys.SendWait("{DELETE}");
                Thread.Sleep(50);
                SendKeys.SendWait(value);
            }
            catch { }
        }

        private static void Click(AutomationElement element)
        {
            if (element == null) return;
            try
            {
                element.SetFocus();
                Thread.Sleep(80);
                if (element.TryGetCurrentPattern(InvokePattern.Pattern, out object ip))
                {
                    ((InvokePattern)ip).Invoke();
                    Thread.Sleep(120);
                    return;
                }
                SendKeys.SendWait("{ENTER}");
            }
            catch { }
        }

        private static bool IsOnLoginScreen(AutomationElement root)
        {
            try
            {
                // If email & password fields exist and are visible, likely still on login
                var email = FindByAutomationId(root, "MW.LoginDialog.stackedWidget.page_2.line_EMAIL");
                var pass = FindByAutomationId(root, "MW.LoginDialog.stackedWidget.page_2.line_PASSWORD");
                return email != null && pass != null && email.Current.IsEnabled && pass.Current.IsEnabled;
            }
            catch { return true; }
        }

        private static void EnsureRememberOff(AutomationElement root)
        {
            try
            {
                // Primary: find a real checkbox named "Remember ME" and toggle off if On
                var cond = new AndCondition(
                    new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.CheckBox),
                    new PropertyCondition(AutomationElement.NameProperty, "Remember ME")
                );
                var cb = root.FindFirst(TreeScope.Descendants, cond);
                if (cb != null)
                {
                    if (cb.TryGetCurrentPattern(TogglePattern.Pattern, out object tp))
                    {
                        var t = (TogglePattern)tp;
                        if (t.Current.ToggleState == ToggleState.On)
                            t.Toggle();
                        return;
                    }
                }

                // Fallback: try toggling the Qt switch track only if an adjacent text exists
                var trackCond = new PropertyCondition(AutomationElement.ClassNameProperty, "QtMaterialToggleTrack");
                var tracks = root.FindAll(TreeScope.Descendants, trackCond);
                for (int i = 0; i < tracks.Count; i++)
                {
                    // Heuristic: near a text named "Remember ME"
                    try
                    {
                        var parent = TreeWalker.ControlViewWalker.GetParent(tracks[i]);
                        var txt = parent?.FindFirst(TreeScope.Descendants, new AndCondition(
                            new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text),
                            new PropertyCondition(AutomationElement.NameProperty, "Remember ME")
                        ));
                        if (txt != null)
                        {
                            // Try Invoke on track to toggle state
                            if (tracks[i].TryGetCurrentPattern(InvokePattern.Pattern, out object ip))
                            {
                                ((InvokePattern)ip).Invoke();
                            }
                            break;
                        }
                    }
                    catch { }
                }
            }
            catch { }
        }

        private static string GetLoginError(AutomationElement root)
        {
            try
            {
                var textCond = new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text);
                var texts = root.FindAll(TreeScope.Descendants, textCond);
                for (int i = 0; i < texts.Count; i++)
                {
                    try
                    {
                        string n = texts[i].Current.Name ?? string.Empty;
                        if (string.IsNullOrWhiteSpace(n)) continue;
                        // Common error phrases observed
                        if (n.IndexOf("Wrong Email or Password", StringComparison.OrdinalIgnoreCase) >= 0 ||
                            n.IndexOf("wrong", StringComparison.OrdinalIgnoreCase) >= 0 && n.IndexOf("password", StringComparison.OrdinalIgnoreCase) >= 0 ||
                            n.IndexOf("invalid", StringComparison.OrdinalIgnoreCase) >= 0 && (n.IndexOf("email", StringComparison.OrdinalIgnoreCase) >= 0 || n.IndexOf("password", StringComparison.OrdinalIgnoreCase) >= 0) ||
                            n.IndexOf("error", StringComparison.OrdinalIgnoreCase) >= 0)
                        {
                            return n.Trim();
                        }
                    }
                    catch { }
                }
            }
            catch { }
            return null;
        }

        private static bool WaitUntil(Func<bool> predicate, TimeSpan timeout, TimeSpan pollEvery)
        {
            var sw = Stopwatch.StartNew();
            while (sw.Elapsed < timeout)
            {
                try { if (predicate()) return true; } catch { }
                Thread.Sleep(pollEvery);
            }
            return false;
        }

        private static void ReportStatus(string apiBaseUrl, string bearerToken, string toolRequestId, string status, string message = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(apiBaseUrl) || string.IsNullOrWhiteSpace(bearerToken) || string.IsNullOrWhiteSpace(toolRequestId))
                    return;
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(apiBaseUrl);
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {bearerToken}");
                    client.DefaultRequestHeaders.UserAgent.ParseAdd("ToolyGSM-Desktop/1.0");
                    client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
                    string json;
                    if (!string.IsNullOrWhiteSpace(message))
                    {
                        // Include a short message for server visibility
                        json = "{\"toolRequestId\":\"" + toolRequestId + "\",\"status\":\"" + status + "\",\"message\":\"" + EscapeJson(message) + "\"}";
                    }
                    else
                    {
                        json = "{\"toolRequestId\":\"" + toolRequestId + "\",\"status\":\"" + status + "\"}";
                    }
                    var content = new StringContent(json, Encoding.UTF8, "application/json");
                    var _ = client.PostAsync("/api/tool-requests/update-status", content).Result;
                }
            }
            catch { }
        }

        private static string EscapeJson(string value)
        {
            try { return value?.Replace("\\", "\\\\").Replace("\"", "\\\"") ?? string.Empty; } catch { return string.Empty; }
        }
    }
}


