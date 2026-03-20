import smtplib
from email.message import EmailMessage

# Setup
user = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"  # Your App Password

# Create message
msg = EmailMessage()
msg['Subject'] = "Your Daily News Snapshot"
msg['From'] = user
msg['To'] = user

# HTML Content (Minimalist)
html_content = """
<html>
<body style="font-family: sans-serif; line-height: 1.4; color: #333;">

    <h1>Daily News Snapshot</h1>
    <hr>
    
    <h3>1. Traffic Management for Aidilfitri in Malaysia</h3>
    <img src="https://via.placeholder.com/600x300?text=Malaysia+Traffic+Management" alt="Traffic" style="width:100%; border-radius:8px;">

    <h3>2. Pos Malaysia Imposes New Fuel Surcharge</h3>
    <img src="https://via.placeholder.com/600x300?text=Pos+Malaysia+Logistics" alt="Delivery" style="width:100%; border-radius:8px;">

    <h3>3. Medical Graduate Placement Disparities</h3>
    <img src="https://via.placeholder.com/600x300?text=Medical+Graduates+Malaysia" alt="Medical" style="width:100%; border-radius:8px;">

</body>
</html>
"""

msg.add_alternative(html_content, subtype='html')

# Send
try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(user, password)
        smtp.send_message(msg)
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
