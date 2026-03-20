import smtplib
from email.message import EmailMessage

# Setup
user = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"  # Your App Password

# Create message
msg = EmailMessage()
msg.set_content("This is your test email sent directly from Python!")
msg['Subject'] = "Test Email from OpenClaw"
msg['From'] = user
msg['To'] = user

# Send
try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(user, password)
        smtp.send_message(msg)
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
