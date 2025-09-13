import tkinter as tk
from tkinter import ttk, messagebox
import requests
import json
from datetime import datetime

class SimpleToolViewer:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("TOOLY GSM - مشاهد طلبات الأدوات")
        self.root.geometry("1200x700")
        self.root.configure(bg='#1a1a1a')
        
        # Database connection
        self.supabase_url = "https://ewkzduhofisinbhjrzzu.supabase.co"
        self.supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a3pkdWhvZmlzaW5iaGpyenp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzE3OTYsImV4cCI6MjA3MTMwNzc5Nn0.k_xa-C5jYCiCQ3KK6Xj4hyyfLIR1uWXeOZ0RQB8KUwI"
        
        self.setup_ui()
        self.load_data()
        
    def setup_ui(self):
        # Header
        header_frame = tk.Frame(self.root, bg='#ff6b35', height=80)
        header_frame.pack(fill='x', padx=10, pady=5)
        header_frame.pack_propagate(False)
        
        title_label = tk.Label(header_frame, text="🔧 TOOLY GSM - مشاهد طلبات الأدوات", 
                              font=('Arial', 16, 'bold'), bg='#ff6b35', fg='white')
        title_label.pack(expand=True)
        
        # Control frame
        control_frame = tk.Frame(self.root, bg='#2d2d2d', height=50)
        control_frame.pack(fill='x', padx=10, pady=5)
        control_frame.pack_propagate(False)
        
        refresh_btn = tk.Button(control_frame, text="تحديث البيانات", 
                               command=self.load_data, bg='#ff6b35', fg='white',
                               font=('Arial', 10, 'bold'))
        refresh_btn.pack(side='left', padx=10, pady=10)
        
        self.count_label = tk.Label(control_frame, text="إجمالي الطلبات: 0", 
                                   font=('Arial', 12), bg='#2d2d2d', fg='white')
        self.count_label.pack(side='right', padx=10, pady=10)
        
        # Table frame
        table_frame = tk.Frame(self.root, bg='#1a1a1a')
        table_frame.pack(fill='both', expand=True, padx=10, pady=5)
        
        # Create Treeview with simple configuration
        columns = ('name', 'tool', 'ultra_id', 'password', 'license', 'date')
        self.tree = ttk.Treeview(table_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        self.tree.heading('name', text='اسم المستخدم')
        self.tree.heading('tool', text='اسم الأداة')
        self.tree.heading('ultra_id', text='Ultra ID')
        self.tree.heading('password', text='كلمة المرور')
        self.tree.heading('license', text='رقم الترخيص')
        self.tree.heading('date', text='تاريخ الطلب')
        
        # Set column widths
        self.tree.column('name', width=150)
        self.tree.column('tool', width=200)
        self.tree.column('ultra_id', width=150)
        self.tree.column('password', width=150)
        self.tree.column('license', width=200)
        self.tree.column('date', width=150)
        
        # Add scrollbars
        v_scrollbar = ttk.Scrollbar(table_frame, orient='vertical', command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(table_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Pack everything
        self.tree.pack(side='left', fill='both', expand=True)
        v_scrollbar.pack(side='right', fill='y')
        h_scrollbar.pack(side='bottom', fill='x')
        
        # Status bar
        self.status_label = tk.Label(self.root, text="جاري التحميل...", 
                                    font=('Arial', 10), bg='#2d2d2d', fg='white')
        self.status_label.pack(fill='x', padx=10, pady=5)
        
    def load_data(self):
        try:
            print("بدء تحميل البيانات...")
            self.status_label.config(text="جاري تحميل البيانات...")
            self.root.update()
            
            # Clear existing data
            for item in self.tree.get_children():
                self.tree.delete(item)
            
            # Fetch data from Supabase
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            url = f"{self.supabase_url}/rest/v1/tool_requests?select=*"
            response = requests.get(url, headers=headers)
            
            print(f"استجابة الخادم: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"تم جلب {len(data)} طلب")
                
                # Insert data into tree
                for i, request in enumerate(data):
                    try:
                        # Format date
                        created_at = request.get('created_at', '')
                        if created_at:
                            date_obj = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                            formatted_date = date_obj.strftime('%Y-%m-%d %H:%M')
                        else:
                            formatted_date = 'غير محدد'
                        
                        # Prepare values
                        values = (
                            request.get('user_name', 'غير محدد'),
                            request.get('tool_name', 'غير محدد'),
                            request.get('ultra_id', 'غير محدد'),
                            request.get('password', 'غير محدد'),
                            request.get('license_key', 'غير محدد'),
                            formatted_date
                        )
                        
                        # Insert into tree
                        item_id = self.tree.insert('', 'end', values=values)
                        print(f"تم إدراج الطلب {i+1}: {item_id}")
                        
                    except Exception as e:
                        print(f"خطأ في إدراج الطلب {i+1}: {e}")
                        continue
                
                # Update UI
                self.count_label.config(text=f"إجمالي الطلبات: {len(data)}")
                self.status_label.config(text=f"تم تحميل {len(data)} طلب - آخر تحديث: {datetime.now().strftime('%H:%M:%S')}")
                
                print("تم الانتهاء من تحميل البيانات")
                
            else:
                error_msg = f"خطأ في جلب البيانات: {response.status_code}"
                print(error_msg)
                self.status_label.config(text=error_msg)
                messagebox.showerror("خطأ", error_msg)
                
        except Exception as e:
            error_msg = f"خطأ في الاتصال: {str(e)}"
            print(error_msg)
            self.status_label.config(text=error_msg)
            messagebox.showerror("خطأ", error_msg)
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = SimpleToolViewer()
    app.run()
