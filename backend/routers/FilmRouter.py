from fastapi import APIRouter, Depends # type: ignore
from typing import List
from sqlalchemy.orm import Session
from schemas.FilmSchema import FilmSchema
from config.models import Film
from sqlalchemy.orm import Session
from config import database as db 
import config.models as models, schemas.RentalSchema as schemas
from config.database import get
from schemas.FilmOutSchema import FilmOut

router = APIRouter(prefix="/film", tags=["Peliculas"])

@router.get("/", response_model=list[FilmSchema])
def get_films(skip: int = 0, limit: int = 10, db: Session = Depends(db.get)):
    return db.query(Film).offset(skip).limit(limit).all()


@router.get("/{film_id}", response_model=FilmSchema)
def get_film_by_id(film_id: int, db: Session = Depends(db.get)):
    return db.query(Film).filter(Film.film_id == film_id).first()

@router.get("/available-films/{store_id}", response_model=List[FilmOut])
def get_available_films(store_id: int, limit: int = 10, db: Session = Depends(get)):
    # Subconsulta de inventarios actualmente rentados (sin return_date)
    rented_inventory = (
        db.query(models.Rental.inventory_id)
        .filter(models.Rental.return_date == None)
        .subquery()
    )

    # Inventarios disponibles en esa tienda
    available_inventory = (
        db.query(models.Inventory)
        .filter(
            models.Inventory.store_id == store_id,
            ~models.Inventory.inventory_id.in_(rented_inventory)
        )
        .subquery()
    )

    # Películas únicas con copias disponibles, aplicando el límite
    available_films = (
        db.query(models.Film)
        .join(available_inventory, models.Film.film_id == available_inventory.c.film_id)
        .distinct()
        .limit(limit)  # Aquí se aplica el limit
        .all()
    )

    return available_films

