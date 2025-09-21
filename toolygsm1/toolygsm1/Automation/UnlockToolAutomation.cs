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
        // دالة محسنة للأوتوميشن مع حساب واحد
        public static void StartUnlockToolAutomation(string username, string password, string toolRequestId = null)
        {
            try
            {
                AutomationElement targetWindow = FindUnlockToolWindow();
                if (targetWindow == null)
                {
                    MessageBox.Show("UnlockTool program not found. Make sure it's open.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                Console.WriteLine($"Trying account: {username}");
                
                bool accountSuccess = false;
                int maxAttempts = 2; // محاولتان للحساب
                
                for (int attempt = 1; attempt <= maxAttempts; attempt++)
                {
                    Console.WriteLine($"Attempt {attempt} for account: {username}");
                    
                    bool loginSuccess = PerformLoginSequence(targetWindow, attempt == 1, username, password);
                    if (loginSuccess)
                    {
                        Thread.Sleep(15000); // انتظار تحميل الصفحة
                        
                        if (IsStillOnLoginPage(targetWindow))
                        {
                            Console.WriteLine($"Login failed for {username}, attempt {attempt}");
                            if (attempt < maxAttempts)
                            {
                                Thread.Sleep(3000); // انتظار قبل المحاولة التالية
                            }
                        }
                        else
                        {
                            Console.WriteLine($"SUCCESS! Account {username} worked on attempt {attempt}");
                            MessageBox.Show($"DONE SHARE - Account: {username}", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Information);
                            accountSuccess = true;
                            
                            // إرسال حالة النجاح إلى السيرفر
                            if (!string.IsNullOrEmpty(toolRequestId))
                            {
                                SendAutomationStatusToServer(toolRequestId, username, password, true);
                            }
                            
                            break;
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Login sequence failed for {username}, attempt {attempt}");
                    }
                }
                
                if (!accountSuccess)
                {
                    // فشل الحساب
                    Console.WriteLine($"Account {username} failed after {maxAttempts} attempts");
                    MessageBox.Show($"Account {username} failed. Please try again later.", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    
                    // إرسال حالة الفشل إلى السيرفر
                    if (!string.IsNullOrEmpty(toolRequestId))
                    {
                        SendAutomationStatusToServer(toolRequestId, username, password, false);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error occurred: {ex.Message}", "UnlockTool", MessageBoxButtons.OK, MessageBoxIcon.Error);
                
                // إرسال حالة الفشل إلى السيرفر في حالة الخطأ
                if (!string.IsNullOrEmpty(toolRequestId))
                {
                    SendAutomationStatusToServer(toolRequestId, username, password, false);
                }
            }
        }

        // دالة إرسال حالة الأوتوميشن إلى السيرفر
        private static void SendAutomationStatusToServer(string toolRequestId, string username, string password, bool success)
        {
            try
            {
                using (var client = new System.Net.Http.HttpClient())
                {
                    // الحصول على API URL من الإعدادات
                    string apiBaseUrl = GetApiBaseUrl();
                    client.BaseAddress = new Uri(apiBaseUrl);
                    client.DefaultRequestHeaders.Add("User-Agent", "TOOLY-GSM-Desktop/1.0");
                    
                    // إضافة التوكن إذا كان متوفراً
                    string token = GetStoredToken();
                    if (!string.IsNullOrEmpty(token))
                    {
                        client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                    }
                    
                    var requestData = new
                    {
                        toolRequestId = toolRequestId,
                        successfulAccount = new
                        {
                            username = username,
                            password = password,
                            email = username + "@example.com" // يمكن تعديل هذا حسب الحاجة
                        },
                        automationSuccess = success
                    };
                    
                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(requestData);
                    var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                    
                    var response = client.PostAsync("/api/tool-requests/update-automation-status", content).Result;
                    
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Automation status sent successfully: {success}");
                    }
                    else
                    {
                        Console.WriteLine($"Failed to send automation status: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending automation status: {ex.Message}");
            }
        }

        // دالة للحصول على API URL
        private static string GetApiBaseUrl()
        {
            // استخدام عنوان موقع TOOLY GSM
            try
            {
                // يمكن استيراد SecurityConfig أو استخدام نفس القيم
                return "https://eskuly.org"; // عنوان موقع TOOLY GSM
            }
            catch
            {
                return "https://eskuly.org"; // قيمة افتراضية
            }
        }

        // دالة للحصول على التوكن المحفوظ
        private static string GetStoredToken()
        {
            // يمكن الوصول للتوكن من Form1 أو SecurityConfig
            try
            {
                // هذا مثال - يجب تعديله حسب طريقة حفظ التوكن في تطبيقك
                return ""; // يجب استبدال هذا بالتوكن المحفوظ
            }
            catch
            {
                return "";
            }
        }

        private static bool PerformLoginSequence(AutomationElement window, bool handleDisclaimer, string enteredUsername, string enteredPassword)
        {
            try
            {
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
            bool focusFailed = false;
            try
            {
                try
                {
                    element.SetFocus();
                    Debug.WriteLine("SetFocus succeeded");
                }
                catch (Exception ex)
                {
                    focusFailed = true;
                    Debug.WriteLine($"SetFocus failed: {ex.Message}");
                }

                try
                {
                    if (element.TryGetCurrentPattern(ValuePattern.Pattern, out object valuePattern))
                    {
                        ((ValuePattern)valuePattern).SetValue(text);
                        Thread.Sleep(200);
                        string currentValue = ((ValuePattern)valuePattern).Current.Value;
                        if (currentValue == text)
                        {
                            Debug.WriteLine("ValuePattern succeeded");
                            return;
                        }
                        else
                        {
                            Debug.WriteLine($"ValuePattern failed: Value is '{currentValue}'");
                        }
                    }
                    else
                    {
                        Debug.WriteLine("ValuePattern not supported");
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"ValuePattern exception: {ex.Message}");
                }

                if (!focusFailed)
                {
                    try
                    {
                        element.SetFocus();
                        Thread.Sleep(200);
                        SendKeys.SendWait("^a");
                        Thread.Sleep(100);
                        SendKeys.SendWait("{DELETE}");
                        Thread.Sleep(100);
                        SendKeys.SendWait(text);
                        Thread.Sleep(200);
                        Debug.WriteLine("SendKeys succeeded");
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"SendKeys failed: {ex.Message}");
                    }
                }
                else
                {
                    Debug.WriteLine("SendKeys skipped due to SetFocus failure");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"SetTextValue general error: {ex.Message}");
            }
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
            bool focusFailed = false;
            try
            {
                try
                {
                    element.SetFocus();
                    Thread.Sleep(200);
                    Debug.WriteLine("SetFocus succeeded (ClickElement)");
                }
                catch (Exception ex)
                {
                    focusFailed = true;
                    Debug.WriteLine($"SetFocus failed (ClickElement): {ex.Message}");
                }

                if (!focusFailed)
                {
                    try
                    {
                        SendKeys.SendWait("{ENTER}");
                        Thread.Sleep(500);
                        element.SetFocus();
                        Thread.Sleep(200);
                        SendKeys.SendWait(" ");
                        Thread.Sleep(500);
                        Debug.WriteLine("SendKeys ENTER/SPACE succeeded");
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"SendKeys ENTER/SPACE failed: {ex.Message}");
                    }
                }
                else
                {
                    Debug.WriteLine("SendKeys ENTER/SPACE skipped due to SetFocus failure");
                }

                try
                {
                    if (element.TryGetCurrentPattern(InvokePattern.Pattern, out object invokePattern))
                    {
                        ((InvokePattern)invokePattern).Invoke();
                        Thread.Sleep(500);
                        Debug.WriteLine("InvokePattern succeeded");
                    }
                    else
                    {
                        Debug.WriteLine("InvokePattern not supported");
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"InvokePattern failed: {ex.Message}");
                }

                try
                {
                    System.Windows.Rect boundingRect = element.Current.BoundingRectangle;
                    int centerX = (int)(boundingRect.Left + (boundingRect.Width / 2));
                    int centerY = (int)(boundingRect.Top + (boundingRect.Height / 2));
                    SetCursorPos(centerX, centerY);
                    Thread.Sleep(100);
                    mouse_event(MOUSEEVENTF_LEFTDOWN, (uint)centerX, (uint)centerY, 0, 0);
                    Thread.Sleep(50);
                    mouse_event(MOUSEEVENTF_LEFTUP, (uint)centerX, (uint)centerY, 0, 0);
                    Thread.Sleep(500);
                    Debug.WriteLine("Mouse click succeeded");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Mouse click failed: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"ClickElement general error: {ex.Message}");
            }
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
