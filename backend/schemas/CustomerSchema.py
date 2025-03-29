from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CustomerBase(BaseModel):
    store_id: int
    first_name: str
    last_name: str
    email: Optional[str] = None
    address_id: int
    active: bool
    create_date: datetime

class CustomerCreate(CustomerBase):
    pass 

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    active: Optional[bool] = None

class CustomerResponse(CustomerBase):
    customer_id: int

    class Config:
        from_attributes = True  
