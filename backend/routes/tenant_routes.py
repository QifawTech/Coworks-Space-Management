from flask import Blueprint, jsonify, request
import base64
import os
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash

# db.py-ல் இருந்து தேவையானவற்றை மட்டும் இறக்குமதி செய்தல்
from db import get_db_connection, encrypt_data, decrypt_data

# UPLOAD_FOLDER-ஐ இந்த ஃபைலிலேயே வரையறுத்துக் கொள்ளவும்
UPLOAD_FOLDER = 'uploads'

tenant_bp = Blueprint('tenant_bp', __name__)


@tenant_bp.route('/api/tenants-managed', methods=['POST'])
def add_managed_tenant():
    try:
        name = request.form.get('name')
        username = request.form.get('username')
        password = generate_password_hash(request.form.get('password'))
        admin_username = request.form.get('admin_username')
        
        phone = encrypt_data(request.form.get('phone'))
        email = encrypt_data(request.form.get('email'))
        address = encrypt_data(request.form.get('address'))
        workspace = request.form.get('workspace')
        seats = int(request.form.get('seats', 0))
        gst = encrypt_data(request.form.get('gst'))
        pan = encrypt_data(request.form.get('pan'))
        join_date = request.form.get('joinDate')
        end_date = request.form.get('endDate', 'Active')
        
        doc_filename = ''
        if 'document' in request.files:
            file = request.files['document']
            if file and file.filename != '':
                doc_filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, doc_filename))
        
        agr_filename = ''
        if 'agreement' in request.files:
            file = request.files['agreement']
            if file and file.filename != '':
                agr_filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, agr_filename))
        
        # ✨ பல ஆவணங்களை (Multiple Extra Documents) பெற்று சேமிக்கும் பகுதி
        extra_filenames = []
        if 'extra_docs' in request.files:
            extra_files = request.files.getlist('extra_docs')
            for file in extra_files:
                if file and file.filename != '':
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    extra_filenames.append(filename)
        
        # பல கோப்பு பெயர்களை ஒன்றாக இணைத்து சேமிக்க (Comma separated string-ஆக மாற்றுகிறோம்)
        extra_docs_str = ",".join(extra_filenames)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """INSERT INTO tenants_new (name, username, password, phone, email, address, workspace, seats, gst, pan, join_date, end_date, document, agreement, extra_documents, admin_username) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (name, username, password, phone, email, address, workspace, seats, gst, pan, join_date, end_date, doc_filename, agr_filename, extra_docs_str, admin_username))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Tenant and multiple documents uploaded successfully!"}), 200
    except Exception as e:
        print("Add Tenant Error:", e)
        return jsonify({"error": str(e)}), 500

@tenant_bp.route('/api/tenants-managed', methods=['GET'])
def get_managed_tenants():
    try:
        admin_username = request.args.get('admin_username')
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        if admin_username:
            cursor.execute("SELECT * FROM tenants_new WHERE admin_username = %s ORDER BY id DESC", (admin_username,))
        else:
            cursor.execute("SELECT * FROM tenants_new ORDER BY id DESC")
            
        tenants = cursor.fetchall()
        
        for t in tenants:
            t['phone'] = decrypt_data(t['phone'])
            t['email'] = decrypt_data(t['email'])
            t['address'] = decrypt_data(t['address'])
            t['gst'] = decrypt_data(t['gst'])
            t['pan'] = decrypt_data(t['pan'])
            
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "tenants": tenants}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tenant_bp.route('/api/tenants-managed/<int:t_id>', methods=['PUT'])
def update_managed_tenant(t_id):
    try:
        name = request.form.get('name') or (request.json.get('name') if request.is_json else None)
        username = request.form.get('username') or (request.json.get('username') if request.is_json else None)
        password_raw = request.form.get('password') or (request.json.get('password') if request.is_json else None)
        
        phone_raw = request.form.get('phone') or (request.json.get('phone') if request.is_json else '')
        email_raw = request.form.get('email') or (request.json.get('email') if request.is_json else '')
        address_raw = request.form.get('address') or (request.json.get('address') if request.is_json else '')
        workspace = request.form.get('workspace') or (request.json.get('workspace') if request.is_json else '')
        seats = int(request.form.get('seats') or (request.json.get('seats') if request.is_json else 0))
        gst_raw = request.form.get('gst') or (request.json.get('gst') if request.is_json else '')
        pan_raw = request.form.get('pan') or (request.json.get('pan') if request.is_json else '')
        join_date = request.form.get('joinDate') or (request.json.get('joinDate') if request.is_json else '')
        end_date = request.form.get('endDate') or (request.json.get('endDate') if request.is_json else 'Active')

        phone = encrypt_data(phone_raw)
        email = encrypt_data(email_raw)
        address = encrypt_data(address_raw)
        gst = encrypt_data(gst_raw)
        pan = encrypt_data(pan_raw)

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT document, agreement, extra_documents FROM tenants_new WHERE id = %s", (t_id,))
        old_files = cursor.fetchone() or {}
        
        document = old_files.get('document', '')
        if 'document' in request.files:
            file = request.files['document']
            if file and file.filename != '':
                document = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, document))
        elif request.is_json and request.json.get('document'):
            document = request.json.get('document')

        agreement = old_files.get('agreement', '')
        if 'agreement' in request.files:
            file = request.files['agreement']
            if file and file.filename != '':
                agreement = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, agreement))
        elif request.is_json and request.json.get('agreement'):
            agreement = request.json.get('agreement')

        # ✨ அப்டேட் செய்யும்போதும் கூடுதல் டாக்குமெண்ட்களைக் கையாளுதல்
        extra_filenames = []
        if 'extra_docs' in request.files:
            extra_files = request.files.getlist('extra_docs')
            for file in extra_files:
                if file and file.filename != '':
                    filename = secure_filename(file.filename)
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    extra_filenames.append(filename)
        
        extra_docs_str = ",".join(extra_filenames) if extra_filenames else old_files.get('extra_documents', '')

        cursor.close()
        cursor = conn.cursor()

        if password_raw:
            password = generate_password_hash(password_raw)
            query = """UPDATE tenants_new SET name=%s, username=%s, password=%s, phone=%s, email=%s, address=%s, workspace=%s, seats=%s, gst=%s, pan=%s, join_date=%s, end_date=%s, document=%s, agreement=%s, extra_documents=%s 
                        WHERE id=%s"""
            cursor.execute(query, (name, username, password, phone, email, address, workspace, seats, gst, pan, join_date, end_date, document, agreement, extra_docs_str, t_id))
        else:
            query = """UPDATE tenants_new SET name=%s, username=%s, phone=%s, email=%s, address=%s, workspace=%s, seats=%s, gst=%s, pan=%s, join_date=%s, end_date=%s, document=%s, agreement=%s, extra_documents=%s 
                        WHERE id=%s"""
            cursor.execute(query, (name, username, phone, email, address, workspace, seats, gst, pan, join_date, end_date, document, agreement, extra_docs_str, t_id))
            
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"status": "success", "message": "Tenant updated successfully!"}), 200
    except Exception as e:
        print("Update Tenant Error:", e)
        return jsonify({"status": "error", "error": str(e)}), 500

@tenant_bp.route('/api/tenants-managed/<int:t_id>', methods=['DELETE'])
def delete_managed_tenant(t_id):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tenants_new WHERE id = %s", (t_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Tenant deleted successfully!"}), 200
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500

@tenant_bp.route('/api/attendees', methods=['GET', 'POST'])
def handle_attendees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if request.method == 'GET':
        tenant_name = request.args.get('tenant_name')
        if tenant_name:
            cursor.execute("SELECT * FROM attendees WHERE tenant_name = %s", (tenant_name,))
        else:
            cursor.execute("SELECT * FROM attendees")
        
        attendees = cursor.fetchall()
        for att in attendees:
            try:
                if att['phone']:
                    att['phone'] = decrypt_data(att['phone'])
                if att['address']:
                    att['address'] = decrypt_data(att['address'])
            except Exception:
                pass

        cursor.close()
        conn.close()
        return jsonify({"status": "success", "attendees": attendees}), 200

    if request.method == 'POST':
        data = request.json
        raw_phone = data.get('phone', '')
        raw_address = data.get('address', '')
        
        encrypted_phone = encrypt_data(raw_phone)
        encrypted_address = encrypt_data(raw_address)

        cursor.execute("""
            INSERT INTO attendees (att_id, name, tenant_name, workspace, phone, address, role, join_date, end_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data.get('attId'), data.get('name'), data.get('tenantName'), 
            data.get('workspace'), encrypted_phone, encrypted_address, 
            data.get('role'), data.get('joinDate'), data.get('endDate')
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Attendee saved securely to DB!"}), 201

@tenant_bp.route('/api/attendees/<int:att_id>', methods=['PUT', 'DELETE'])
def modify_attendee(att_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'DELETE':
        cursor.execute("DELETE FROM attendees WHERE id = %s", (att_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Attendee deleted!"}), 200

    if request.method == 'PUT':
        data = request.json
        raw_phone = data.get('phone', '')
        raw_address = data.get('address', '')
        
        encrypted_phone = encrypt_data(raw_phone)
        encrypted_address = encrypt_data(raw_address)

        cursor.execute("""
            UPDATE attendees SET att_id=%s, name=%s, phone=%s, address=%s, role=%s, join_date=%s, end_date=%s
            WHERE id=%s
        """, (
            data.get('attId'), data.get('name'), encrypted_phone, 
            encrypted_address, data.get('role'), data.get('joinDate'), 
            data.get('endDate'), att_id
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Attendee updated securely!"}), 200

@tenant_bp.route('/api/tenant/foods', methods=['GET'])
def get_tenant_foods():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    tenant_name = request.args.get('tenant_name')
    
    try:
        cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
        tenant_record = cursor.fetchone()
        
        if tenant_record and tenant_record['admin_username']:
            admin_user = tenant_record['admin_username']
            cursor.execute("""
                SELECT * FROM foods 
                WHERE admin_username = %s AND (is_available = TRUE OR is_available = 1)
            """, (admin_user,))
            foods = cursor.fetchall()
        else:
            foods = []
            
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "foods": foods}), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500



@tenant_bp.route('/api/tenant/orders', methods=['POST'])
def place_tenant_order():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.json
    
    tenant_name = data.get('tenant_name')
    items_json = str(data.get('items'))
    total_amount = data.get('total_amount')
    
    try:
        cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
        t_rec = cursor.fetchone()
        admin_user = t_rec['admin_username'] if t_rec else ''
        
        # 🌟 இங்கே is_read = 0 என்பதை explicitly சேர்த்து இன்செர்ட் செய்கிறோம்
        cursor.execute("""
            INSERT INTO tenant_orders (tenant_name, admin_username, items, total_amount, is_read)
            VALUES (%s, %s, %s, %s, 0)
        """, (tenant_name, admin_user, items_json, total_amount))
        
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Order placed successfully!"}), 201
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500



@tenant_bp.route('/api/tenant/monthly-invoice', methods=['POST'])
def generate_monthly_invoice():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        data = request.json or {}

        tenant_name = data.get('tenant_name')
        billing_month = data.get('billing_month')

        if not tenant_name or not billing_month:
            return jsonify({"status": "error", "message": "tenant_name and billing_month are required"}), 400

        cursor.execute("""
            SELECT * FROM tenant_invoices
            WHERE tenant_name = %s AND billing_month = %s
            ORDER BY id DESC LIMIT 1
        """, (tenant_name, billing_month))
        existing_invoice = cursor.fetchone()

        if existing_invoice:
            return jsonify({"status": "success", "invoice": existing_invoice}), 200

        cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s LIMIT 1", (tenant_name,))
        t_rec = cursor.fetchone()
        admin_user = t_rec['admin_username'] if t_rec and t_rec.get('admin_username') else 'admin'

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0) AS total
            FROM tenant_orders
            WHERE tenant_name = %s AND DATE_FORMAT(order_date, '%Y-%m') = %s
        """, (tenant_name, billing_month))
        sum_res = cursor.fetchone()
        total_bill = float(sum_res['total']) if sum_res and sum_res.get('total') is not None else 0.00

        try:
            year, month = map(int, billing_month.split('-'))
            if month == 12:
                due_year, due_month = year + 1, 1
            else:
                due_year, due_month = year, month + 1
            due_date_str = f"{due_year}-{due_month:02d}-05"
        except Exception:
            due_date_str = "2026-09-05"

        cursor.execute("""
            INSERT INTO tenant_invoices (tenant_name, admin_username, billing_month, total_amount, due_date, status)
            VALUES (%s, %s, %s, %s, %s, 'Pending')
        """, (tenant_name, admin_user, billing_month, total_bill, due_date_str))
        conn.commit()

        new_invoice_id = cursor.lastrowid
        cursor.execute("SELECT * FROM tenant_invoices WHERE id = %s LIMIT 1", (new_invoice_id,))
        new_invoice = cursor.fetchone()

        return jsonify({"status": "success", "invoice": new_invoice}), 201

    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@tenant_bp.route('/api/tenant/profile', methods=['GET'])
def get_tenant_profile():
    tenant_name = request.args.get('tenant_name')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM tenants_new WHERE name = %s", (tenant_name,))
        tenant = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if tenant:
            fields_to_decrypt = ['email', 'phone', 'address', 'gst', 'pan']
            for field in fields_to_decrypt:
                if tenant.get(field):
                    try:
                        tenant[field] = decrypt_data(tenant[field])
                    except Exception:
                        pass
            if 'password' in tenant:
                del tenant['password']
            return jsonify({"status": "success", "profile": tenant}), 200
        return jsonify({"status": "error", "message": "Tenant not found"}), 404
    except Exception as e:
        if cursor: cursor.close()
        if conn: conn.close()
        return jsonify({"status": "error", "message": str(e)}), 500


@tenant_bp.route('/api/notices', methods=['GET'])
def get_notices():
    conn = None
    cursor = None
    try:
        tenant_name = request.args.get('tenant_name', '').strip()
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 1. இந்த டெனன்ட் எந்த தேதியில் பதிவு/உருவாக்கப்பட்டார் (join_date) என்பதைப் பெறுகிறோம்
        cursor.execute("SELECT join_date FROM tenants_new WHERE LOWER(TRIM(name)) = LOWER(TRIM(%s))", (tenant_name,))
        tenant_rec = cursor.fetchone()
        
        # ஒருவேளை join_date இல்லையென்றால் தற்போதைய தேதியை எடுத்துக் கொள்ளலாம் அல்லது காலியாக விடலாம்
        join_date = tenant_rec['join_date'] if tenant_rec and tenant_rec.get('join_date') else '2000-01-01'
        
        # 2. Join date-க்குப் பிறகு வந்த பிராட்காஸ்ட் அல்லது இவருக்கு அனுப்பப்பட்ட நேரடி நோட்டீஸ்களை மட்டும் எடுத்தல்
        cursor.execute("""
            SELECT id, notice_type, recipient, message, date_sent as date
            FROM notices
            WHERE (
                (notice_type = 'broadcast' OR LOWER(TRIM(recipient)) = LOWER(TRIM(%s)))
                AND date_sent >= %s
            )
            ORDER BY date_sent DESC
        """, (tenant_name, join_date))
        
        rows = cursor.fetchall()
        return jsonify({"success": True, "notices": rows}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()


@tenant_bp.route('/api/tenant/complaints', methods=['POST', 'GET'])
def handle_tenant_complaints():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    if request.method == 'POST':
        data = request.json
        tenant_name = data.get('tenant_name')
        subject = data.get('subject')
        message = data.get('message')
        try:
            cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
            t_rec = cursor.fetchone()
            admin_user = t_rec['admin_username'] if t_rec and t_rec['admin_username'] else 'admin'
            
            # 🌟 இங்கே is_read = 0 சேர்த்து இன்செர்ட் செய்கிறோம்
            cursor.execute("""
                INSERT INTO complaints (tenant_name, admin_username, subject, message, status, is_read)
                VALUES (%s, %s, %s, %s, 'Open / Pending', 0)
            """, (tenant_name, admin_user, subject, message))
            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "message": "Complaint raised successfully!"}), 201
        except Exception as e:
            if conn: conn.rollback()
            if cursor: cursor.close()
            if conn: conn.close()
            return jsonify({"status": "error", "message": str(e)}), 500

    if request.method == 'GET':
        tenant_name = request.args.get('tenant_name', '')
        try:
            cursor.execute("SELECT * FROM complaints WHERE tenant_name = %s ORDER BY id DESC", (tenant_name,))
            complaints = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "complaints": complaints}), 200
        except Exception as e:
            if cursor: cursor.close()
            if conn: conn.close() # சிறிய பிழை (conn.close) இங்கு சரிசெய்யப்பட்டுள்ளது
            return jsonify({"status": "error", "message": str(e)}), 500


@tenant_bp.route('/api/tenant/meeting-bookings', methods=['POST', 'GET'])
def handle_meeting_bookings():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        data = request.json
        tenant_name = data.get('tenant_name')
        admin_username = data.get('admin_username')
        room_name = data.get('room_name')
        booking_date = data.get('booking_date')
        time_slot = data.get('time_slot')
        purpose = data.get('purpose')
        
        try:
            cursor.execute("""
                SELECT * FROM meeting_bookings 
                WHERE room_name = %s AND booking_date = %s AND time_slot = %s
            """, (room_name, booking_date, time_slot))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"status": "error", "message": f"This room is already booked for this time slot!"}), 400

            if admin_username:
                t_name = tenant_name or f"{admin_username} (Admin)"
                admin_user = admin_username
            else:
                cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
                t_rec = cursor.fetchone()
                admin_user = t_rec['admin_username'] if t_rec and t_rec.get('admin_username') else 'admin'
                t_name = tenant_name

            # 🌟 இங்குதான் 'is_read, 0' சேர்க்கப்பட்டுள்ளது (மற்றபடி எந்தக் கோடும் மாற்றப்படவில்லை)
            cursor.execute("""
                INSERT INTO meeting_bookings (tenant_name, admin_username, room_name, booking_date, time_slot, purpose, status, is_read)
                VALUES (%s, %s, %s, %s, %s, %s, 'Booked / Confirmed', 0)
            """, (t_name, admin_user, room_name, booking_date, time_slot, purpose))
            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "message": "Meeting room booked successfully!"}), 201
        except Exception as e:
            if cursor: cursor.close()
            if conn: conn.close()
            return jsonify({"status": "error", "message": str(e)}), 500

    if request.method == 'GET':
        tenant_name = request.args.get('tenant_name')
        admin_username = request.args.get('admin_username')
        try:
            if tenant_name:
                cursor.execute("SELECT id, tenant_name, room_name AS room, booking_date AS date, time_slot AS time, purpose, status FROM meeting_bookings WHERE tenant_name = %s ORDER BY id DESC", (tenant_name,))
            elif admin_username:
                cursor.execute("SELECT id, tenant_name, room_name AS room, booking_date AS date, time_slot AS time, purpose, status FROM meeting_bookings WHERE admin_username = %s ORDER BY id DESC", (admin_username,))
            else:
                cursor.execute("SELECT id, tenant_name, room_name AS room, booking_date AS date, time_slot AS time, purpose, status FROM meeting_bookings ORDER BY id DESC")
            bookings = cursor.fetchall()
            cursor.close()
            conn.close()
            return jsonify({"status": "success", "bookings": bookings}), 200
        except Exception as e:
            if cursor: cursor.close()
            if conn: conn.close()
            return jsonify({"status": "error", "message": str(e)}), 500



@tenant_bp.route('/api/tenant/meeting-bookings/<int:booking_id>', methods=['PUT', 'DELETE'])
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

            cursor.execute("""
                SELECT * FROM meeting_bookings 
                WHERE room_name = %s AND booking_date = %s AND time_slot = %s AND id != %s
            """, (room_name, booking_date, time_slot, booking_id))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                return jsonify({"status": "error", "message": "This room is already booked for this time slot!"}), 400

            if admin_username:
                t_name = tenant_name or f"{admin_username} (Admin)"
                admin_user = admin_username
            else:
                cursor.execute("SELECT admin_username FROM tenants_new WHERE name = %s", (tenant_name,))
                t_rec = cursor.fetchone()
                admin_user = t_rec['admin_username'] if t_rec and t_rec.get('admin_username') else 'admin'
                t_name = tenant_name

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
        return jsonify({"status": "error", "message": str(e)}), 500

@tenant_bp.route('/api/tenant/meeting-bookings/<int:booking_id>/complete', methods=['PUT'])
def mark_tenant_meeting_completed(booking_id):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            UPDATE meeting_bookings 
            SET status = 'Completed' 
            WHERE id = %s
        """, (booking_id,))
        
        conn.commit()
        return jsonify({"success": True, "message": "Meeting marked as completed!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# 🌟 டெனன்ட் லோகோவை டேட்டாபேஸில் சேமிக்க/புதுப்பிக்க (POST)
@tenant_bp.route('/api/tenant/logo', methods=['POST'])
def update_tenant_logo():
    data = request.get_json()
    tenant_id = data.get('tenant_id')
    logo_url = data.get('logo_url')
    
    if not tenant_id:
        return jsonify({"success": False, "message": "Tenant ID missing"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # உங்கள் டேபிள் பெயர் tenants_new அல்லது tenants என்பதைப் பொறுத்து மாற்றவும்
        cursor.execute("UPDATE tenants_new SET logo_url = %s WHERE id = %s", (logo_url, tenant_id))
        conn.commit()
        return jsonify({"success": True, "message": "Tenant logo updated successfully!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# 🌟 டெனன்ட் லோகோவை டேட்டாபேஸிலிருந்து எடுக்க (GET)
@tenant_bp.route('/api/tenant/logo', methods=['GET'])
def get_tenant_logo():
    tenant_id = request.args.get('tenant_id')
    if not tenant_id:
        return jsonify({"success": False, "message": "Tenant ID missing"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT logo_url FROM tenants_new WHERE id = %s", (tenant_id,))
        row = cursor.fetchone()
        logo_url = row['logo_url'] if row and row['logo_url'] else ""
        return jsonify({"success": True, "logo_url": logo_url}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()