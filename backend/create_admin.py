from app import create_app, db
from app.models.user import User

app = create_app()

with app.app_context():
    email = "admin1@donuts.com"
    name = "Admin Principal"
    password = "admin123"

    # Vérifier s'il existe déjà
    user = User.query.filter_by(email=email).first()
    if user:
        print("⚠️ Admin existe déjà")
    else:
        admin = User(
            email=email,
            name=name,
            is_admin=True
        )
        admin.set_password(password)

        db.session.add(admin)
        db.session.commit()

        print("✅ Compte admin créé avec succès")
