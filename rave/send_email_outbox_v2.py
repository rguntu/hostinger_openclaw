import smtplib
from email.message import EmailMessage

sender = "rguntu9@gmail.com"
recipient = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"

msg = EmailMessage()
msg['Subject'] = "🛠 Simplifying Distributed Data: The Transaction Outbox Pattern"
msg['From'] = sender
msg['To'] = recipient

html_content = """
<html>
<body>
    <h3>Simplifying Distributed Data: The Transaction Outbox Pattern</h3>
    <p>Hi Team,</p>
    <p>Below is the architectural flow for the Transaction Outbox pattern.</p>

    <div style="font-family: sans-serif; padding: 20px;">
        <table style="border-collapse: collapse; text-align: center;">
            <tr>
                <td style="border: 2px solid #555; padding: 10px; border-radius: 5px;">Client</td>
                <td>&rarr;</td>
                <td style="border: 2px solid #555; padding: 10px; border-radius: 5px;">Service</td>
                <td>&rarr;</td>
                <td style="border: 2px solid #3366cc; padding: 10px; border-radius: 5px; background: #eef;">[DB Record + Outbox Entry]</td>
                <td>&rarr;</td>
                <td style="border: 2px solid #555; padding: 10px; border-radius: 5px;">Outbox Relay</td>
                <td>&rarr;</td>
                <td style="border: 2px solid #555; padding: 10px; border-radius: 5px;">Event Bridge</td>
            </tr>
        </table>
        <p style="font-size: 0.8em; color: #666;">* Local Transaction guarantees atomicity</p>
    </div>

    <p>I’d love to sync on a pilot for this in our next sprint. Let me know if you want to explore the implementation details!</p>
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
    print("Email with HTML diagram sent successfully!")
except Exception as e:
    print(f"Error: {e}")
