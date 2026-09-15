from datetime import datetime
from app.extensions import db

class Vendor(db.Model):
    __tablename__ = 'vendors'

    id = db.Column(db.Integer, primary_key=True)
    vendor_code = db.Column(db.String(50), nullable=True, index=True)
    display_name = db.Column(db.String(150), nullable=False, index=True)
    contact_no = db.Column(db.String(30), nullable=False, index=True)
    email = db.Column(db.String(120), nullable=True, index=True)
    gst = db.Column(db.String(50), nullable=True)
    gst_doc = db.Column(db.String(255), nullable=True)
    irdai = db.Column(db.String(50), nullable=True)
    irdai_doc = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='Active')  # 'Active', 'Inactive'
    
    # Address Details
    billing_address = db.Column(db.Text, nullable=True)
    shipping_address = db.Column(db.Text, nullable=True)
    
    # Bank Details
    bank_name = db.Column(db.String(100), nullable=True)
    account_number = db.Column(db.String(50), nullable=True)
    ifsc_code = db.Column(db.String(30), nullable=True)
    branch = db.Column(db.String(100), nullable=True)
    account_holder = db.Column(db.String(150), nullable=True)
    
    # Others Details
    payment_terms = db.Column(db.String(100), nullable=True)
    website = db.Column(db.String(150), nullable=True)
    facebook = db.Column(db.String(150), nullable=True)
    twitter = db.Column(db.String(150), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_code': self.vendor_code or (f"VEND-{self.id:04d}" if self.id else ''),
            'display_name': self.display_name,
            'contact_no': self.contact_no,
            'email': self.email or '',
            'gst': self.gst or '',
            'gst_doc': self.gst_doc or '',
            'irdai': self.irdai or '',
            'irdai_doc': self.irdai_doc or '',
            'status': self.status or 'Active',
            'billing_address': self.billing_address or '',
            'shipping_address': self.shipping_address or '',
            'bank_name': self.bank_name or '',
            'account_number': self.account_number or '',
            'ifsc_code': self.ifsc_code or '',
            'branch': self.branch or '',
            'account_holder': self.account_holder or '',
            'payment_terms': self.payment_terms or '',
            'website': self.website or '',
            'facebook': self.facebook or '',
            'twitter': self.twitter or '',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
