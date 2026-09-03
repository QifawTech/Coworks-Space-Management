from flask import Blueprint, jsonify, request
from db import get_db_connection, encrypt_data, decrypt_data
import csv
import io
from datetime import date

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/api/workspaces', methods=['POST'])
def add_workspace():
    try:
        data = request.json
        name = data.get('name')
        location = data.get('location')
        total_seats = data.get('totalSeats')
        seats = data.get('seats')
        meetings = data.get('meetings')
        admin_username = data.get('admin_username') 
        
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO workspaces (name, location, total_seats, seats, meetings, admin_username) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (name, location, str(total_seats), seats, meetings, admin_username))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Workspace saved to database successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/workspaces', methods=['GET'])
def get_workspaces():
    try:
        admin_username = request.args.get('admin_username')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if admin_username:
            cursor.execute("SELECT * FROM workspaces WHERE admin_username = %s ORDER BY id DESC", (admin_username,))
        else:
            cursor.execute("SELECT * FROM workspaces ORDER BY id DESC")
            
        workspaces = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "workspaces": workspaces}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/workspaces/<int:ws_id>', methods=['PUT'])
def update_workspace(ws_id):
    try:
        data = request.json
        name = data.get('name')
        location = data.get('location')
        total_seats = data.get('totalSeats')
        seats = data.get('seats')
        meetings = data.get('meetings')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "UPDATE workspaces SET name = %s, location = %s, total_seats = %s, seats = %s, meetings = %s WHERE id = %s"
        cursor.execute(query, (name, location, str(total_seats), seats, meetings, ws_id))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Workspace updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/workspaces/<int:ws_id>', methods=['DELETE'])
def delete_workspace(ws_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM workspaces WHERE id = %s", (ws_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Workspace deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/api/employees', methods=['POST'])
def add_employee():
    try:
        data = request.json
        emp_id = data.get('empId')
        name = data.get('name')
        role = data.get('role')
        workspace = data.get('workspace')
        email = data.get('email')
        admin_username = data.get('admin_username')
        
        # 🌟 இந்த இரண்டு வரிகள் சரியாக உள்ளதா எனப் பார்க்கவும்
        join_date = data.get('join_date') or None
        end_date = data.get('end_date') or None
        
        phone = encrypt_data(data.get('phone'))
        address = encrypt_data(data.get('address'))
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 🌟 SQL குரிலும் join_date, end_date இருக்க வேண்டும்
        query = """
            INSERT INTO employees 
            (emp_id, name, role, workspace, email, phone, address, admin_username, join_date, end_date) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (emp_id, name, role, workspace, email, phone, address, admin_username, join_date, end_date))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Employee added successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/api/employees', methods=['GET'])
def get_employees():
    try:
        admin_username = request.args.get('admin_username')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if admin_username:
            cursor.execute("SELECT * FROM employees WHERE admin_username = %s ORDER BY id DESC", (admin_username,))
        else:
            cursor.execute("SELECT * FROM employees ORDER BY id DESC")
            
        employees = cursor.fetchall()
        for emp in employees:
            emp['phone'] = decrypt_data(emp['phone'])
            emp['address'] = decrypt_data(emp['address'])
            
            # 🌟 Join Date மற்றும் End Date-ஐ சரியாக ஸ்ட்ரிங் ஃபார்மட்டுக்கு மாற்றுவது
            if emp.get('join_date'):
                emp['join_date'] = emp['join_date'].strftime('%Y-%m-%d') if hasattr(emp['join_date'], 'strftime') else str(emp['join_date'])
            else:
                emp['join_date'] = ''
                
            if emp.get('end_date'):
                emp['end_date'] = emp['end_date'].strftime('%Y-%m-%d') if hasattr(emp['end_date'], 'strftime') else str(emp['end_date'])
            else:
                emp['end_date'] = ''
            
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "employees": employees}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@admin_bp.route('/api/employees/<int:emp_id>', methods=['PUT'])
def update_employee(emp_id):
    try:
        data = request.json
        e_id = data.get('empId')
        name = data.get('name')
        role = data.get('role')
        workspace = data.get('workspace')
        email = data.get('email')
        
        # 🌟 1. Join Date மற்றும் End Date டேட்டாவை வாங்குவது
        join_date = data.get('join_date') or None
        end_date = data.get('end_date') or None
        
        # உங்கள் கோடில் encrypt_data பயன்படுத்தப்பட்டிருந்தால் அதைப் பயன்படுத்தலாம் அல்லது அப்படியே அனுப்பலாம்
        phone = data.get('phone') 
        address = data.get('address')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # 🌟 2. SQL Query-ல் join_date மற்றும் end_date சேர்த்து Update செய்வது
        query = """
            UPDATE employees 
            SET emp_id = %s, name = %s, role = %s, workspace = %s, email = %s, phone = %s, address = %s, join_date = %s, end_date = %s 
            WHERE id = %s
        """
        cursor.execute(query, (e_id, name, role, workspace, email, phone, address, join_date, end_date, emp_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Employee updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/employees/<int:emp_id>', methods=['DELETE'])
def delete_employee(emp_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM employees WHERE id = %s", (emp_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Employee deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 🌟 அனைத்து டெனன்ட்களின் மொத்த ஆர்டர் தொகையைத் தனித்தனியாகக் கணக்கிட்டு அனுப்பும் புதிய ரவுட்
@admin_bp.route('/api/admin/all-tenant-orders', methods=['GET'])
def get_all_tenant_orders():
    conn = None
    cursor = None
    try:
        admin_username = request.args.get('admin_username')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if admin_username:
            query = """
                SELECT tenant_name, SUM(total_amount) as total_amount 
                FROM tenant_orders 
                WHERE admin_username = %s 
                GROUP BY tenant_name
            """
            cursor.execute(query, (admin_username,))
        else:
            query = """
                SELECT tenant_name, SUM(total_amount) as total_amount 
                FROM tenant_orders 
                GROUP BY tenant_name
            """
            cursor.execute(query)
            
        orders = cursor.fetchall()
        return jsonify({"status": "success", "orders": orders}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@admin_bp.route('/api/admin/tenant-orders', methods=['GET'])
def get_admin_tenant_orders():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    tenant_name = request.args.get('tenant_name')
    
    try:
        cursor.execute("""
            SELECT * FROM tenant_orders 
            WHERE tenant_name = %s 
            ORDER BY order_date DESC
        """, (tenant_name,))
        orders = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "orders": orders}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/monthly-invoices', methods=['GET'])
def get_monthly_invoices():
    conn = None
    cursor = None
    try:
        selected_month = request.args.get('month', '2026-09') # எ.கா: 2026-09 (Sept 2026)
        admin_username = request.args.get('admin_username', '')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # குறிப்பிட்ட மாதத்திற்கான இன்வாய்ஸ்களை மட்டும் எடுத்தல்
        cursor.execute("""
            SELECT * FROM tenant_invoices 
            WHERE billing_month = %s
        """, (selected_month,))
        invoices = cursor.fetchall()
        
        return jsonify({"success": True, "invoices": invoices}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@admin_bp.route('/api/admin/send-invoice', methods=['POST'])
def admin_send_invoice():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    
    tenant_name = data.get('tenant_name')
    billing_month = data.get('billing_month')
    total_amount = data.get('total_amount')
    admin_username = data.get('admin_username')
    
    try:
        if not admin_username:
            cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
            t_rec = cursor.fetchone()
            admin_username = t_rec['admin_username'] if t_rec and t_rec['admin_username'] else 'admin'
        
        due_date = f"{billing_month}-05"
        
        cursor.execute("""
            SELECT id FROM tenant_invoices 
            WHERE tenant_name = %s AND billing_month = %s
        """, (tenant_name, billing_month))
        existing = cursor.fetchone()
        
        if existing:
            cursor.execute("""
                UPDATE tenant_invoices 
                SET total_amount = %s, due_date = %s, status = 'Pending'
                WHERE id = %s
            """, (total_amount, due_date, existing['id']))
        else:
            cursor.execute("""
                INSERT INTO tenant_invoices (tenant_name, admin_username, billing_month, total_amount, due_date, status)
                VALUES (%s, %s, %s, %s, %s, 'Pending')
            """, (tenant_name, admin_username, billing_month, total_amount, due_date))
            
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Invoice sent successfully without duplicates!"}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/sent-invoices', methods=['GET'])
def get_admin_sent_invoices():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    admin_username = request.args.get('admin_username')
    
    try:
        if admin_username:
            cursor.execute("""
                SELECT * FROM tenant_invoices 
                WHERE admin_username = %s 
                ORDER BY id DESC
            """, (admin_username,))
        else:
            cursor.execute("SELECT * FROM tenant_invoices ORDER BY id DESC")
            
        invoices = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "invoices": invoices}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500


@admin_bp.route('/api/admin/mark-paid', methods=['POST'])
def mark_invoice_paid():
    conn = None
    cursor = None
    try:
        data = request.json
        tenant_name = data.get('tenant_name')
        billing_month = data.get('billing_month', '2026-08')
        status = data.get('status', 'Paid')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # டேட்டாபேஸில் ஏற்கனவே இன்வாய்ஸ் உள்ளதா எனப் பார்த்து அப்டேட் செய்யவும் அல்லது இன்செர்ட் செய்யவும்
        cursor.execute("""
            SELECT id FROM tenant_invoices 
            WHERE tenant_name = %s AND billing_month = %s
        """, (tenant_name, billing_month))
        existing = cursor.fetchone()
        
        if existing:
            cursor.execute("""
                UPDATE tenant_invoices 
                SET status = %s 
                WHERE id = %s
            """, (status, existing['id']))
        else:
            cursor.execute("""
                INSERT INTO tenant_invoices (tenant_name, billing_month, status, total_amount)
                VALUES (%s, %s, %s, 0)
            """, (tenant_name, billing_month, status))
            
        conn.commit()
        return jsonify({"status": "success", "message": f"Status updated to {status}!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@admin_bp.route('/api/admin/profile', methods=['GET'])
def get_admin_profile():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    admin_username = request.args.get('admin_username')
    
    try:
        cursor.execute("SELECT username, company_name, name FROM admins WHERE username = %s", (admin_username,))
        admin = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if admin:
            return jsonify({"status": "success", "profile": admin}), 200
        else:
            return jsonify({"status": "error", "message": "Admin not found"}), 404
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/send-notice', methods=['POST'])
def send_admin_notice():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        data = request.json
        notice_type = data.get('notice_type')
        recipient = data.get('recipient', 'All').strip()
        message = data.get('message')

        # 🌟 டூப்ளிகேட் என்ட்ரி (Double submit) ஆவதைத் தடுக்க சில நொடிகளுக்கு முன்பு அனுப்பியதே என செக் செய்தல்
        cursor.execute("""
            SELECT id FROM notices 
            WHERE notice_type = %s AND recipient = %s AND message = %s 
            ORDER BY id DESC LIMIT 1
        """, (notice_type, recipient, message))
        last_notice = cursor.fetchone()

        if last_notice:
            # ஒருவேளை ஏற்கனவே டேட்டாபேஸில் இருந்ததால் மீண்டும் இன்செர்ட் செய்யாமல் தடுத்து வெற்றிகரமாக அனுப்பப்பட்டதாகக் கூறலாம்
            return jsonify({"success": True, "message": "Notice already sent!"}), 201

        cursor.execute("""
            INSERT INTO notices (notice_type, recipient, message)
            VALUES (%s, %s, %s)
        """, (notice_type, recipient, message))

        conn.commit()
        return jsonify({"success": True, "message": "Notice saved successfully!"}), 201

    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@admin_bp.route('/api/admin/notices-logs', methods=['GET'])
def get_admin_notices_logs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT id, notice_type, recipient, message, date_sent as date 
            FROM notices 
            ORDER BY id DESC
        """)
        notices = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "notices": notices}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"success": False, "message": str(e)}), 500

@admin_bp.route('/api/admin/complaints', methods=['GET'])
def get_admin_complaints():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    admin_username = request.args.get('admin_username')
    
    try:
        if admin_username:
            cursor.execute("""
                SELECT * FROM complaints 
                WHERE admin_username = %s 
                ORDER BY id DESC
            """, (admin_username,))
        else:
            cursor.execute("SELECT * FROM complaints ORDER BY id DESC")
            
        complaints = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "complaints": complaints}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/complaints/<int:comp_id>/status', methods=['PUT'])
def update_complaint_status(comp_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    new_status = data.get('status', 'Solved')
    
    try:
        cursor.execute("""
            UPDATE complaints 
            SET status = %s 
            WHERE id = %s
        """, (new_status, comp_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": f"Complaint status updated to {new_status}!"}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/all-notifications', methods=['GET'])
def get_all_admin_notifications():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    admin_username = request.args.get('admin_username')
    
    try:
        # 1. Food Orders
        cursor.execute("""
            SELECT id, tenant_name, items AS title, total_amount, order_date AS date_time, is_read, 'order' AS notif_type 
            FROM tenant_orders 
            WHERE admin_username = %s OR admin_username IS NULL OR admin_username = ''
        """, (admin_username,))
        orders = cursor.fetchall()

        # 2. Complaints
        cursor.execute("""
            SELECT id, tenant_name, subject AS title, message, date_raised AS date_time, is_read, 'complaint' AS notif_type 
            FROM complaints 
            WHERE admin_username = %s OR admin_username IS NULL OR admin_username = ''
        """, (admin_username,))
        complaints = cursor.fetchall()

        # 3. 🌟 Meeting Bookings (இதைத்தான் நாம் சேர்க்க வேண்டும்)
        cursor.execute("""
            SELECT id, tenant_name, room_name AS title, booking_date AS date_time, is_read, 'meeting' AS notif_type 
            FROM meeting_bookings 
            WHERE admin_username = %s OR admin_username IS NULL OR admin_username = ''
        """, (admin_username,))
        meetings = cursor.fetchall()

        all_notifications = []
        unread_count = 0

        # Orders சேர்க்கிறோம்
        for row in orders:
            if row['is_read'] == 0: unread_count += 1
            all_notifications.append({
                'id': row['id'], 'tenant_name': row['tenant_name'],
                'message': f"New order placed by {row['tenant_name']} ({row['title']})",
                'date': str(row['date_time']), 'is_read': row['is_read'], 'type': 'order'
            })

        # Complaints சேர்க்கிறோம்
        for row in complaints:
            if row['is_read'] == 0: unread_count += 1
            all_notifications.append({
                'id': row['id'], 'tenant_name': row['tenant_name'],
                'message': f"Complaint from {row['tenant_name']}: {row['title']}",
                'date': str(row['date_time']), 'is_read': row['is_read'], 'type': 'complaint'
            })

        # 🌟 Meeting Bookings-ஐ நோட்டிபிகேஷன் லிஸ்ட்டில் சேர்க்கிறோம்
        for row in meetings:
            if row['is_read'] == 0: unread_count += 1
            all_notifications.append({
                'id': row['id'], 'tenant_name': row['tenant_name'],
                'message': f"Meeting room booked by {row['tenant_name']} ({row['title']})",
                'date': str(row['date_time']), 'is_read': row['is_read'], 'type': 'meeting'
            })

        all_notifications.sort(key=lambda x: x['date'], reverse=True)

        cursor.close()
        conn.close()
        return jsonify({'success': True, 'notifications': all_notifications, 'unreadCount': unread_count}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500

# டிராப்டவுனை திறந்தவுடன் அனைத்தையும் Read என மாற்றும் ரூட்
@admin_bp.route('/api/admin/all-notifications/mark-read', methods=['POST'])
def mark_all_notifications_read():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.json or {}
    admin_username = data.get('admin_username')
    
    try:
        cursor.execute("UPDATE tenant_orders SET is_read = 1 WHERE is_read = 0")
        cursor.execute("UPDATE complaints SET is_read = 1 WHERE is_read = 0")
        cursor.execute("UPDATE meeting_bookings SET is_read = 1 WHERE is_read = 0") # 🌟 மீட்டிங்ஸ் Read-ஆக மாற்ற
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'All marked as read'}), 200
    except Exception as e:
        if conn: conn.rollback()
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/api/admin/complaints-notifications', methods=['GET'])
def get_complaint_notifications():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    admin_username = request.args.get('admin_username')
    
    try:
        cursor.execute("""
            SELECT id, tenant_name, subject, message, date_raised, is_read 
            FROM complaints 
            WHERE (admin_username = %s OR admin_username IS NULL OR admin_username = '') AND is_read = 0
        """, (admin_username,))
        complaints = cursor.fetchall()
        
        unread_count = len(complaints)
        
        notifications = []
        for c in complaints:
            notifications.append({
                'id': c['id'],
                'tenant_name': c['tenant_name'],
                'message': f"Complaint from {c['tenant_name']}: {c['subject']}",
                'date': str(c.get('date_raised', 'Just now')),
                'is_read': c['is_read'],
                'type': 'complaint'
            })
            
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'notifications': notifications, 'unreadCount': unread_count}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/api/foods', methods=['GET', 'POST'])
def handle_foods():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if request.method == 'GET':
        admin_username = request.args.get('admin_username')
        if admin_username:
            cursor.execute("SELECT * FROM foods WHERE admin_username = %s", (admin_username,))
        else:
            cursor.execute("SELECT * FROM foods")
        foods = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "foods": foods}), 200

    if request.method == 'POST':
        data = request.json
        cursor.execute("""
            INSERT INTO foods (food_name, img_url, price, admin_username)
            VALUES (%s, %s, %s, %s)
        """, (
            data.get('foodName'), data.get('imgUrl'), 
            data.get('price'), data.get('admin_username')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Food added successfully!"}), 201

@admin_bp.route('/api/foods/<int:food_id>', methods=['DELETE'])
def delete_food(food_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("DELETE FROM foods WHERE id = %s", (food_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"status": "success", "message": "Food deleted successfully!"}), 200
# Update Food Price
@admin_bp.route('/api/foods/<int:food_id>', methods=['PUT'])
def update_food_price(food_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    try:
        cursor.execute("UPDATE foods SET price = %s WHERE id = %s", (data.get('price'), food_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Food price updated!"}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

# Toggle Availability (Available / Hidden Switch)
@admin_bp.route('/api/foods/<int:food_id>/toggle', methods=['PUT'])
def toggle_food_availability(food_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    try:
        cursor.execute("UPDATE foods SET is_available = %s WHERE id = %s", (data.get('is_available'), food_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Availability toggled!"}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500


# 🌟 Meeting Room Update (PUT) & Delete (DELETE) API Routes
@admin_bp.route('/api/tenant/meeting-bookings/<int:booking_id>', methods=['PUT', 'DELETE'])
def modify_meeting_room(booking_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        if request.method == 'DELETE':
            cursor.execute("DELETE FROM meeting_bookings WHERE id = %s", (booking_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "message": "Meeting booking deleted successfully!"}), 200

        if request.method == 'PUT':
            data = request.json
            tenant_name = data.get('tenant_name')
            admin_username = data.get('admin_username')
            room_name = data.get('room_name')
            booking_date = data.get('booking_date')
            time_slot = data.get('time_slot')
            purpose = data.get('purpose')

            # 1. வேறொரு மீட்டிங்குடன் டைம் ஓவர்லேப் ஆகிறதா என செக் செய்தல் (தற்போதைய ID-ஐ தவிர்த்துவிட்டு)
            cursor.execute("""
                SELECT * FROM meeting_bookings 
                WHERE room_name = %s AND booking_date = %s AND time_slot = %s AND id != %s
            """, (room_name, booking_date, time_slot, booking_id))
            existing_booking = cursor.fetchone()
            
            if existing_booking:
                cursor.close()
                conn.close()
                return jsonify({
                    "status": "error", 
                    "message": f"This meeting room ({room_name}) is already booked for this time slot ({time_slot}) on {booking_date}."
                }), 400

            # 2. அட்மின் / டெனன்ட் பெயர்களை உறுதிப்படுத்துதல்
            if admin_username:
                t_name = tenant_name or f"{admin_username} (Admin)"
                admin_user = admin_username
            else:
                cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
                t_rec = cursor.fetchone()
                admin_user = t_rec['admin_username'] if t_rec and t_rec.get('admin_username') else 'admin'
                t_name = tenant_name

            # 3. டேட்டாபேஸில் அப்டேட் செய்தல்
            cursor.execute("""
                UPDATE meeting_bookings 
                SET tenant_name = %s, admin_username = %s, room_name = %s, booking_date = %s, time_slot = %s, purpose = %s
                WHERE id = %s
            """, (t_name, admin_user, room_name, booking_date, time_slot, purpose, booking_id))
            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "message": "Meeting booking updated successfully!"}), 200

    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        print("Meeting Modify Error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. Get Meeting Bookings (Tenant or Admin)
@admin_bp.route('/api/meeting-bookings', methods=['GET'])
def get_meeting_bookings():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    tenant_name = request.args.get('tenant_name')
    admin_username = request.args.get('admin_username')
    
    try:
        if tenant_name:
            cursor.execute("""
                SELECT id, tenant_name, room_name AS room, booking_date AS date, time_slot AS time, purpose, status 
                FROM meeting_bookings WHERE tenant_name = %s ORDER BY id DESC
            """, (tenant_name,))
        elif admin_username:
            cursor.execute("""
                SELECT id, tenant_name, room_name AS room, booking_date AS date, time_slot AS time, purpose, status 
                FROM meeting_bookings WHERE admin_username = %s ORDER BY id DESC
            """, (admin_username,))
        else:
            cursor.execute("""
                SELECT id, tenant_name, room_name AS room, booking_date AS date, time_slot AS time, purpose, status 
                FROM meeting_bookings ORDER BY id DESC
            """)
            
        bookings = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "bookings": bookings}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

# 🌟 அட்மின் லோகோவை டேட்டாபேஸில் சேமிக்க/புதுப்பிக்க (POST)
@admin_bp.route('/api/admin/logo', methods=['POST'])
def update_admin_logo():
    data = request.get_json()
    admin_username = data.get('admin_username')
    logo_url = data.get('logo_url')
    
    if not admin_username:
        return jsonify({"success": False, "message": "Admin username missing"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE admins SET logo_url = %s WHERE username = %s",
            (logo_url, admin_username)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Admin logo updated successfully!"}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"success": False, "message": str(e)}), 500

# 🌟 அட்மின் லோகோவை டேட்டாபேஸிலிருந்து எடுக்க (GET)
@admin_bp.route('/api/admin/logo', methods=['GET'])
def get_admin_logo():
    admin_username = request.args.get('admin_username')
    if not admin_username:
        return jsonify({"success": False, "message": "Admin username missing"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT logo_url FROM admins WHERE username = %s", (admin_username,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        logo_url = row['logo_url'] if row and row['logo_url'] else ""
        return jsonify({"success": True, "logo_url": logo_url}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"success": False, "message": str(e)}), 500

from flask import request, jsonify

# 1. CRM லீட்களைப் பெற (GET)
@admin_bp.route('/api/admin/crm-leads', methods=['GET'])
def get_crm_leads():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    admin_username = request.args.get('admin_username')
    
    try:
        cursor.execute("SELECT * FROM crm_leads WHERE admin_username = %s ORDER BY id DESC", (admin_username,))
        leads = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'leads': leads}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500

# 2. புதிய CRM லீட்டைச் சேர்க்க (POST)
@admin_bp.route('/api/admin/crm-leads', methods=['POST'])
def add_crm_lead():
    data = request.json
    admin_username = data.get('admin_username')
    name = data.get('name')
    address = data.get('address')
    phone_number = data.get('phone_number')
    email = data.get('email')
    source = data.get('source')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO crm_leads (admin_username, name, address, phone_number, email, source) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (admin_username, name, address, phone_number, email, source))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Lead added successfully!'}), 201
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500


@admin_bp.route('/api/admin/crm-import', methods=['POST'])
def import_crm_leads():
    admin_username = request.form.get('admin_username')
    file = request.files.get('file')
    
    if not file or not file.filename.endswith('.csv'):
        return jsonify({'success': False, 'error': 'Please upload a valid .csv file securely.'}), 400
        
    try:
        stream = io.TextIOWrapper(file.stream, encoding='utf-8')
        csv_reader = csv.reader(stream)
        next(csv_reader) # Header-ஐத் தவிர்க்க
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        count = 0
        for row in csv_reader:
            if len(row) >= 5:
                name, address, phone_number, email, source = row[0], row[1], row[2], row[3], row[4]
                cursor.execute("""
                    INSERT INTO crm_leads (admin_username, name, address, phone_number, email, source) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (admin_username, name, address, phone_number, email, source))
                count += 1
                
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': f'{count} leads imported successfully!'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# CRM லீட்டின் ஸ்டேட்டஸை மாற்ற (UPDATE)
@admin_bp.route('/api/admin/crm-leads/status', methods=['PUT'])
def update_crm_lead_status():
    data = request.json
    lead_id = data.get('id')
    new_status = data.get('status')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE crm_leads SET status = %s WHERE id = %s", (new_status, lead_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Lead status updated successfully!'}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/api/admin/workspace-tenants', methods=['GET'])
def get_workspace_tenants():
    workspace_name = request.args.get('workspace')
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # ஒருவேளை ஒர்க்ஸ்பேஸ் பெயர் சரியாக மேட்ச் ஆகாவிட்டால், அனைத்து டெனன்ட்களையும் தர இந்தக் குவாரி உதவும்
        if workspace_name and workspace_name != "All":
            query = "SELECT name FROM tenants_new WHERE LOWER(TRIM(workspace)) LIKE LOWER(TRIM(%s))"
            cursor.execute(query, (f"%{workspace_name}%",))
        else:
            query = "SELECT name FROM tenants_new"
            cursor.execute(query)
            
        tenants = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({"status": "success", "tenants": tenants}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@admin_bp.route('/api/admin/visitors', methods=['GET', 'POST'])
def handle_visitors():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if request.method == 'GET':
            cursor.execute("SELECT * FROM visitors ORDER BY id DESC")
            visitors = cursor.fetchall()
            
            decrypted_visitors = []
            for v in visitors:
                # 🌟 timedelta-வை String-ஆக மாற்றும் பகுதி
                ent_time = str(v.get("entry_time")) if v.get("entry_time") else None
                ext_time = str(v.get("exit_time")) if v.get("exit_time") else None
                if ent_time and len(ent_time) > 8: ent_time = ent_time[:8] # HH:MM:SS format
                if ext_time and len(ext_time) > 8: ext_time = ext_time[:8]

                decrypted_visitors.append({
                    "id": v["id"],
                    "name": decrypt_data(v["name"]),          
                    "phone": decrypt_data(v["phone"]),        
                    "workspace": v["workspace"],              
                    "tenant_name": v["tenant_name"],          
                    "purpose": decrypt_data(v["purpose"]),    
                    "entry_time": ent_time,        
                    "exit_time": ext_time,          
                    "created_at": str(v.get("created_at")) if v.get("created_at") else None
                })
                
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "visitors": decrypted_visitors}), 200

        if request.method == 'POST':
            data = request.json
            
            # 🔒 டேட்டாபேஸில் சேமிக்கும் முன் அவசியமானவற்றை Encrypt செய்தல்
            enc_name = encrypt_data(data.get('name'))
            enc_phone = encrypt_data(data.get('phone'))
            enc_purpose = encrypt_data(data.get('purpose'))
            entry_time = data.get('entry_time')
            exit_time = data.get('exit_time')
            
            cursor.execute("""
                INSERT INTO visitors (name, phone, workspace, tenant_name, purpose, entry_time, exit_time)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                enc_name, 
                enc_phone, 
                data.get('workspace'), 
                data.get('tenant_name'), 
                enc_purpose,
                entry_time,
                exit_time
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "message": "Visitor data encrypted & saved with times!"}), 201
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/admin/visitors/<int:v_id>', methods=['PUT'])
def update_visitor_exit(v_id):
    try:
        data = request.json
        exit_time = data.get('exit_time')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE visitors SET exit_time = %s WHERE id = %s", (exit_time, v_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Exit time updated successfully!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 3. விசிட்டரை நீக்க / செக்-அவுட் செய்ய (Checkout)
@admin_bp.route('/api/admin/visitors/<int:visitor_id>', methods=['DELETE'])
def delete_visitor(visitor_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM visitors WHERE id = %s", (visitor_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Visitor checked out!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# டெனன்ட் டேஷ்போர்டில் சேர்க்கப்படும் Attendees விவரங்களை அட்மின் டேஷ்போர்டிற்காகப் பெற (GET)
# டெனன்ட்/அட்மின் சேர்த்த அனைத்து Attendees விவரங்களையும் பெற (GET)
@admin_bp.route('/api/admin/attendees', methods=['GET'])
def get_admin_attendees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # admin_username ஃபில்டர் தேவையின்றி டேபிளில் உள்ள அத்தனை attendees-ஐயும் எடுக்கிறது
        cursor.execute("SELECT * FROM attendees ORDER BY id DESC")
        attendees = cursor.fetchall()
        
        # என்கிரிப்ட் செய்யப்பட்ட phone மற்றும் address-ஐ decrypt செய்தல்
        for att in attendees:
            if 'phone' in att and att['phone']:
                att['phone'] = decrypt_data(att['phone'])
            if 'address' in att and att['address']:
                att['address'] = decrypt_data(att['address'])
                
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "attendees": attendees}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500
        return jsonify({"status": "error", "message": str(e)}), 500

@admin_bp.route('/api/tasks/add', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        task_name = data.get('taskName')
        priority = data.get('priority')
        workspace = data.get('workspace')
        assigned_to = data.get('assignedTo')
        status = data.get('status', 'Pending')
        assign_date = data.get('assignDate')
        
        # 🌟 End Date காலியாக இருந்தால் NULL போகும்படி செய்தல்
        end_date = data.get('endDate')
        if not end_date or end_date == '':
            end_date = None

        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO tasks (task_name, priority, workspace, assigned_to, status, task_assign_date, task_end_date) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (task_name, priority, workspace, assigned_to, status, assign_date, end_date))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Task added successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# 🌟 2. சேமிக்கப்பட்ட Task-களை எடுக்க (GET API)
@admin_bp.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # 🌟 டேட்டாபேஸில் உள்ள உண்மையான பெயர்களையே அப்படியே அனுப்புவது
        cursor.execute("SELECT id, task_name, priority, workspace, assigned_to, status, task_assign_date, task_end_date FROM tasks ORDER BY id DESC")
        tasks = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return jsonify({"success": True, "tasks": tasks})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# 🌟 Task Update API (End Date மற்றும் Status மட்டும் மாற்ற)
@admin_bp.route('/api/tasks/update/<int:task_id>', methods=['PUT'])
def update_task_status(task_id):
    try:
        data = request.get_json()
        status = data.get('status')
        end_date = data.get('endDate')
        if not end_date or end_date == '':
            end_date = None

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET status = %s, task_end_date = %s WHERE id = %s", (status, end_date, task_id))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Task updated successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@admin_bp.route('/api/tasks/toggle-status/<int:task_id>', methods=['PUT'])
def toggle_task_status(task_id):
    try:
        data = request.get_json()
        status = data.get('status')  # 'Completed' அல்லது 'Pending'
        
        # 🌟 ஆன் செய்தால் இன்றைய தேதி (End Date), ஆஃப் செய்தால் NULL
        end_date = date.today().strftime('%Y-%m-%d') if status == 'Completed' else None

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE tasks SET status = %s, task_end_date = %s WHERE id = %s", (status, end_date, task_id))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"success": True, "message": "Task status and end date updated successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
