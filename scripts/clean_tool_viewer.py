import tkinter as tk
from tkinter import ttk, messagebox
import requests
import json
from datetime import datetime
import threading
import time
import pygame
import pyperclip

class ToolRequestsViewer:
    def __init__(self):
        # Database configuration
        self.supabase_url = "https://ewkzduhofisinbhjrzzu.supabase.co"
        self.supabase_key = os.getenv('SUPABASE_API_KEY', 'your_supabase_api_key_here')
        
        # Initialize pygame for sound
        pygame.mixer.init()
        
        # GUI setup
        self.root = tk.Tk()
        self.root.title("TOOLY GSM - مشاهد طلبات الأدوات")
        self.root.geometry("1400x800")
        self.root.configure(bg='#2d2d2d')
        
        # Variables
        self.auto_refresh = tk.BooleanVar(value=True)
        self.selected_request_id = None
        self.last_count = 0
        self.preserved_selection = None
        self.last_password_requests_data = []
        
        self.setup_gui()
        self.load_requests()
        self.start_auto_refresh()
        
    def setup_gui(self):
        # Header
        header_frame = tk.Frame(self.root, bg='#ff6b35', height=80)
        header_frame.pack(fill='x', padx=0, pady=0)
        header_frame.pack_propagate(False)
        
        header_label = tk.Label(header_frame, text="🔧 TOOLY GSM - مشاهد طلبات الأدوات", 
                               font=('Arial', 16, 'bold'), bg='#ff6b35', fg='white')
        header_label.pack(expand=True)
        
        # Control frame
        control_frame = tk.Frame(self.root, bg='#2d2d2d', height=50)
        control_frame.pack(fill='x', padx=10, pady=5)
        control_frame.pack_propagate(False)
        
        # Update button
        update_btn = tk.Button(control_frame, text="تحديث البيانات", command=self.load_requests,
                              bg='#ff6b35', fg='white', font=('Arial', 10, 'bold'),
                              relief='flat', padx=20, pady=5)
        update_btn.pack(side='left', padx=5)
        
        password_refresh_btn = tk.Button(control_frame, text="🔄 تحديث كلمات المرور", 
                                        command=self.check_password_updates,
                                        bg='#e74c3c', fg='white', font=('Arial', 10, 'bold'),
                                        relief='flat', padx=20, pady=5)
        password_refresh_btn.pack(side='left', padx=5)
        
        refresh_toggle = tk.Checkbutton(control_frame, text="إيقاف التحديث التلقائي", 
                                       variable=self.auto_refresh, bg='#2d2d2d', fg='white',
                                       font=('Arial', 10), selectcolor='#ff6b35')
        refresh_toggle.pack(side='left', padx=20)
        
        # Count label
        self.count_label = tk.Label(control_frame, text="إجمالي الطلبات: 0", 
                                   bg='#2d2d2d', fg='#ff6b35', font=('Arial', 12, 'bold'))
        self.count_label.pack(side='right', padx=10)
        
        # Main table frame
        table_frame = tk.Frame(self.root, bg='#2d2d2d')
        table_frame.pack(fill='both', expand=True, padx=10, pady=5)
        
        # Create treeview with scrollbars
        columns = ('user_name', 'tool_name', 'ultra_id', 'password', 'license_key', 'created_at', 'status', 'notes')
        self.tree = ttk.Treeview(table_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        self.tree.heading('user_name', text='اسم المستخدم')
        self.tree.heading('tool_name', text='اسم الأداة')
        self.tree.heading('ultra_id', text='Ultra ID')
        self.tree.heading('password', text='كلمة المرور')
        self.tree.heading('license_key', text='رقم الترخيص')
        self.tree.heading('created_at', text='تاريخ الطلب')
        self.tree.heading('status', text='الحالة')
        self.tree.heading('notes', text='الملاحظات')
        
        # Column widths
        self.tree.column('user_name', width=120)
        self.tree.column('tool_name', width=150)
        self.tree.column('ultra_id', width=100)
        self.tree.column('password', width=100)
        self.tree.column('license_key', width=180)
        self.tree.column('created_at', width=150)
        self.tree.column('status', width=100)
        self.tree.column('notes', width=150)
        
        # Scrollbars
        v_scrollbar = ttk.Scrollbar(table_frame, orient='vertical', command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(table_frame, orient='horizontal', command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Pack table and scrollbars
        self.tree.pack(side='left', fill='both', expand=True)
        v_scrollbar.pack(side='right', fill='y')
        h_scrollbar.pack(side='bottom', fill='x')
        
        # Bind selection event
        self.tree.bind('<<TreeviewSelect>>', self.on_item_select)
        
        # Status buttons frame
        status_frame = tk.Frame(self.root, bg='#2d2d2d', height=60)
        status_frame.pack(fill='x', padx=10, pady=5)
        status_frame.pack_propagate(False)
        
        status_label = tk.Label(status_frame, text="تغيير حالة الطلب المحدد:", 
                               bg='#2d2d2d', fg='white', font=('Arial', 12, 'bold'))
        status_label.pack(side='left', padx=10)
        
        pending_btn = tk.Button(status_frame, text="🔵 في الانتظار", command=lambda: self.change_status('pending'),
                               bg='#3498db', fg='white', font=('Arial', 10, 'bold'),
                               relief='flat', padx=15, pady=8)
        pending_btn.pack(side='left', padx=5)
        
        processing_btn = tk.Button(status_frame, text="🟠 قيد المعالجة", command=lambda: self.change_status('processing'),
                                  bg='#ff6b35', fg='white', font=('Arial', 10, 'bold'),
                                  relief='flat', padx=15, pady=8)
        processing_btn.pack(side='left', padx=5)
        
        done_btn = tk.Button(status_frame, text="🟢 مكتمل", command=lambda: self.change_status('done'),
                            bg='#27ae60', fg='white', font=('Arial', 10, 'bold'),
                            relief='flat', padx=15, pady=8)
        done_btn.pack(side='left', padx=5)
        
        password_change_btn = tk.Button(status_frame, text="🔑 طلب تغيير كلمة المرور", 
                                       command=self.request_password_change,
                                       bg='#e74c3c', fg='white', font=('Arial', 10, 'bold'),
                                       relief='flat', padx=15, pady=8)
        password_change_btn.pack(side='left', padx=5)
        
        # Copy buttons frame
        copy_frame = tk.Frame(self.root, bg='#2d2d2d', height=60)
        copy_frame.pack(fill='x', padx=10, pady=5)
        copy_frame.pack_propagate(False)
        
        copy_label = tk.Label(copy_frame, text="نسخ البيانات المحددة:", 
                             bg='#2d2d2d', fg='white', font=('Arial', 12, 'bold'))
        copy_label.pack(side='left', padx=10)
        
        copy_id_btn = tk.Button(copy_frame, text="📋 نسخ Ultra ID", command=self.copy_ultra_id,
                               bg='#ff6b35', fg='white', font=('Arial', 10, 'bold'),
                               relief='flat', padx=15, pady=8)
        copy_id_btn.pack(side='left', padx=5)
        
        copy_pass_btn = tk.Button(copy_frame, text="📋 نسخ كلمة المرور", command=self.copy_password,
                                 bg='#ff6b35', fg='white', font=('Arial', 10, 'bold'),
                                 relief='flat', padx=15, pady=8)
        copy_pass_btn.pack(side='left', padx=5)
        
        copy_both_btn = tk.Button(copy_frame, text="📋 نسخ الاثنين معاً", command=self.copy_both,
                                 bg='#ff6b35', fg='white', font=('Arial', 10, 'bold'),
                                 relief='flat', padx=15, pady=8)
        copy_both_btn.pack(side='left', padx=5)
        
        # Notes frame
        notes_frame = tk.Frame(self.root, bg='#2d2d2d', height=80)
        notes_frame.pack(fill='x', padx=10, pady=5)
        notes_frame.pack_propagate(False)
        
        notes_label = tk.Label(notes_frame, text="📝 إضافة ملاحظة للطلب المحدد:", 
                              bg='#2d2d2d', fg='white', font=('Arial', 12, 'bold'))
        notes_label.pack(anchor='w', padx=10, pady=5)
        
        notes_input_frame = tk.Frame(notes_frame, bg='#2d2d2d')
        notes_input_frame.pack(fill='x', padx=10)
        
        self.notes_entry = tk.Text(notes_input_frame, height=2, font=('Arial', 10),
                                  bg='#404040', fg='white', insertbackground='white')
        self.notes_entry.pack(side='left', fill='both', expand=True, padx=(0, 10))
        
        save_note_btn = tk.Button(notes_input_frame, text="💾 حفظ الملاحظة", command=self.save_note,
                                 bg='#ff6b35', fg='white', font=('Arial', 10, 'bold'),
                                 relief='flat', padx=20, pady=10)
        save_note_btn.pack(side='right')
        
        # Status bar
        self.status_bar = tk.Label(self.root, text="جاري التحميل...", 
                                  bg='#404040', fg='white', font=('Arial', 9),
                                  anchor='w', padx=10)
        self.status_bar.pack(fill='x', side='bottom')
        
    def load_requests(self):
        try:
            # Preserve current selection
            if self.tree.selection():
                selected_item = self.tree.selection()[0]
                selected_values = self.tree.item(selected_item)['values']
                if len(selected_values) > 0:
                    self.preserved_selection = selected_values[2]  # Ultra ID
            
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            url = f"{self.supabase_url}/rest/v1/tool_requests?select=id,user_name,tool_name,ultra_id,password,license_key,created_at,status,notes&order=created_at.desc"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                self.update_tree(data)
                
                # Check for new requests
                if len(data) > self.last_count:
                    self.play_notification_sound()
                self.last_count = len(data)
                
                self.count_label.config(text=f"إجمالي الطلبات: {len(data)}")
                self.status_bar.config(text=f"تم تحميل {len(data)} طلب - آخر تحديث: {datetime.now().strftime('%H:%M:%S')}")
                
                self.check_password_updates()
            else:
                self.status_bar.config(text=f"خطأ في تحميل البيانات: {response.status_code}")
                
        except Exception as e:
            self.status_bar.config(text=f"خطأ: {str(e)}")
            
    def update_tree(self, data):
        # Clear existing items
        for item in self.tree.get_children():
            self.tree.delete(item)
            
        # Add new items
        for request in data:
            # Format status with emoji
            status_text = request.get('status', 'pending')
            if status_text == 'pending':
                status_display = "🔵 في الانتظار"
            elif status_text == 'processing':
                status_display = "🟠 قيد المعالجة"
            elif status_text == 'done':
                status_display = "🟢 مكتمل"
            else:
                status_display = "🔵 في الانتظار"
                
            # Format date
            created_at = request.get('created_at', '')
            if created_at:
                try:
                    dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    formatted_date = dt.strftime('%Y-%m-%d %H:%M')
                except:
                    formatted_date = created_at
            else:
                formatted_date = ''
                
            values = (
                request.get('user_name', ''),
                request.get('tool_name', ''),
                request.get('ultra_id', ''),
                request.get('password', ''),
                request.get('license_key', ''),
                formatted_date,
                status_display,
                request.get('notes', '') or 'بلا',
                request.get('id', '')  # Hidden ID column
            )
            
            item_id = self.tree.insert('', 'end', values=values)
            
            # Restore selection if preserved
            if self.preserved_selection and request.get('ultra_id') == self.preserved_selection:
                self.tree.selection_set(item_id)
                self.tree.focus(item_id)
                
        # Clear preserved selection after use
        self.preserved_selection = None
        
    def on_item_select(self, event):
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            values = self.tree.item(item)['values']
            if len(values) > 8:
                self.selected_request_id = values[8]  # Hidden ID
                # Load existing note
                notes = values[7] if values[7] != 'بلا' else ''
                self.notes_entry.delete('1.0', tk.END)
                self.notes_entry.insert('1.0', notes)
            else:
                self.selected_request_id = None
                
    def change_status(self, new_status):
        if not self.selected_request_id:
            messagebox.showwarning("تحذير", "يرجى تحديد طلب أولاً")
            return
            
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            url = f"{self.supabase_url}/rest/v1/tool_requests?id=eq.{self.selected_request_id}"
            data = {'status': new_status}
            
            response = requests.patch(url, headers=headers, json=data)
            
            if response.status_code == 204:
                messagebox.showinfo("نجح", "تم تحديث حالة الطلب بنجاح")
                self.load_requests()  # Refresh data
            else:
                messagebox.showerror("خطأ", f"فشل في تحديث الحالة: {response.status_code}")
                
        except Exception as e:
            messagebox.showerror("خطأ", f"حدث خطأ: {str(e)}")
            
    def save_note(self):
        if not self.selected_request_id:
            messagebox.showwarning("تحذير", "يرجى تحديد طلب أولاً")
            return
            
        note_text = self.notes_entry.get('1.0', tk.END).strip()
        
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            url = f"{self.supabase_url}/rest/v1/tool_requests?id=eq.{self.selected_request_id}"
            data = {'notes': note_text}
            
            response = requests.patch(url, headers=headers, json=data)
            
            if response.status_code == 204:
                messagebox.showinfo("نجح", "تم حفظ الملاحظة بنجاح")
                self.load_requests()  # Refresh data
            else:
                messagebox.showerror("خطأ", f"فشل في حفظ الملاحظة: {response.status_code}")
                
        except Exception as e:
            messagebox.showerror("خطأ", f"حدث خطأ: {str(e)}")
            
    def copy_ultra_id(self):
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            values = self.tree.item(item)['values']
            if len(values) > 2:
                pyperclip.copy(values[2])
                messagebox.showinfo("تم النسخ", "تم نسخ Ultra ID إلى الحافظة")
        else:
            messagebox.showwarning("تحذير", "يرجى تحديد طلب أولاً")
            
    def copy_password(self):
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            values = self.tree.item(item)['values']
            if len(values) > 3:
                pyperclip.copy(values[3])
                messagebox.showinfo("تم النسخ", "تم نسخ كلمة المرور إلى الحافظة")
        else:
            messagebox.showwarning("تحذير", "يرجى تحديد طلب أولاً")
            
    def copy_both(self):
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            values = self.tree.item(item)['values']
            if len(values) > 3:
                both_text = f"Ultra ID: {values[2]}\nPassword: {values[3]}"
                pyperclip.copy(both_text)
                messagebox.showinfo("تم النسخ", "تم نسخ Ultra ID وكلمة المرور إلى الحافظة")
        else:
            messagebox.showwarning("تحذير", "يرجى تحديد طلب أولاً")
            
    def play_notification_sound(self):
        try:
            # Create a simple beep sound
            pygame.mixer.Sound.play(pygame.mixer.Sound(buffer=b'\x00\x01' * 1000))
        except:
            # Fallback to system beep
            print('\a')
            
    def start_auto_refresh(self):
        def refresh_loop():
            while True:
                time.sleep(2)
                if self.auto_refresh.get():
                    try:
                        self.root.after(0, self.load_requests)
                    except:
                        break
                        
        refresh_thread = threading.Thread(target=refresh_loop, daemon=True)
        refresh_thread.start()
        
    def request_password_change(self):
        if not self.selected_request_id:
            messagebox.showwarning("تحذير", "يرجى تحديد طلب أولاً")
            return
            
        selection = self.tree.selection()
        if not selection:
            return
            
        item = selection[0]
        values = self.tree.item(item)['values']
        
        if len(values) < 8:
            messagebox.showerror("خطأ", "بيانات الطلب غير مكتملة")
            return
            
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            # Create password change request
            password_change_data = {
                'original_request_id': self.selected_request_id,
                'user_name': values[0],
                'tool_name': values[1], 
                'ultra_id': values[2],
                'license_key': values[4],
                'old_password': values[3],
                'reason': 'كلمة المرور القديمة لا تعمل',
                'status': 'pending'
            }
            
            url = f"{self.supabase_url}/rest/v1/password_change_requests"
            response = requests.post(url, headers=headers, json=password_change_data)
            
            if response.status_code == 201:
                messagebox.showinfo("نجح", "تم إرسال طلب تغيير كلمة المرور للمستخدم بنجاح")
            else:
                messagebox.showerror("خطأ", f"فشل في إرسال طلب تغيير كلمة المرور: {response.status_code}")
                
        except Exception as e:
            messagebox.showerror("خطأ", f"حدث خطأ: {str(e)}")
        
    def check_password_updates(self):
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            url = f"{self.supabase_url}/rest/v1/password_change_requests?select=*&status=eq.completed&order=updated_at.desc"
            response = requests.get(url, headers=headers)
            
            if response.status_code == 200:
                password_requests = response.json()
                
                if len(password_requests) != len(self.last_password_requests_data):
                    print(f"[DEBUG] Found {len(password_requests)} completed password changes")
                    
                    for req in password_requests:
                        if req.get('new_password') and req.get('original_request_id'):
                            self.update_password_in_original_request(
                                req['original_request_id'], 
                                req['new_password']
                            )
                    
                    self.last_password_requests_data = password_requests
                    self.load_requests()
                    
        except Exception as e:
            print(f"[DEBUG] Error checking password updates: {str(e)}")
    
    def update_password_in_original_request(self, request_id, new_password):
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            url = f"{self.supabase_url}/rest/v1/tool_requests?id=eq.{request_id}"
            data = {'password': new_password}
            
            response = requests.patch(url, headers=headers, json=data)
            
            if response.status_code == 204:
                print(f"[DEBUG] Updated password for request {request_id}")
            else:
                print(f"[DEBUG] Failed to update password: {response.status_code}")
                
        except Exception as e:
            print(f"[DEBUG] Error updating password: {str(e)}")
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = ToolRequestsViewer()
    app.run()
