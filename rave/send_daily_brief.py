import smtplib
from email.message import EmailMessage

# Setup
user = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"  # Your App Password

# Create message
msg = EmailMessage()
msg['Subject'] = "Your Daily Brief"
msg['From'] = user
msg['To'] = user

# HTML Content
html_content = """
<html>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">

    <h1>Daily Brief AI</h1>
    <hr>

    <h2>Traffic Management for Aidilfitri in Malaysia</h2>
    <img src="https://via.placeholder.com/600x300?text=Malaysia+Traffic+Management" alt="Malaysia traffic management">
    <p>Authorities have ramped up efforts to manage the expected surge in traffic as citizens travel home for Aidilfitri. The Works Ministry and highway operators have deployed Emergency Response Teams (ERTs) at strategic locations to ensure smoother travel and prompt assistance for motorists.</p>
    <a href="https://www.bernama.com">Read more</a>

    <h2>Pos Malaysia Imposes New Fuel Surcharge</h2>
    <img src="https://via.placeholder.com/600x300?text=Pos+Malaysia+Logistics" alt="Pos Malaysia delivery vehicle">
    <p>Pos Malaysia has officially announced an implementation of a 15% to 40% fuel surcharge on postal services to mitigate rising operational costs. This adjustment aims to ensure the sustainability of logistics networks across the region amidst volatile fuel pricing.</p>
    <a href="https://www.freemalaysiatoday.com">Read more</a>

    <h2>Medical Graduate Placement Disparities</h2>
    <img src="https://via.placeholder.com/600x300?text=Medical+Graduates+Malaysia" alt="Medical graduates in Malaysia">
    <p>Recent data reveals a stark gap in the medical sector, with only 529 out of 5,000 housemanship slots filled by recent graduates. Health officials are reviewing current placement protocols to address the under-utilization of these critical healthcare training positions.</p>
    <a href="https://codeblue.galencentre.org">Read more</a>

    <h2>Quote of the Day</h2>
    <blockquote>
        "The secret of getting ahead is getting started." — Mark Twain
    </blockquote>

    <h2>Tip of the Day</h2>
    <p><strong>Tip:</strong> If you are planning a long drive for the holidays, perform a "T-CLOC" check (Tires, Controls, Lights, Oil, Chassis) on your vehicle today to prevent avoidable highway breakdowns.</p>

    <footer style="margin-top: 30px; font-size: 0.8em; color: #777;">
        Sent by Daily Brief AI
    </footer>

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
