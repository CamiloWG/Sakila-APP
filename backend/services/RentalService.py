
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func  
from sqlalchemy.orm import Session
from config.database import get
import config.models as models, schemas.RentalSchema as schemas
from datetime import datetime
import traceback

def create_rental(db: Session, rental: schemas.RentalCreate):
    try:
        existing_rental = (
            db.query(models.Rental)
            .join(models.Inventory)
            .filter(
                models.Rental.customer_id == rental.customer_id,
                models.Inventory.film_id == rental.film_id
            )
            .first()
        )

        if existing_rental:
            raise HTTPException(
                status_code=400,
                detail="El cliente ya tiene una renta activa de esta película."
            )

        # 🔍 Subquery para obtener copias NO disponibles (rentas activas)
        rentas_activas = (
            db.query(models.Rental.inventory_id)
            .filter(
                (models.Rental.return_date > rental.rental_date)
            )
            .subquery()
        )

        available_inventory = (
            db.query(models.Inventory)
            .filter(
                models.Inventory.film_id == rental.film_id,
                models.Inventory.store_id == rental.store_id,
                ~models.Inventory.inventory_id.in_(rentas_activas)
            )
            .first()
        )

        if not available_inventory:
            raise HTTPException(status_code=409, detail="No hay copias disponibles para esta película en esta tienda")

        new_rental = models.Rental(
            rental_date=rental.rental_date or datetime.now(),
            inventory_id=available_inventory.inventory_id,
            customer_id=rental.customer_id,
            return_date=rental.return_date,
            staff_id=1,
            last_update=datetime.now()
        )

        db.add(new_rental)
        db.commit()
        db.refresh(new_rental)
        return new_rental

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
