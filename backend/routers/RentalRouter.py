
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session
from config.database import get
import config.models as models, schemas.RentalSchema as schemas
from services import RentalService
from fastapi.logger import logger # type: ignore
import logging
logger.setLevel(logging.DEBUG)


router = APIRouter(prefix="/rentals", tags=["Rentals"])

@router.get("/", response_model=list[schemas.RentalResponse])
def get_rentals(skip: int = 0, limit: int = 10, db: Session = Depends(get)):
    return db.query(models.Rental).offset(skip).limit(limit).all()

@router.get("/{rental_id}", response_model=schemas.RentalResponse)
def get_rental(rental_id: int, db: Session = Depends(get)):
    rental = db.query(models.Rental).filter(models.Rental.rental_id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Alquiler no encontrado")
    return rental

@router.get("/rentals-by-customer/{customer_id}", response_model=list[schemas.RentalResponseByCustomer])
def get_rental_by_customer(customer_id: int, db: Session = Depends(get)):
    try:
        rentals = (
            db.query(
                models.Rental.rental_id,
                models.Rental.rental_date,
                models.Rental.return_date,
                models.Rental.customer_id,
                models.Inventory.film_id, 
            )
            .join(models.Inventory, models.Rental.inventory_id == models.Inventory.inventory_id)
            .filter(models.Rental.customer_id == customer_id)
            .all()
        )

        if not rentals:
            raise HTTPException(status_code=404, detail="Alquiler no encontrado")

        return [
            {
                "rental_id": rental.rental_id,
                "rental_date": rental.rental_date,
                "return_date": rental.return_date,
                "customer_id": rental.customer_id,
                "film_id": rental.film_id,
            }
            for rental in rentals
        ]
    except Exception as e:
        logger.error(f"Error al obtener rentals: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/", response_model=schemas.RentalResponse)
def create_rental(rental: schemas.RentalCreate, db: Session = Depends(get)): 
    return RentalService.create_rental(db, rental)

@router.put("/{rental_id}", response_model=schemas.RentalResponse)
def update_rental(rental_id: int, rental_data: schemas.RentalUpdate, db: Session = Depends(get)):
    rental = db.query(models.Rental).filter(models.Rental.rental_id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Alquiler no encontrado")

    for key, value in rental_data.dict(exclude_unset=True).items():
        setattr(rental, key, value)

    db.commit()
    db.refresh(rental)
    return rental

@router.delete("/{rental_id}")
def delete_rental(rental_id: int, db: Session = Depends(get)):
    rental = db.query(models.Rental).filter(models.Rental.rental_id == rental_id).first()
    if not rental:
        raise HTTPException(status_code=404, detail="Alquiler no encontrado")

    db.delete(rental)
    db.commit()
    return {"message": "Alquiler eliminado satisfactoriamente"}
