from datetime import datetime
from app.extensions import db

class BookingOrder(db.Model):
    __tablename__ = 'booking_orders'

    id = db.Column(db.Integer, primary_key=True)
    booking_no = db.Column(db.String(30), unique=True, nullable=False, index=True)
    booking_date = db.Column(db.String(20), nullable=False, default='12-08-2026')
    
    # Customer Details
    customer_name = db.Column(db.String(120), nullable=False, index=True)
    father_or_spouse_name = db.Column(db.String(120), nullable=True) # S/O
    contact_number = db.Column(db.String(20), nullable=False, index=True)
    alt_contact_number = db.Column(db.String(20), nullable=True)
    
    # Address Details
    flat_house_no = db.Column(db.String(100), nullable=True)
    street_area = db.Column(db.String(200), nullable=True)
    town_city = db.Column(db.String(100), nullable=True)
    pincode = db.Column(db.String(20), nullable=True)
    state = db.Column(db.String(100), nullable=False, default='TAMIL NADU')
    
    # Vehicle Details
    model_name = db.Column(db.String(150), nullable=False)
    color = db.Column(db.String(80), nullable=True)
    variant = db.Column(db.String(80), nullable=True)
    expected_delivery_date = db.Column(db.String(20), nullable=True)
    
    # Pricing & Payment
    total_amount = db.Column(db.Float, default=0.0)
    booking_amount = db.Column(db.Float, default=0.0)
    balance_amount = db.Column(db.Float, default=0.0)
    payment_mode = db.Column(db.String(50), default='CASH')
    
    # Executive & Notes
    sales_executive = db.Column(db.String(100), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), default='Confirmed')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_no': self.booking_no,
            'booking_date': self.booking_date,
            'customer_name': self.customer_name,
            'father_or_spouse_name': self.father_or_spouse_name,
            'contact_number': self.contact_number,
            'alt_contact_number': self.alt_contact_number,
            'flat_house_no': self.flat_house_no,
            'street_area': self.street_area,
            'town_city': self.town_city,
            'pincode': self.pincode,
            'state': self.state,
            'model_name': self.model_name,
            'color': self.color,
            'variant': self.variant,
            'expected_delivery_date': self.expected_delivery_date,
            'total_amount': self.total_amount,
            'booking_amount': self.booking_amount,
            'balance_amount': self.balance_amount,
            'payment_mode': self.payment_mode,
            'sales_executive': self.sales_executive,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
