from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import SessionLocal
from config.models import Customer
from schemas.CustomerSchema import CustomerResponse


def get_customers(skip, limit, db):
    return db.query(Customer).offset(skip).limit(limit).all()


def get_customer_by_id(db, customer_id):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return customer


