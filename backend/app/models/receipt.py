from datetime import datetime
from app.extensions import db

class Receipt(db.Model):
    __tablename__ = 'receipts'

    id = db.Column(db.Integer, primary_key=True)
    receipt_no = db.Column(db.String(20), unique=True, nullable=False, index=True)
    account_code = db.Column(db.String(50), nullable=True)
    customer_name = db.Column(db.String(120), nullable=False, index=True)
    receipt_date = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False, default=0.0)
    payment_type = db.Column(db.String(50), nullable=False, default='CASH')
    note = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='active')  # 'active', 'cancelled'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'receipt_no': self.receipt_no,
            'account_code': self.account_code,
            'customer_name': self.customer_name,
            'receipt_date': self.receipt_date,
            'amount': self.amount,
            'payment_type': self.payment_type,
            'note': self.note,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
