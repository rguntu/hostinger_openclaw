import smtplib
from email.message import EmailMessage
import base64
import zlib

# Mermaid Diagram Definition
mermaid_code = """
graph LR
    Client((Client)) --> Srv[Service]
    Srv -->|1. Tx| DB[(DB + Outbox)]
    DB --> Relay[Relay]
    Relay --> Brk[[Broker]]
    
    style DB fill:#f96,stroke:#333
"""

# Kroki/Mermaid expects a deflated, base64-encoded URL.
# This creates a public-facing image URL dynamically pointing to our diagram.
def get_kroki_url(diagram_code):
    data = diagram_code.encode('utf-8')
    # deflate, base64, translate to url-safe
    encoded = base64.urlsafe_b64encode(zlib.compress(data, 9)).decode('utf-8')
    return f"https://kroki.io/mermaid/svg/{encoded}"

image_url = get_kroki_url(mermaid_code)

sender = "rguntu9@gmail.com"
recipient = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"

msg = EmailMessage()
msg['Subject'] = "🛠 Architecture: Transaction Outbox Professional Render"
msg['From'] = sender
msg['To'] = recipient

html_content = f"""
<html>
<body>
    <h3>Architecture Overview: Transaction Outbox</h3>
    <p>Hi Team,</p>
    <p>Below is the architectural flow for the proposed Transaction Outbox implementation.</p>

    <!-- Professional Image Render -->
    <div style="margin: 20px 0; text-align: center;">
        <img src="{image_url}" alt="Transaction Outbox Diagram" style="max-width: 100%; border: 1px solid #ccc; border-radius: 5px;">
    </div>

    <p>This approach ensures atomicity between our database updates and message broadcasting.</p>
    <p>Best,<br>Raveendra</p>
</body>
</html>
"""

msg.add_alternative(html_content, subtype='html')

try:
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(sender, password)
    server.send_message(msg)
    server.quit()
    print("Email with professional diagram sent successfully!")
except Exception as e:
    print(f"Error: {e}")
