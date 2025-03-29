import os

from sqlalchemy import create_engine
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

db_username = "admin"
db_password = "admin123"
db_enlace = "sakiladb.c7miawmimhak.us-east-1.rds.amazonaws.com"
db_name = "sakila"

DB_URL = f"mysql+pymysql://{db_username}:{db_password}@{db_enlace}:3306/{db_name}"

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()