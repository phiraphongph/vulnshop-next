import requests
import json
import os

def send_line_push(user_id, message_text):
    # 1. Config: ใส่ Token ของคุณตรงนี้
    channel_access_token = os.environ.get("LINE_TOKEN")
    
    url = 'https://api.line.me/v2/bot/message/push'
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {channel_access_token}'
    }
    
    # 2. Payload: ข้อมูลที่จะส่ง
    payload = {
        'to': user_id,
        'messages': [
            {
                'type': 'text',
                'text': message_text
            }
            # ถ้าอยากส่งสติ๊กเกอร์เพิ่ม ให้ uncomment ด้านล่างนี้
            # ,{
            #     "type": "sticker",
            #     "packageId": "446",
            #     "stickerId": "1988"
            # }
        ]
    }

    try:
        # 3. ยิง Request (เหมือนวิธีกดปุ่ม Send)
        response = requests.post(url, headers=headers, json=payload)
        
        # เช็คผลลัพธ์
        if response.status_code == 200:
            print(f"✅ ส่งข้อความสำเร็จ! (Status: {response.status_code})")
        else:
            print(f"❌ ส่งไม่ผ่าน (Status: {response.status_code})")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"เกิดข้อผิดพลาด: {e}")

# --- ส่วนของการเรียกใช้งาน ---
if __name__ == "__main__":
    # ใส่ User ID ที่หามาได้ (Uxxxxxxxx...)
    TARGET_USER_ID = "U4e3e8a65318eff5ae3f9d64647c7e35a" 
    
    num_audit_cri = os.environ.get("AUDIT_CRITICAL", "0")
    num_audit_high = os.environ.get("AUDIT_HIGH", "0")
    MSG = f"จำนวนช่องโหว่ที่พบ:\n- Critical: {num_audit_cri}\n- High: {num_audit_high}"
    
    send_line_push(TARGET_USER_ID, MSG)