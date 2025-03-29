from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get
import config.models as models, schemas.CustomerSchema as schemas

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=list[schemas.CustomerResponse])
def get_customers(skip: int = 0, limit: int = 10, db: Session = Depends(get)):
    return db.query(models.Customer).offset(skip).limit(limit).all()

@router.get("/{customer_id}", response_model=schemas.CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get)):
    customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return customer

@router.post("/", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get)):
    new_customer = models.Customer(**customer.dict())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.put("/{customer_id}", response_model=schemas.CustomerResponse)
def update_customer(customer_id: int, customer_data: schemas.CustomerUpdate, db: Session = Depends(get)):
    customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    for key, value in customer_data.dict(exclude_unset=True).items():
        setattr(customer, key, value)

    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get)):
    customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    db.delete(customer)
    db.commit()
    return {"message": "Cliente eliminado satisfactoriamente"}
