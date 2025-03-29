from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.FilmSchema import FilmSchema
from config.models import Film
from sqlalchemy.orm import Session
from config import database as db 

router = APIRouter(prefix="/film", tags=["Peliculas"])

@router.get("/", response_model=list[FilmSchema])
def get_films(skip: int = 0, limit: int = 10, db: Session = Depends(db.get)):
    return db.query(Film).offset(skip).limit(limit).all()


@router.get("/{film_id}", response_model=FilmSchema)
def get_film_by_id(film_id: int, db: Session = Depends(db.get)):
    return db.query(Film).filter(Film.film_id == film_id).first()
