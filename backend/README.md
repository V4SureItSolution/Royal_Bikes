# RoyalBikes Backend REST API

Python Flask REST API backend for the RoyalBikes management application.

## Directory Structure

```text
backend/
├── app/
│   ├── models/
│   │   ├── user.py
│   │   ├── product.py
│   │   └── customer.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── user_routes.py
│   │   ├── product_routes.py
│   │   └── customer_routes.py
│   ├── uploads/
│   └── __init__.py
├── migrations/
├── uploads/
├── .gitignore
├── config.py
├── README.md
├── requirements.txt
└── run.py
```

## Running Backend Server

```bash
pip install -r requirements.txt
python run.py
```
The Flask application starts on `http://127.0.0.1:5000/api`.
