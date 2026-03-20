import imaplib
import email
from email.header import decode_header

# Setup
user = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj"

try:
    # Connect to IMAP server
    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    mail.login(user, password)
    
    # Select INBOX
    mail.select("inbox")
    
    # Search for unread emails
    status, messages = mail.search(None, "UNSEEN")
    
    # Get the last 3 messages (if any)
    email_ids = messages[0].split()
    latest_ids = email_ids[-3:]
    
    for i in latest_ids:
        # Fetch email by ID
        status, data = mail.fetch(i, "(RFC822)")
        
        for response_part in data:
            if isinstance(response_part, tuple):
                msg = email.message_from_bytes(response_part[1])
                subject, encoding = decode_header(msg["Subject"])[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else "utf-8")
                
                print(f"--- Email ---")
                print(f"Subject: {subject}")
                print(f"From: {msg['From']}")
                print("-------------")
    
    mail.close()
    mail.logout()

except Exception as e:
    print(f"Error accessing Gmail: {e}")
