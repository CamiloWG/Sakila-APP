from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get
import config.models as models
import schemas.StoreSchema as schemas

router = APIRouter(prefix="/stores", tags=["Stores"])

@router.get("/", response_model=list[schemas.StoreBase])
def get_stores(db: Session = Depends(get)):
    return db.query(models.Store).all()
