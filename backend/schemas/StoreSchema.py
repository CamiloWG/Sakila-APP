from pydantic import BaseModel
from datetime import datetime

class StoreBase(BaseModel):
    store_id: int
    last_update: datetime

    class Config:
        from_attributes = True
