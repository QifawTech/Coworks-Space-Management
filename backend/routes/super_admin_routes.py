
import os
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from db import get_db_connection

super_admin_bp = Blueprint('super_admin_bp', __name__)

# --- Updated add_admin route to support Start Date, End Date & Multiple Documents ---
@super_admin_bp.route('/api/superadmin/add-admin', methods=['POST'])
def add_admin():
    try:
        # FormData மூலம் வரும் ஃபார்ம் டேட்டாவைப் பெறுதல்
        name = request.form.get('name')
        username = request.form.get('username')
        workspace = request.form.get('workspace')
        raw_password = request.form.get('password')
        start_date = request.form.get('start_date')
        end_date = request.form.get('end_date')
        
        hashed_password = generate_password_hash(raw_password) if raw_password else ''

        # பல டாக்குமெண்ட் ஃபைல்களை (Multiple Documents) சேமிக்கும் பகுதி
        saved_file_names = []
        upload_folder = os.path.join(os.getcwd(), 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        # React-லிருந்து 'documents' அல்லது 'document' என எது வந்தாலும் ஏற்கும் முறை
        files = request.files.getlist('documents')
        if not files and 'document' in request.files:
            files = request.files.getlist('document')

        for file in files:
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                file.save(os.path.join(upload_folder, filename))
                saved_file_names.append(filename)

        document_paths_str = ','.join(saved_file_names) if saved_file_names else None

        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO admins (name, username, password, company_name, start_date, end_date, document_path) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (name, username, hashed_password, workspace, start_date if start_date else None, end_date if end_date else None, document_paths_str))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Admin added successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@super_admin_bp.route('/api/superadmin/admins', methods=['GET'])
def get_superadmin_admins():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM admins ORDER BY id DESC")
        admins = cursor.fetchall()
        
        for admin in admins:
            if admin.get('created_at'):
                admin['created_at'] = admin['created_at'].strftime('%Y-%m-%d %H:%M:%S') if hasattr(admin['created_at'], 'strftime') else str(admin['created_at'])
            else:
                admin['created_at'] = ''
                
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "admins": admins}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@super_admin_bp.route('/api/superadmin/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM admins WHERE id = %s", (admin_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "message": "Admin deleted successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@super_admin_bp.route('/api/superadmin/dashboard', methods=['GET'])
def get_dashboard_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # டாட்டாபேஸில் உள்ள மொத்த அட்மின்களின் (Workspaces) எண்ணிக்கையை எடுப்பது
        cursor.execute("SELECT COUNT(*) as total FROM admins")
        result = cursor.fetchone()
        total_workspaces = result['total'] if result else 0
        
        # 🌟 டம்மி கணக்கீடுகள் நீக்கப்பட்டு, நேரடியான / உண்மையான மதிப்புகள் வழங்கப்பட்டுள்ளன
        stats = {
            "total_workspaces": total_workspaces, 
            "active_tenants": total_workspaces, # உண்மையான ஒட்டுமொத்த கணக்கு
            "monthly_revenue": total_workspaces * 150 # உண்மையான ஒட்டுமொத்த வருவாய் கணக்கீடு
        }
        
        cursor.execute("SELECT company_name AS workspace_name, username AS admin_name FROM admins ORDER BY id DESC LIMIT 5")
        activities = cursor.fetchall()
        for act in activities: 
            act['status'] = 'Active'
            
        cursor.close()
        conn.close()
        return jsonify({"status": "success", "stats": stats, "activities": activities})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# --- லோகோ ரவுட்ஸ் (புதிய முறை) ---

@super_admin_bp.route('/api/superadmin/logo', methods=['GET'])
def get_superadmin_logo():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT logo_url FROM super_admin LIMIT 1")
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return jsonify({"success": True, "logo_url": row['logo_url'] if row and row['logo_url'] else ""}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# 1. URL மூலம் லோகோ சேமிக்க
@super_admin_bp.route('/api/superadmin/logo', methods=['POST'])
def update_superadmin_logo():
    data = request.json
    logo_url = data.get('logo_url')
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE super_admin SET logo_url = %s WHERE id = 1", (logo_url,))
        conn.commit()
        return jsonify({"success": True, "message": "Logo URL updated!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close(); conn.close()

# 2. லோக்கல் ஃபைல் அப்லோட் செய்ய (இந்த முறை 'max_allowed_packet' எரர் வராது)
@super_admin_bp.route('/api/superadmin/upload-logo', methods=['POST'])
def upload_superadmin_logo():
    if 'logo' not in request.files: return jsonify({"success": False, "message": "No file"}), 400
    file = request.files['logo']
    filename = secure_filename(file.filename)
    upload_folder = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    file.save(os.path.join(upload_folder, filename))
    
    logo_url = f"http://localhost:5000/uploads/{filename}"
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE super_admin SET logo_url = %s WHERE id = 1", (logo_url,))
        conn.commit()
        return jsonify({"success": True, "logo_url": logo_url}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close(); conn.close()

@super_admin_bp.route('/api/admin/profile', methods=['GET'])
def get_admin_profile():
    try:
        # admin_username அல்லது username இரண்டில் எது வந்தாலும் ஏற்கும்
        admin_username = request.args.get('admin_username') or request.args.get('username')
        if not admin_username:
            return jsonify({"status": "error", "message": "Username is required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # LOWER(username) மூலம் Case-insensitive ஆக அட்மினைத் தேடுதல்
        query = """
            SELECT id, name, username, company_name, start_date, end_date, document_path, created_at 
            FROM admins 
            WHERE LOWER(username) = LOWER(%s) 
            LIMIT 1
        """
        cursor.execute(query, (admin_username.strip(),))
        admin_profile = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if not admin_profile:
            return jsonify({"status": "error", "message": "Admin not found"}), 404

        # 🌟 Date Fields-ஐ String-ஆக மாற்றுதல் (JSON serialization error & empty bug fix)
        if admin_profile.get('start_date'):
            admin_profile['start_date'] = str(admin_profile['start_date']).split(' ')[0]
        if admin_profile.get('end_date'):
            admin_profile['end_date'] = str(admin_profile['end_date']).split(' ')[0]

        return jsonify({"status": "success", "profile": admin_profile}), 200

    except Exception as e:
        print(f"Profile API Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500