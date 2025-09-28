// -*- coding: utf-8 -*-
using System;
using System.Threading;
using System.Windows.Automation;
using System.Diagnostics;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Windows;
using System.Net.Http;
using System.Text;

namespace toolygsm1.Automation
{
    public class UnlockToolAutomation
    {
        [DllImport("user32.dll")]
        private static extern bool BlockInput(bool fBlockIt);

        // بدء الأتوميشن مع تمرير بيانات الحساب
        public static void StartUnlockToolAutomation(string username, string password, string toolRequestId, string apiBaseUrl, string bearerToken)
        {
            try
            {
                BlockInput(true); // ??? ?????? ?? ?????? ????????? 
                var unblockTimer = new System.Timers.Timer(120000); // ???????
                unblockTimer.Elapsed += (s, e) => { BlockInput(false); unblockTimer.Stop(); };
                unblockTimer.AutoReset = false;
                unblockTimer.Start();

                AutomationElement targetWindow = FindUnlockToolWindow();
                if (targetWindow == null)
                {
                    BlockInput(false);
                    MessageBox.Show("UnlockTool program not found. Make sure it's open.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }
                bool firstAttempt = true;
                int maxAttempts = 2;
                bool failed = false;
                for (int attempt = 1; attempt <= maxAttempts; attempt++)
                {
                    bool loginSuccess = PerformLoginSequence(targetWindow, firstAttempt, username, password);
                    if (loginSuccess)
                    {
                        Thread.Sleep(30000); // ???????? 30 ?????
                        if (IsStillOnLoginPage(targetWindow))
                        {
                            if (attempt < maxAttempts)
                                firstAttempt = false;
                        }
                        else
                        {
                            // Report success to API (fire-and-forget)
                            ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "success");
                            BlockInput(false);
                            MessageBox.Show("Operation completed successfully.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Information);
                            return;
                        }
                    }
                    else
                    {
                        // Report failed attempt (final status will be sent below too)
                        BlockInput(false);
                        MessageBox.Show("Login sequence failed.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        failed = true;
                        break;
                    }
                }
                if (failed || IsStillOnLoginPage(targetWindow))
                {
                    // Report failure to API
                    ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed");
                    BlockInput(false);
                    MessageBox.Show("All attempts completed. Still on login page.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                BlockInput(false);
                MessageBox.Show($"Error occurred: {ex.Message}", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // بدء الأتوميشن مع قائمة حسابات متعددة (مثل TSM)
        public static void StartUnlockToolAutomation(System.Collections.Generic.List<(string Username, string Password)> accounts,
                                                  string toolRequestId, string apiBaseUrl, string bearerToken)
        {
            try
            {
                if (accounts == null || accounts.Count == 0)
                {
                    ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "No accounts provided to try.");
                    MessageBox.Show("No accounts provided to try.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                BlockInput(true); // ??? ?????? ?? ?????? ????????? 
                var unblockTimer = new System.Timers.Timer(300000); // 5 ?????? ?????? ?????? ???????
                unblockTimer.Elapsed += (s, e) => { BlockInput(false); unblockTimer.Stop(); };
                unblockTimer.AutoReset = false;
                unblockTimer.Start();

                for (int i = 0; i < accounts.Count; i++)
                {
                    var acc = accounts[i];
                    var targetWindow = FindUnlockToolWindow();
                    if (targetWindow == null)
                    {
                        ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "UnlockTool program not found. Make sure it's open.");
                        MessageBox.Show("UnlockTool program not found. Make sure it's open.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        BlockInput(false);
                        return;
                    }

                    bool firstAttempt = true;
                    int maxAttempts = 2;
                    bool accountFailed = false;

                    for (int attempt = 1; attempt <= maxAttempts; attempt++)
                    {
                        bool loginSuccess = PerformLoginSequence(targetWindow, firstAttempt, acc.Username, acc.Password);
                        if (loginSuccess)
                        {
                            Thread.Sleep(30000); // ???????? 30 ?????
                            if (IsStillOnLoginPage(targetWindow))
                            {
                                if (attempt < maxAttempts)
                                    firstAttempt = false;
                            }
                            else
                            {
                                // Report success to API (fire-and-forget)
                                ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "success");
                                BlockInput(false);
                                MessageBox.Show("Operation completed successfully.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Information);
                                return;
                            }
                        }
                        else
                        {
                            // إذا فشل، جرّب المحاولة التالية أو الحساب التالي
                            if (attempt < maxAttempts)
                            {
                                firstAttempt = false;
                                continue;
                            }
                            else
                            {
                                accountFailed = true;
                                break;
                            }
                        }
                    }

                    // إذا فشل الحساب الحالي، جرّب الحساب التالي دون إظهار رسالة للمستخدم إلا في آخر حساب
                    if (accountFailed)
                    {
                        if (i == accounts.Count - 1)
                        {
                            ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", "All accounts failed. Still on login page.");
                            MessageBox.Show("All accounts failed. Still on login page.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        }
                        continue;
                    }
                }
                BlockInput(false);
            }
            catch (Exception ex)
            {
                BlockInput(false);
                ReportStatus(apiBaseUrl, bearerToken, toolRequestId, "failed", ex.Message);
                MessageBox.Show($"Error occurred: {ex.Message}", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static bool PerformLoginSequence(AutomationElement window, bool handleDisclaimer, string enteredUsername, string enteredPassword)
        {
            try
            {
                AutomationElement firstEditField = FindFirstEditField(window);
                if (firstEditField == null)
                    return false;
                firstEditField.SetFocus(); // ????? ?????? ??? ???? ??????
                SetTextValue(firstEditField, enteredUsername);
                Thread.Sleep(300);
                // ????? ?? ???? ????????
                AutomationElement passwordField = FindPasswordEditField(window, firstEditField);
                if (passwordField == null)
                    return false;
                passwordField.SetFocus(); // ????? ?????? ??? ???? ????????
                SetTextValue(passwordField, enteredPassword);
                Thread.Sleep(500);
                AutomationElement rememberCheckbox = FindRememberCheckbox(window);
                if (rememberCheckbox != null)
                    HandleRememberCheckbox(rememberCheckbox);
                AutomationElement unlockLoginButton = FindLoginButton(window);
                if (unlockLoginButton != null && unlockLoginButton.Current.IsEnabled)
                {
                    Thread.Sleep(1000);
                    ClickElement(unlockLoginButton);
                    if (handleDisclaimer)
                    {
                        Thread.Sleep(5000);
                        HandleDisclaimerDialog();
                    }
                    return true;
                }
                return false;
            }
            catch { return false; }
        }

        private static bool IsStillOnLoginPage(AutomationElement window)
        {
            try
            {
                string[] loginPageElements = { "VPN", "Forum", "Reset Password", "Register" };
                int foundElements = 0;
                foreach (string elementName in loginPageElements)
                {
                    var textCondition = new AndCondition(
                        new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Text),
                        new PropertyCondition(AutomationElement.NameProperty, elementName)
                    );
                    AutomationElement element = window.FindFirst(TreeScope.Descendants, textCondition);
                    if (element != null)
                        foundElements++;
                }
                AutomationElement rememberCheckbox = FindRememberCheckbox(window);
                AutomationElement loginButton = FindLoginButton(window);
                if (rememberCheckbox != null) foundElements++;
                if (loginButton != null) foundElements++;
                return foundElements >= 4;
            }
            catch { return true; }
        }

        private static AutomationElement FindFirstEditField(AutomationElement parentWindow)
        {
            if (parentWindow == null) return null;
            var classCondition = new PropertyCondition(AutomationElement.ClassNameProperty, "TcxCustomInnerTextEdit");
            var editControls = parentWindow.FindAll(TreeScope.Descendants, classCondition);
            for (int i = 0; i < editControls.Count; i++)
            {
                var control = editControls[i];
                try
                {
                    if (control.Current.IsEnabled)
                        return control;
                }
                catch { continue; }
            }
            return null;
        }

        private static AutomationElement FindPasswordEditField(AutomationElement parentWindow, AutomationElement usernameField)
        {
            if (parentWindow == null) return null;
            var classCondition = new PropertyCondition(AutomationElement.ClassNameProperty, "TcxCustomInnerTextEdit");
            var editControls = parentWindow.FindAll(TreeScope.Descendants, classCondition);
            foreach (AutomationElement control in editControls)
            {
                if (control != usernameField && control.Current.IsEnabled)
                    return control;
            }
            return null;
        }

        private static AutomationElement FindUnlockToolWindow()
        {
            var windows = AutomationElement.RootElement.FindAll(TreeScope.Children, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window));
            foreach (AutomationElement win in windows)
            {
                var name = win?.Current.Name ?? "";
                if (name.StartsWith("UNLOCKTOOL") && name.EndsWith("- https://unlocktool.net"))
                {
                    return win;
                }
            }
            return null;
        }

        private static void SetTextValue(AutomationElement element, string text)
        {
            if (element == null) return;
            try
            {
                element.SetFocus(); // ????? ?????? ??? ???????
                Thread.Sleep(200);
                SendKeys.SendWait("^a");
                Thread.Sleep(100);
                SendKeys.SendWait("{DELETE}");
                Thread.Sleep(100);
                if (element.TryGetCurrentPattern(ValuePattern.Pattern, out object valuePattern))
                {
                    ((ValuePattern)valuePattern).SetValue(text);
                    Thread.Sleep(200);
                    string currentValue = ((ValuePattern)valuePattern).Current.Value;
                    if (currentValue == text) return;
                }
                element.SetFocus(); // ????? ?????? ??? ??????? ??? ????
                Thread.Sleep(200);
                SendKeys.SendWait("^a");
                Thread.Sleep(100);
                SendKeys.SendWait(text);
                Thread.Sleep(200);
            }
            catch { }
        }

        private static AutomationElement FindRememberCheckbox(AutomationElement parentWindow)
        {
            if (parentWindow == null) return null;
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.ClassNameProperty, "TcxCheckBox"),
                new PropertyCondition(AutomationElement.NameProperty, "Remember")
            );
            return parentWindow.FindFirst(TreeScope.Descendants, condition);
        }

        private static void HandleRememberCheckbox(AutomationElement checkbox)
        {
            if (checkbox == null) return;
            try
            {
                if (checkbox.TryGetCurrentPattern(TogglePattern.Pattern, out object togglePattern))
                {
                    TogglePattern toggle = (TogglePattern)togglePattern;
                    ToggleState currentState = toggle.Current.ToggleState;
                    if (currentState == ToggleState.On)
                        toggle.Toggle();
                }
            }
            catch { }
        }

        private static AutomationElement FindLoginButton(AutomationElement parentWindow)
        {
            if (parentWindow == null) return null;
            var condition = new AndCondition(
                new PropertyCondition(AutomationElement.ClassNameProperty, "TcxButton"),
                new PropertyCondition(AutomationElement.NameProperty, "Login")
            );
            return parentWindow.FindFirst(TreeScope.Descendants, condition);
        }

        private static void ClickElement(AutomationElement element)
        {
            if (element == null) return;
            try
            {
                element.SetFocus();
                Thread.Sleep(200);
                SendKeys.SendWait("{ENTER}");
                Thread.Sleep(500);
                element.SetFocus();
                Thread.Sleep(200);
                SendKeys.SendWait(" ");
                Thread.Sleep(500);
                if (element.TryGetCurrentPattern(InvokePattern.Pattern, out object invokePattern))
                {
                    ((InvokePattern)invokePattern).Invoke();
                    Thread.Sleep(500);
                }
                System.Windows.Rect boundingRect = element.Current.BoundingRectangle;
                int centerX = (int)(boundingRect.Left + (boundingRect.Width / 2));
                int centerY = (int)(boundingRect.Top + (boundingRect.Height / 2));
                SetCursorPos(centerX, centerY);
                Thread.Sleep(100);
                mouse_event(MOUSEEVENTF_LEFTDOWN, (uint)centerX, (uint)centerY, 0, 0);
                Thread.Sleep(50);
                mouse_event(MOUSEEVENTF_LEFTUP, (uint)centerX, (uint)centerY, 0, 0);
                Thread.Sleep(500);
            }
            catch { }
        }

        [DllImport("user32.dll")]
        static extern bool SetCursorPos(int x, int y);
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint cButtons, uint dwExtraInfo);
        private const int MOUSEEVENTF_LEFTDOWN = 0x02;
        private const int MOUSEEVENTF_LEFTUP = 0x04;

        private static void HandleDisclaimerDialog()
        {
            try
            {
                var disclaimerCondition = new PropertyCondition(AutomationElement.NameProperty, "Disclaimer");
                AutomationElement disclaimerWindow = AutomationElement.RootElement.FindFirst(TreeScope.Children, disclaimerCondition);
                if (disclaimerWindow != null)
                {
                    Thread.Sleep(8000);
                    AutomationElement agreeButton = FindAgreeButton(disclaimerWindow);
                    if (agreeButton != null)
                    {
                        ClickElement(agreeButton);
                        Thread.Sleep(2000);
                    }
                }
            }
            catch { }
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
                    client.DefaultRequestHeaders.Add("Origin", apiBaseUrl);
                    client.DefaultRequestHeaders.UserAgent.ParseAdd("ToolyGSM-Desktop/1.0");
                    client.DefaultRequestHeaders.Accept.ParseAdd("application/json");

                    string json;
                    if (!string.IsNullOrWhiteSpace(message))
                    {
                        // Include a short message for server visibility
                        json = "{\"toolRequestId\":\"" + toolRequestId + "\",\"status\":\"" + status + "\",\"notes\":\"" + EscapeJson(message) + "\"}";
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

        private static AutomationElement FindAgreeButton(AutomationElement disclaimerWindow)
        {
            if (disclaimerWindow == null) return null;
            var buttons = disclaimerWindow.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ClassNameProperty, "TcxButton"));
            foreach (AutomationElement button in buttons)
            {
                if (button?.Current.Name != null && button.Current.Name.StartsWith("Agree"))
                    return button;
            }
            return null;
        }
    }
}
