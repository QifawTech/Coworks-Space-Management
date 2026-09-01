from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from db import get_db_connection, encrypt_data, decrypt_data, generate_password_hash

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/api/tenant-login', methods=['POST'])
def tenant_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tenants_new WHERE username = %s", (username,))
        tenant = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if tenant and check_password_hash(tenant['password'], password):
            tenant['phone'] = decrypt_data(tenant['phone'])
            tenant['email'] = decrypt_data(tenant['email'])
            tenant['address'] = decrypt_data(tenant['address'])
            tenant['gst'] = decrypt_data(tenant['gst'])
            tenant['pan'] = decrypt_data(tenant['pan'])
            del tenant['password'] 
            
            return jsonify({"status": "success", "message": "Login successful!", "tenant": tenant}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid username or password!"}), 401
    except Exception as e:
        print("Login Error:", e)
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/api/login', methods=['POST'])
def universal_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Super Admin Check
        cursor.execute("SELECT * FROM super_admin WHERE username = %s", (username,))
        super_admin = cursor.fetchone()
        if super_admin:
            db_pass = str(super_admin['password'])
            if db_pass == password or check_password_hash(db_pass, password):
                cursor.close()
                conn.close()
                return jsonify({"status": "success", "role": "superadmin", "message": "Super Admin Login Successful!"}), 200

        # 2. Admin Check
        cursor.execute("SELECT * FROM admins WHERE username = %s", (username,))
        admin = cursor.fetchone()
        if admin:
            db_pass = str(admin['password'])
            if db_pass == password or check_password_hash(db_pass, password):
                cursor.close()
                conn.close()
                return jsonify({"status": "success", "role": "admin", "message": "Admin Login Successful!"}), 200

        # 3. Tenant Check
        cursor.execute("SELECT * FROM tenants_new WHERE username = %s", (username,))
        tenant = cursor.fetchone()

        if tenant:
            db_password = str(tenant['password'])
            is_match = False
            if db_password == password:
                is_match = True
            else:
                try:
                    if check_password_hash(db_password, password):
                        is_match = True
                except:
                    pass

            if is_match:
                tenant['phone'] = decrypt_data(tenant['phone'])
                tenant['email'] = decrypt_data(tenant['email'])
                tenant['address'] = decrypt_data(tenant['address'])
                tenant['gst'] = decrypt_data(tenant['gst'])
                tenant['pan'] = decrypt_data(tenant['pan'])
                if 'password' in tenant:
                    del tenant['password']

                cursor.close()
                conn.close()
                return jsonify({
                    "status": "success", 
                    "role": "tenant", 
                    "message": "Tenant Login Successful!", 
                    "tenant": tenant
                }), 200

        cursor.close()
        conn.close()
        return jsonify({"status": "error", "message": "Invalid username or password!"}), 401

    except Exception as e:
        print("Login Error:", e)
        return jsonify({"error": str(e)}), 500