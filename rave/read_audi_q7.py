import imaplib
import email
from email.header import decode_header
import re

# Setup
user = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"

try:
    # Connect
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(user, password)
    mail.select("inbox")

    # Search for "Audi Q7" in the subject or body
    status, messages = mail.search(None, '(OR SUBJECT "Audi Q7" BODY "Audi Q7")')
    
    email_ids = messages[0].split()
    
    if not email_ids:
        print("No emails found related to 'Audi Q7'")
    else:
        print(f"Found {len(email_ids)} emails related to 'Audi Q7':\n")
        # Fetch up to the last 5
        for i in email_ids[-5:]:
            status, data = mail.fetch(i, "(RFC822)")
            msg = email.message_from_bytes(data[0][1])
            subject, _ = decode_header(msg["Subject"])[0]
            if isinstance(subject, bytes):
                subject = subject.decode()
            
            print(f"Subject: {subject}")
            print(f"From: {msg['From']}")
            print("-" * 20)

    mail.close()
    mail.logout()

except Exception as e:
    print(f"Error: {e}")
