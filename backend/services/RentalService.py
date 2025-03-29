
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get
import config.models as models, schemas.RentalSchema as schemas
from datetime import datetime


def create_rental(db: Session, rental: schemas.RentalCreate):
    inv = create_inventory(rental.film_id, db)

    new_rental = models.Rental(
        rental_date=rental.rental_date,
        inventory_id=inv.inventory_id,
        customer_id=rental.customer_id,
        return_date=rental.return_date,
        staff_id=1,
        last_update=datetime.now()
    )

    db.add(new_rental)
    db.commit()
    db.refresh(new_rental)
    return new_rental

def create_inventory(film_id: int, db: Session):
    new_inventory = models.Inventory(
        film_id=film_id,
        store_id=1
    )

    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory