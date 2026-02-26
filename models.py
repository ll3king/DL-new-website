from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(50), nullable=False)  # 'form', 'messenger'
    customer_name = db.Column(db.String(100), nullable=True)
    guests_count = db.Column(db.Integer, default=1)
    time_slot = db.Column(db.DateTime, nullable=True) # Requested appointment time
    booking_time = db.Column(db.DateTime, default=datetime.utcnow) # When booking was made
    details = db.Column(db.Text, nullable=True) # JSON string or plain text
    status = db.Column(db.String(20), default='new')

    def to_dict(self):
        return {
            'id': self.id,
            'source': self.source,
            'customer_name': self.customer_name,
            'guests_count': self.guests_count,
            'time_slot': self.time_slot.isoformat() if self.time_slot else None,
            'booking_time': self.booking_time.isoformat(),
            'details': self.details,
            'status': self.status
        }
