import tkinter as tk
from tkinter import ttk, messagebox
import requests
import json
from datetime import datetime
import threading
import os
import time
import winsound  # إضافة مكتبة الصوت للويندوز
import pyperclip  # إضافة مكتبة النسخ للحافظة
from typing import List, Dict, Any

class ToolRequestsViewer:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("TOOLY GSM - مشاهد طلبات الأدوات")
        self.root.geometry("1400x800")  # زيادة العرض لاستيعاب أزرار النسخ
        self.root.configure(bg="#1a1a1a")
        
        self.last_request_count = 0
        self.auto_refresh_enabled = True
        self.refresh_interval = 5  # 5 ثواني
        
        # ألوان التصميم المطابقة للموقع
        self.colors = {
            'bg_primary': '#1a1a1a',
            'bg_secondary': '#2d2d2d',
            'bg_card': '#3a3a3a',
            'orange': '#ff6b35',
            'orange_hover': '#e55a2b',
            'text_primary': '#ffffff',
            'text_secondary': '#cccccc',
            'border': '#4a4a4a'
        }
        
        self.supabase_url = 'https://ewkzduhofisinbhjrzzu.supabase.co'
        self.supabase_key = os.getenv('SUPABASE_API_KEY', 'your_supabase_api_key_here')
            
        self.setup_ui()
        self.load_requests()
        self.start_auto_refresh()
        
    def setup_ui(self):
        """إعداد واجهة المستخدم"""
        # إعداد الخطوط
        title_font = ('Arial', 16, 'bold')
        header_font = ('Arial', 12, 'bold')
        text_font = ('Arial', 10)
        
        # الهيدر
        header_frame = tk.Frame(self.root, bg=self.colors['orange'], height=80)
        header_frame.pack(fill='x', padx=0, pady=0)
        header_frame.pack_propagate(False)
        
        # لوجو وعنوان
        title_label = tk.Label(
            header_frame, 
            text="🔧 TOOLY GSM - مشاهد طلبات الأدوات",
            font=title_font,
            bg=self.colors['orange'],
            fg='white'
        )
        title_label.pack(expand=True)
        
        # شريط الأدوات
        toolbar_frame = tk.Frame(self.root, bg=self.colors['bg_secondary'], height=50)
        toolbar_frame.pack(fill='x', padx=10, pady=5)
        toolbar_frame.pack_propagate(False)
        
        # زر التحديث
        refresh_btn = tk.Button(
            toolbar_frame,
            text="🔄 تحديث البيانات",
            font=header_font,
            bg=self.colors['orange'],
            fg='white',
            activebackground=self.colors['orange_hover'],
            activeforeground='white',
            border=0,
            padx=20,
            pady=5,
            command=self.load_requests
        )
        refresh_btn.pack(side='left', padx=5)
        
        self.auto_refresh_btn = tk.Button(
            toolbar_frame,
            text="⏸️ إيقاف التحديث التلقائي",
            font=header_font,
            bg=self.colors['bg_card'],
            fg='white',
            activebackground=self.colors['orange_hover'],
            activeforeground='white',
            border=0,
            padx=20,
            pady=5,
            command=self.toggle_auto_refresh
        )
        self.auto_refresh_btn.pack(side='left', padx=5)
        
        # عداد الطلبات
        self.count_label = tk.Label(
            toolbar_frame,
            text="إجمالي الطلبات: 0",
            font=text_font,
            bg=self.colors['bg_secondary'],
            fg=self.colors['text_secondary']
        )
        self.count_label.pack(side='right', padx=10)
        
        self.refresh_indicator = tk.Label(
            toolbar_frame,
            text="🔄 التحديث التلقائي: مفعل",
            font=text_font,
            bg=self.colors['bg_secondary'],
            fg=self.colors['orange']
        )
        self.refresh_indicator.pack(side='right', padx=10)

        main_frame = tk.Frame(self.root, bg=self.colors['bg_primary'])
        main_frame.pack(fill='both', expand=True, padx=10, pady=5)

        # إعداد Treeview مع التكوين المبسط الذي يعمل
        columns = ('username', 'toolname', 'ultraid', 'password', 'license', 'requesttime', 'notes', 'id')
        
        self.tree = ttk.Treeview(
            main_frame,
            columns=columns,
            show='headings',
            height=20
        )
        
        # تكوين العناوين والأعمدة
        self.tree.heading('username', text='اسم المستخدم')
        self.tree.heading('toolname', text='اسم الأداة')
        self.tree.heading('ultraid', text='Ultra ID')
        self.tree.heading('password', text='كلمة المرور')
        self.tree.heading('license', text='رقم الترخيص')
        self.tree.heading('requesttime', text='تاريخ الطلب')
        self.tree.heading('notes', text='الملاحظات')
        self.tree.heading('id', text='')  # إخفاء العمود ID
        
        # تحديد عرض الأعمدة
        self.tree.column('username', width=120)
        self.tree.column('toolname', width=150)
        self.tree.column('ultraid', width=120)
        self.tree.column('password', width=100)
        self.tree.column('license', width=180)
        self.tree.column('requesttime', width=150)
        self.tree.column('notes', width=200)
        self.tree.column('id', width=0, stretch=tk.NO)  # إخفاء العمود ID
        
        # ربط حدث اختيار الصف
        self.tree.bind('<<TreeviewSelect>>', self.on_item_select)
        
        # شريط التمرير
        scrollbar = ttk.Scrollbar(main_frame, orient='vertical', command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        # ترتيب الجدول وشريط التمرير
        self.tree.pack(side='left', fill='both', expand=True)
        scrollbar.pack(side='right', fill='y')

        # إطار أزرار النسخ
        buttons_frame = tk.Frame(self.root, bg=self.colors['bg_secondary'], height=60)
        buttons_frame.pack(fill='x', padx=10, pady=5)
        buttons_frame.pack_propagate(False)

        copy_label = tk.Label(
            buttons_frame,
            text="نسخ البيانات المحددة:",
            font=header_font,
            bg=self.colors['bg_secondary'],
            fg=self.colors['text_primary']
        )
        copy_label.pack(side='left', padx=10, pady=10)

        self.copy_id_btn = tk.Button(
            buttons_frame,
            text="📋 نسخ Ultra ID",
            font=text_font,
            bg=self.colors['orange'],
            fg='white',
            activebackground=self.colors['orange_hover'],
            activeforeground='white',
            border=0,
            padx=15,
            pady=8,
            command=self.copy_selected_id
        )
        self.copy_id_btn.pack(side='left', padx=5, pady=10)

        self.copy_password_btn = tk.Button(
            buttons_frame,
            text="🔑 نسخ كلمة المرور",
            font=text_font,
            bg=self.colors['orange'],
            fg='white',
            activebackground=self.colors['orange_hover'],
            activeforeground='white',
            border=0,
            padx=15,
            pady=8,
            command=self.copy_selected_password
        )
        self.copy_password_btn.pack(side='left', padx=5, pady=10)

        self.copy_both_btn = tk.Button(
            buttons_frame,
            text="📄 نسخ الاثنين معاً",
            font=text_font,
            bg=self.colors['bg_card'],
            fg='white',
            activebackground=self.colors['orange_hover'],
            activeforeground='white',
            border=0,
            padx=15,
            pady=8,
            command=self.copy_selected_both
        )
        self.copy_both_btn.pack(side='left', padx=5, pady=10)
        
        # إطار الملاحظات
        notes_frame = tk.Frame(self.root, bg=self.colors['bg_secondary'], height=120)
        notes_frame.pack(fill='x', padx=10, pady=5)
        notes_frame.pack_propagate(False)
        
        notes_label = tk.Label(
            notes_frame,
            text="📝 إضافة ملاحظة للطلب المحدد:",
            font=header_font,
            bg=self.colors['bg_secondary'],
            fg=self.colors['text_primary']
        )
        notes_label.pack(anchor='w', padx=10, pady=(10, 5))
        
        notes_input_frame = tk.Frame(notes_frame, bg=self.colors['bg_secondary'])
        notes_input_frame.pack(fill='x', padx=10, pady=(0, 10))
        
        self.notes_text = tk.Text(
            notes_input_frame,
            height=3,
            font=text_font,
            bg=self.colors['bg_card'],
            fg=self.colors['text_primary'],
            insertbackground=self.colors['text_primary'],
            selectbackground=self.colors['orange'],
            selectforeground='white',
            wrap='word'
        )
        self.notes_text.pack(side='left', fill='both', expand=True)
        
        save_note_btn = tk.Button(
            notes_input_frame,
            text="💾 حفظ الملاحظة",
            font=header_font,
            bg=self.colors['orange'],
            fg='white',
            activebackground=self.colors['orange_hover'],
            activeforeground='white',
            border=0,
            padx=15,
            pady=10,
            command=self.save_note
        )
        save_note_btn.pack(side='right', padx=(10, 0), fill='y')
        
        # متغير لحفظ ID الطلب المحدد
        self.selected_request_id = None
        self.selected_row_data = None  # لحفظ بيانات الصف المحدد
        
        # شريط الحالة
        status_frame = tk.Frame(self.root, bg=self.colors['bg_secondary'], height=30)
        status_frame.pack(fill='x', side='bottom')
        status_frame.pack_propagate(False)
        
        self.status_label = tk.Label(
            status_frame,
            text="جاهز",
            font=text_font,
            bg=self.colors['bg_secondary'],
            fg=self.colors['text_secondary']
        )
        self.status_label.pack(side='left', padx=10, pady=5)

    # دالة لمعالجة اختيار الصف
    def on_item_select(self, event):
        """معالجة اختيار صف من الجدول"""
        selected_items = self.tree.selection()
        if selected_items:
            item = self.tree.item(selected_items[0])
            values = item['values']
            if len(values) >= 8:  # تأكد من وجود جميع الأعمدة بما في ذلك ID
                # عرض الملاحظة الحالية في حقل النص
                current_note = values[6] if values[6] != 'لا توجد ملاحظات' else ''
                self.notes_text.delete('1.0', tk.END)
                self.notes_text.insert('1.0', current_note)
                
                # حفظ ID الحقيقي من قاعدة البيانات (العمود الأخير المخفي)
                self.selected_request_id = values[7]  # ID من قاعدة البيانات
                self.selected_row_data = values  # حفظ بيانات الصف للاستعادة لاحقاً
                print(f"[DEBUG] Selected request DB ID: {self.selected_request_id}")

    # دالة حفظ الملاحظة
    def save_note(self):
        """حفظ الملاحظة للطلب المحدد"""
        if not self.selected_request_id:
            messagebox.showwarning("تحذير", "يرجى اختيار طلب من الجدول أولاً")
            return
        
        note_text = self.notes_text.get('1.0', tk.END).strip()
        
        # تشغيل الحفظ في thread منفصل
        thread = threading.Thread(target=self._save_note_to_db, args=(self.selected_request_id, note_text))
        thread.daemon = True
        thread.start()
    
    def _save_note_to_db(self, request_id, note_text):
        """حفظ الملاحظة في قاعدة البيانات"""
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            # استخدام ID الحقيقي من قاعدة البيانات
            url = f"{self.supabase_url}/rest/v1/tool_requests?id=eq.{request_id}"
            data = {'notes': note_text if note_text else None}
            
            print(f"[DEBUG] Saving note for request ID: {request_id}")
            print(f"[DEBUG] Note data: {data}")
            print(f"[DEBUG] Update URL: {url}")
            
            response = requests.patch(url, headers=headers, json=data)
            
            print(f"[DEBUG] Save response status: {response.status_code}")
            print(f"[DEBUG] Save response text: {response.text}")
            
            if response.status_code == 204:
                self.root.after(0, self._show_save_success)
                # إعادة تحميل البيانات لعرض التحديث مع الحفاظ على التحديد
                self.root.after(100, self.load_requests)
            else:
                error_msg = f"خطأ في حفظ الملاحظة: {response.status_code} - {response.text}"
                print(f"[DEBUG] Save error: {error_msg}")
                self.root.after(0, self._show_error, error_msg)
                
        except Exception as e:
            error_msg = f"خطأ في حفظ الملاحظة: {str(e)}"
            print(f"[DEBUG] Save exception: {error_msg}")
            self.root.after(0, self._show_error, error_msg)
    
    def _show_save_success(self):
        """عرض رسالة نجاح الحفظ"""
        self.status_label.config(text="تم حفظ الملاحظة بنجاح")
        messagebox.showinfo("تم الحفظ", "تم حفظ الملاحظة بنجاح")

    def copy_selected_id(self):
        """نسخ Ultra ID للصف المحدد"""
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showwarning("تحذير", "يرجى اختيار صف من الجدول أولاً")
            return
        
        item = self.tree.item(selected_item[0])
        ultra_id = item['values'][2]  # Ultra ID في العمود الثالث
        
        try:
            pyperclip.copy(ultra_id)
            self.status_label.config(text=f"تم نسخ Ultra ID: {ultra_id}")
            messagebox.showinfo("تم النسخ", f"تم نسخ Ultra ID:\n{ultra_id}")
        except Exception as e:
            messagebox.showerror("خطأ", f"فشل في نسخ البيانات: {str(e)}")

    def copy_selected_password(self):
        """نسخ كلمة المرور للصف المحدد"""
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showwarning("تحذير", "يرجى اختيار صف من الجدول أولاً")
            return
        
        item = self.tree.item(selected_item[0])
        password = item['values'][3]  # كلمة المرور في العمود الرابع
        
        try:
            pyperclip.copy(password)
            self.status_label.config(text=f"تم نسخ كلمة المرور: {password}")
            messagebox.showinfo("تم النسخ", f"تم نسخ كلمة المرور:\n{password}")
        except Exception as e:
            messagebox.showerror("خطأ", f"فشل في نسخ البيانات: {str(e)}")

    def copy_selected_both(self):
        """نسخ Ultra ID وكلمة المرور للصف المحدد"""
        selected_item = self.tree.selection()
        if not selected_item:
            messagebox.showwarning("تحذير", "يرجى اختيار صف من الجدول أولاً")
            return
        
        item = self.tree.item(selected_item[0])
        ultra_id = item['values'][2]  # Ultra ID في العمود الثالث
        password = item['values'][3]  # كلمة المرور في العمود الرابع
        
        combined_text = f"Ultra ID: {ultra_id}\nPassword: {password}"
        
        try:
            pyperclip.copy(combined_text)
            self.status_label.config(text="تم نسخ Ultra ID وكلمة المرور")
            messagebox.showinfo("تم النسخ", f"تم نسخ البيانات:\n{combined_text}")
        except Exception as e:
            messagebox.showerror("خطأ", f"فشل في نسخ البيانات: {str(e)}")
        
    def play_notification_sound(self):
        """تشغيل صوت الإشعار"""
        try:
            # تشغيل صوت النظام للإشعار
            winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
        except:
            # في حالة فشل تشغيل الصوت، طباعة رسالة
            print("🔔 طلب جديد وارد!")
        
    def load_requests(self):
        """تحميل الطلبات من قاعدة البيانات"""
        self.status_label.config(text="جاري تحميل الطلبات...")
        self.root.update()
        
        # تشغيل التحميل في thread منفصل لتجنب تجميد الواجهة
        thread = threading.Thread(target=self._fetch_requests)
        thread.daemon = True
        thread.start()
        
    def _fetch_requests(self):
        """جلب الطلبات من Supabase"""
        try:
            headers = {
                'apikey': self.supabase_key,
                'Authorization': f'Bearer {self.supabase_key}',
                'Content-Type': 'application/json'
            }
            
            # استعلام لجلب جميع طلبات الأدوات مع ID مرتبة حسب التاريخ
            url = f"{self.supabase_url}/rest/v1/tool_requests?select=id,user_name,tool_name,ultra_id,password,license_key,requested_at,notes&order=requested_at.desc"
            
            print(f"[DEBUG] Fetching from URL: {url}")
            
            response = requests.get(url, headers=headers)
            
            print(f"[DEBUG] Response status: {response.status_code}")
            print(f"[DEBUG] Response text: {response.text[:500]}")
            
            if response.status_code == 200:
                requests_data = response.json()
                print(f"[DEBUG] Found {len(requests_data)} requests")
                self.root.after(0, self._update_tree, requests_data)
            else:
                error_msg = f"خطأ في جلب البيانات: {response.status_code} - {response.text}"
                print(f"[DEBUG] Error: {error_msg}")
                self.root.after(0, self._show_error, error_msg)
                
        except Exception as e:
            error_msg = f"خطأ في الاتصال: {str(e)}"
            print(f"[DEBUG] Exception: {error_msg}")
            self.root.after(0, self._show_error, error_msg)
            
    def _update_tree(self, requests_data: List[Dict[str, Any]]):
        """تحديث عرض الطلبات"""
        print(f"[DEBUG] Updating tree with {len(requests_data)} requests")
        
        current_count = len(requests_data)
        if current_count > self.last_request_count and self.last_request_count > 0:
            # يوجد طلبات جديدة
            new_requests = current_count - self.last_request_count
            self.play_notification_sound()
            self.status_label.config(text=f"🔔 {new_requests} طلب جديد وارد!")
        
        self.last_request_count = current_count
        
        # حفظ التحديد الحالي
        selected_id = self.selected_request_id
        
        # مسح جميع العناصر الموجودة
        for item in self.tree.get_children():
            self.tree.delete(item)
            
        # إضافة البيانات الجديدة
        item_to_select = None
        for request in requests_data:
            # تنسيق التاريخ
            requested_at = request.get('requested_at', '')
            if requested_at:
                try:
                    dt = datetime.fromisoformat(requested_at.replace('Z', '+00:00'))
                    formatted_date = dt.strftime('%Y-%m-%d %H:%M')
                except:
                    formatted_date = requested_at[:16] if len(requested_at) > 16 else requested_at
            else:
                formatted_date = 'غير محدد'
            
            notes = request.get('notes', '') or 'لا توجد ملاحظات'
            request_id = request.get('id', '')
                
            # إدراج البيانات في الجدول (مع إخفاء عمود ID)
            item = self.tree.insert('', 'end', values=(
                request.get('user_name', 'غير محدد'),
                request.get('tool_name', 'غير محدد'),
                request.get('ultra_id', 'غير محدد'),
                request.get('password', 'غير محدد'),
                request.get('license_key', 'غير محدد'),
                formatted_date,
                notes,
                request_id  # إضافة ID كعمود مخفي
            ))
            
            # إذا كان هذا هو الصف المحدد سابقاً، احفظ مرجعه
            if selected_id and str(request_id) == str(selected_id):
                item_to_select = item
                
        # إعادة تحديد الصف إذا كان موجوداً
        if item_to_select:
            self.tree.selection_set(item_to_select)
            self.tree.focus(item_to_select)
            print(f"[DEBUG] Restored selection for ID: {selected_id}")
                
        # تحديث العداد
        count = len(requests_data)
        self.count_label.config(text=f"إجمالي الطلبات: {count}")
        
        current_time = datetime.now().strftime('%H:%M:%S')
        if current_count == self.last_request_count or self.last_request_count == 0:
            self.status_label.config(text=f"تم تحميل {count} طلب - آخر تحديث: {current_time}")

    def toggle_auto_refresh(self):
        """تشغيل أو إيقاف التحديث التلقائي"""
        self.auto_refresh_enabled = not self.auto_refresh_enabled
        if self.auto_refresh_enabled:
            self.auto_refresh_btn.config(text="⏸️ إيقاف التحديث التلقائي")
            self.refresh_indicator.config(text="🔄 التحديث التلقائي: مفعل", fg=self.colors['orange'])
            self.start_auto_refresh()
        else:
            self.auto_refresh_btn.config(text="▶️ تشغيل التحديث التلقائي")
            self.refresh_indicator.config(text="⏸️ التحديث التلقائي: متوقف", fg=self.colors['text_secondary'])
    
    def start_auto_refresh(self):
        """بدء التحديث التلقائي"""
        if self.auto_refresh_enabled:
            self.load_requests()
            # جدولة التحديث التالي
            self.root.after(self.refresh_interval * 1000, self.start_auto_refresh)
        
    def _show_error(self, error_msg: str):
        """عرض رسالة خطأ"""
        self.status_label.config(text=f"خطأ: {error_msg}")
        messagebox.showerror("خطأ", error_msg)
        
    def run(self):
        """تشغيل التطبيق"""
        self.root.mainloop()

def main():
    """الدالة الرئيسية"""
    try:
        app = ToolRequestsViewer()
        app.run()
    except Exception as e:
        messagebox.showerror("خطأ", f"خطأ في تشغيل التطبيق: {str(e)}")

if __name__ == "__main__":
    main()
