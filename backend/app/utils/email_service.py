import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

def send_order_notification(order_id, total_amount, notify_email, customer_email=None):
    """
    Envoyer une notification email quand une nouvelle commande est reçue
    """
    try:
        # Configuration SMTP (Gmail example - à adapter selon votre provider)
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', 587))
        sender_email = os.getenv('SMTP_EMAIL')
        sender_password = os.getenv('SMTP_PASSWORD')
        
        if not sender_email or not sender_password:
            print("⚠️ Variables SMTP_EMAIL ou SMTP_PASSWORD non configurées")
            return False
        
        # Créer le message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"🍩 Nouvelle Commande #{order_id} - Chez Hadjo"
        message["From"] = sender_email
        message["To"] = notify_email
        
        # Corps du message HTML
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #800000;">🍩 Nouvelle Commande Reçue!</h2>
                
                <p><strong>Numéro de commande:</strong> #{order_id}</p>
                <p><strong>Montant:</strong> {total_amount} FCFA</p>
                <p><strong>Date:</strong> {__import__('datetime').datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                
                <hr style="border: 1px solid #800000;">
                
                <p>Une nouvelle commande a été reçue sur votre site Chez Hadjo.</p>
                <p>Veuillez vous connecter à votre admin pour voir les détails.</p>
                
                <p>👉 <a href="http://localhost:8000/admin.html" style="color: #800000;">Voir la commande</a></p>
                
                <hr>
                <p style="font-size: 12px; color: #666;">
                    Chez Hadjo - Restaurant de Donuts 🍩
                </p>
            </body>
        </html>
        """
        
        part = MIMEText(html, "html")
        message.attach(part)
        
        # Envoyer l'email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, notify_email, message.as_string())
        
        print(f"✅ Email envoyé à {notify_email} pour la commande #{order_id}")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi d'email: {str(e)}")
        return False
