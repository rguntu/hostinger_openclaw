import smtplib
from email.message import EmailMessage
import base64

# Simple SVG for Transaction Outbox
svg_code = """
<svg width="400" height="80" xmlns="http://www.w3.org/2000/svg">
  <rect x="5" y="20" width="60" height="40" fill="#f0f0f0" stroke="#333"/>
  <text x="35" y="45" font-size="12" text-anchor="middle">Client</text>
  <path d="M65 40 L85 40" stroke="#333" marker-end="url(#arrowhead)"/>
  
  <rect x="90" y="20" width="70" height="40" fill="#f0f0f0" stroke="#333"/>
  <text x="125" y="45" font-size="12" text-anchor="middle">Service</text>
  <path d="M160 40 L180 40" stroke="#333" marker-end="url(#arrowhead)"/>
  
  <rect x="185" y="20" width="100" height="40" fill="#ffcc99" stroke="#333"/>
  <text x="235" y="45" font-size="12" text-anchor="middle">DB + Outbox</text>
  <path d="M285 40 L305 40" stroke="#333" marker-end="url(#arrowhead)"/>
  
  <rect x="310" y="20" width="70" height="40" fill="#f0f0f0" stroke="#333"/>
  <text x="345" y="45" font-size="12" text-anchor="middle">Relay</text>
  
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
    </marker>
  </defs>
</svg>
"""

# Base64 encode the SVG
b64_svg = base64.b64encode(svg_code.encode('utf-8')).decode('utf-8')
data_uri = f"data:image/svg+xml;base64,{b64_svg}"

sender = "rguntu9@gmail.com"
recipient = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"

msg = EmailMessage()
msg['Subject'] = "🛠 Architecture: Transaction Outbox (Fixed Diagram)"
msg['From'] = sender
msg['To'] = recipient

html_content = f"""
<html>
<body>
    <h3>Architecture Overview</h3>
    <p>The diagram below is embedded directly into this email. It should render immediately without loading external resources.</p>
    
    <div style="margin: 20px 0;">
        <img src="{data_uri}" alt="Diagram">
    </div>
    
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
    print("Email with embedded diagram sent!")
except Exception as e:
    print(f"Error: {e}")
