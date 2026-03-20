import smtplib
from email.message import EmailMessage

# Setup
user = "rguntu9@gmail.com"
password = "uiwgzolsemebwfhj" 

# Create message
msg = EmailMessage()
msg['Subject'] = "Your Daily News Feed: World & US"
msg['From'] = user
msg['To'] = user

# HTML Content with direct search links to Google News
html_content = """
<html>
<body style="font-family: sans-serif; line-height: 1.4; color: #333;">

    <h1>World News Snapshot</h1>
    <hr>
    <h3>1. UN Security Council Passes Ceasefire Resolution</h3>
    <a href="https://news.google.com/search?q=UN+Security+Council+ceasefire&hl=en-MY&gl=MY&ceid=MY:en">
        <img src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=300&fit=crop" alt="UN" style="width:100%; border-radius:8px;">
    </a>

    <h3>2. Global Markets React to Latest Inflation Data</h3>
    <a href="https://news.google.com/search?q=global+markets+inflation+data&hl=en-MY&gl=MY&ceid=MY:en">
        <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop" alt="Markets" style="width:100%; border-radius:8px;">
    </a>

    <h3>3. Tech Giants Unveil New AI Regulations</h3>
    <a href="https://news.google.com/search?q=tech+giants+AI+regulations&hl=en-MY&gl=MY&ceid=MY:en">
        <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop" alt="AI" style="width:100%; border-radius:8px;">
    </a>

    <br><br>
    <h1>US Top 3 Headlines</h1>
    <hr>
    <h3>1. U.S. Intensifies Strikes on Iranian Missile Sites</h3>
    <a href="https://news.google.com/search?q=US+strikes+Iran+missile+sites&hl=en-US&gl=US&ceid=US:en">
        <img src="https://images.unsplash.com/photo-1549449346-bf31362e0809?w=600&h=300&fit=crop" alt="Military" style="width:100%; border-radius:8px;">
    </a>

    <h3>2. Political Turmoil: NCTC Chief Resigns Over Iran War</h3>
    <a href="https://news.google.com/search?q=NCTC+chief+resigns+Iran+war&hl=en-US&gl=US&ceid=US:en">
        <img src="https://images.unsplash.com/photo-1541872784-934c5625c68b?w=600&h=300&fit=crop" alt="Politics" style="width:100%; border-radius:8px;">
    </a>

    <h3>3. Federal Reserve Holds Interest Rates Steady</h3>
    <a href="https://news.google.com/search?q=Federal+Reserve+holds+interest+rates&hl=en-US&gl=US&ceid=US:en">
        <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=300&fit=crop" alt="Economy" style="width:100%; border-radius:8px;">
    </a>

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
