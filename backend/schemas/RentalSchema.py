from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RentalBase(BaseModel):
    rental_date: datetime
    inventory_id: Optional[int] = None
    customer_id: int
    return_date: Optional[datetime] = None
    staff_id: Optional[int] = None
    last_update: Optional[datetime] = None

class RentalCreate(BaseModel):
    rental_date: Optional[datetime] = None
    customer_id: int
    film_id: int
    store_id: int
    return_date: Optional[datetime] = None

class RentalUpdate(BaseModel):
    return_date: Optional[datetime] = None

class RentalResponse(RentalBase):
    rental_id: int

    class Config:
        from_attributes = True  

class RentalResponseByCustomer(BaseModel):
    rental_date: datetime
    return_date: datetime
    customer_id: int
    film_id: int
    rental_id: int
