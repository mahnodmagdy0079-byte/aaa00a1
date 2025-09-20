using System;

namespace ToolyGsm
{
    #region Data Classes

    public class User
    {
        public string id { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string full_name { get; set; } = string.Empty;
        public string phone { get; set; } = string.Empty;
        public DateTime created_at { get; set; }
        public string access_token { get; set; } = string.Empty;
    }

    public class License
    {
        public string id { get; set; } = string.Empty;
        public string license_key { get; set; } = string.Empty;
        public string package_name { get; set; } = string.Empty;
        public string package_price { get; set; } = string.Empty;
        public DateTime start_date { get; set; }
        public DateTime end_date { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string user_name { get; set; } = string.Empty;
        public string phone_number { get; set; } = string.Empty;
        public string user_email { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty;
    }

    public class ToolRequest
    {
        public string id { get; set; } = string.Empty;
        public string user_email { get; set; } = string.Empty;
        public string user_name { get; set; } = string.Empty;
        public string tool_name { get; set; } = string.Empty;
        public string ultra_id { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public DateTime requested_at { get; set; }
        public string license_key { get; set; } = string.Empty;
        public DateTime created_at { get; set; }
        public string notes { get; set; } = string.Empty;
        public string status { get; set; } = string.Empty;
        public string status_ar { get; set; } = string.Empty;
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        public decimal price { get; set; }
        public int duration_hours { get; set; }
        public string purchase_type { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty;
        public string shared_email { get; set; } = string.Empty;
        public bool is_subscription_based { get; set; }
        public string wallet_transaction_id { get; set; } = string.Empty;
        public int remaining_seconds { get; set; }
        public string current_status { get; set; } = string.Empty;
    }

    public class ToolAccount
    {
        public string id { get; set; } = string.Empty;
        public string tool_name { get; set; } = string.Empty;
        public string account_username { get; set; } = string.Empty;
        public string account_password { get; set; } = string.Empty;
        public bool is_available { get; set; }
        public string assigned_to_user { get; set; } = string.Empty;
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }

    public class UserWallet
    {
        public string id { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty;
        public string user_email { get; set; } = string.Empty;
        public decimal balance { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }

    public class Tool
    {
        public string id { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public decimal price { get; set; }
        public int duration_hours { get; set; }
        public string description { get; set; } = string.Empty;
        public string image_url { get; set; } = string.Empty;
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
    }

    #endregion

    public static class TableNames
    {
        public const string Users = "users";
        public const string Licenses = "licenses";
        public const string ToolRequests = "tool_requests";
        public const string ToolAccounts = "tool_accounts";
        public const string UserWallets = "user_wallets";
        public const string Tools = "tools";
        public const string PurchaseRequests = "purchase_requests";
    }

    // تم إزالة SupabaseConfig - البرنامج يستخدم API endpoints فقط
}
