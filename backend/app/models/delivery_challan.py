from datetime import datetime
from app.extensions import db

class DeliveryChallan(db.Model):
    __tablename__ = 'delivery_challans'

    id = db.Column(db.Integer, primary_key=True)
    dc_number = db.Column(db.String(30), unique=True, nullable=False, index=True)
    order_date = db.Column(db.String(20), nullable=False, default='12-08-2026')
    expected_shipment_date = db.Column(db.String(20), nullable=False, default='12-08-2026')
    sales_type = db.Column(db.String(50), nullable=False, default='GST')
    reference_no = db.Column(db.String(50), nullable=True)
    customer_name = db.Column(db.String(120), nullable=False, index=True)
    customer_phone = db.Column(db.String(20), nullable=True)
    customer_address = db.Column(db.String(255), nullable=True)
    product_name = db.Column(db.String(150), nullable=True)
    quantity = db.Column(db.Integer, default=1)
    engine_number = db.Column(db.String(80), nullable=True)
    chassis_number = db.Column(db.String(80), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    delivery_terms = db.Column(db.Text, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='Delivered')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'dc_number': self.dc_number,
            'order_date': self.order_date,
            'expected_shipment_date': self.expected_shipment_date,
            'sales_type': self.sales_type,
            'reference_no': self.reference_no,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'customer_address': self.customer_address,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'engine_number': self.engine_number,
            'chassis_number': self.chassis_number,
            'color': self.color,
            'delivery_terms': self.delivery_terms,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
