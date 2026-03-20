import smtplib
from email.message import EmailMessage

# Recipient
recipient = "rguntu9@gmail.com"
sender = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj" # From your existing script

msg = EmailMessage()
msg.set_content("""Hi Team,

I've been looking into our current architecture for handling cross-service communication. To ensure stronger data consistency, I’m proposing we adopt the Transaction Outbox Pattern.

Why the shift?
We currently have a risk of race conditions where we update our primary database, but the downstream notification to the message broker fails.

The Workflow:
1. Transaction: Our services will write to a local Outbox table within the same DB transaction as the business logic.
2. Relay: A separate relay instance polls the Outbox table and pushes events to our Message Broker.
3. Delivery: This ensures at-least-once delivery, keeping our downstream services perfectly in sync.

Diagram:
Client → Service → [DB Record + Outbox Entry] → [Outbox Relay] → [Event Bridge]

I’d love to sync on a pilot for this in our next sprint. Let me know if you want to explore the implementation details!

Best,
Raveendra""")

msg['Subject'] = "🛠 Simplifying Distributed Data: The Transaction Outbox Pattern"
msg['From'] = sender
msg['To'] = recipient

try:
    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(sender, password)
    server.send_message(msg)
    server.quit()
    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")
