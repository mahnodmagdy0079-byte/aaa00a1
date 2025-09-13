using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace toolygsm1
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            // عرض نافذة تسجيل الدخول أولاً
            using (var loginForm = new LoginForm())
            {
                if (loginForm.ShowDialog() == DialogResult.OK)
                {
                    var userInfo = loginForm.Tag as Tuple<string, string, string, string>;
                    string userId = userInfo?.Item1 ?? "";
                    string fullName = userInfo?.Item2 ?? "User";
                    string email = userInfo?.Item3 ?? "";
                    string token = userInfo?.Item4 ?? "";
                    Application.Run(new Form1(userId, fullName, email, token));
                }
            }
        }
    }
}
