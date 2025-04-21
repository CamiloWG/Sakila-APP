from pydantic import BaseModel
from typing import Optional
class FilmOut(BaseModel):
    film_id: int
    title: str
    description: Optional[str]
    rating: Optional[str]

    class Config:
        orm_mode = True
