using System;
using System.Threading;
using System.Windows.Automation;
using System.Diagnostics;
using System.Windows.Forms;
using System.Runtime.InteropServices;
using System.Windows;

namespace toolygsm1.Automation
{
    public class UnlockToolAutomation
    {
        // بدء الأوميشن مع الحساب المخصص
        public static void StartUnlockToolAutomation(string username = null, string password = null)
        {
            try
            {
                AutomationElement targetWindow = FindUnlockToolWindow();
                if (targetWindow == null)
                {
                    MessageBox.Show("UnlockTool program not found. Make sure it's open.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }
                bool firstAttempt = true;
                int maxAttempts = 2;
                for (int attempt = 1; attempt <= maxAttempts; attempt++)
                {
                    bool loginSuccess = PerformLoginSequence(targetWindow, firstAttempt, username, password);
                    if (loginSuccess)
                    {
                        Thread.Sleep(15000);
                        if (IsStillOnLoginPage(targetWindow))
                        {
                            if (attempt < maxAttempts)
                                firstAttempt = false;
                        }
                        else
                        {
                            MessageBox.Show("DONE SHARE", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Information);
                            return;
                        }
                    }
                    else
                    {
                        MessageBox.Show("Login sequence failed.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        break;
                    }
                }
                MessageBox.Show("All attempts completed. Still on login page.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error occurred: {ex.Message}", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static bool PerformLoginSequence(AutomationElement window, bool handleDisclaimer, string username = null, string password = null)
        {
            try
            {
                // استخدام الحساب المخصص أو الحساب الافتراضي
                string enteredUsername = !string.IsNullOrEmpty(username) ? username : "101023";
                string enteredPassword = !string.IsNullOrEmpty(password) ? password : "0000";
                AutomationElement firstEditField = FindFirstEditField(window);
                if (firstEditField == null)
                    return false;
                SetTextValue(firstEditField, enteredUsername);
                Thread.Sleep(300);
                SendKeys.SendWait("{TAB}");
                Thread.Sleep(300);
                SendKeys.SendWait(enteredPassword);
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

        private static AutomationElement FindUnlockToolWindow()
        {
            var condition = new PropertyCondition(AutomationElement.NameProperty, "UNLOCKTOOL");
            AutomationElement window = AutomationElement.RootElement.FindFirst(TreeScope.Children, condition);
            if (window == null)
            {
                var windows = AutomationElement.RootElement.FindAll(TreeScope.Children, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window));
                foreach (AutomationElement win in windows)
                {
                    if (win?.Current.Name != null && win.Current.Name.Contains("UNLOCKTOOL"))
                    {
                        window = win;
                        break;
                    }
                }
            }
            return window;
        }

        private static void SetTextValue(AutomationElement element, string text)
        {
            if (element == null) return;
            try
            {
                element.SetFocus();
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
                element.SetFocus();
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
