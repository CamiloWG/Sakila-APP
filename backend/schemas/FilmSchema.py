from pydantic import BaseModel
from typing import Optional

class LanguageSchema(BaseModel):
    language_id: int
    name: str

class FilmSchema(BaseModel):
    film_id: int
    title: str
    description: Optional[str] = None
    release_year: int
    language_id: int
    rental_duration: int
    rental_rate: float
    rating: str

    class Config:
        from_attributes = True
