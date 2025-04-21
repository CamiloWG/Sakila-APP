from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, DECIMAL, Enum, Text
from sqlalchemy.orm import relationship

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Language(Base):
    __tablename__ = "language"
    language_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), nullable=False)

    films = relationship("Film", back_populates="language")

class Film(Base):
    __tablename__ = "film"
    film_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text)
    release_year = Column(Integer)
    language_id = Column(Integer, ForeignKey("language.language_id"))
    rental_duration = Column(Integer)
    rental_rate = Column(DECIMAL(4, 2))
    rating = Column(Enum("G", "PG", "PG-13", "R", "NC-17"))

    language = relationship("Language", back_populates="films")

class Customer(Base):
    __tablename__ = "customer"

    customer_id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, nullable=False)
    first_name = Column(String(45), nullable=False)
    last_name = Column(String(45), nullable=False)
    email = Column(String(50), nullable=True)
    address_id = Column(Integer, ForeignKey("address.address_id"), nullable=False)
    active = Column(Boolean, default=True)
    create_date = Column(DateTime, nullable=False)
    last_update = Column(DateTime, nullable=True)

    #address = relationship("Address") 


class Rental(Base):
    __tablename__ = "rental"

    rental_id = Column(Integer, primary_key=True, index=True)
    rental_date = Column(DateTime, nullable=False)
    inventory_id = Column(Integer, ForeignKey("inventory.inventory_id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customer.customer_id"), nullable=False)
    return_date = Column(DateTime, nullable=True)
    staff_id = Column(Integer, ForeignKey("staff.staff_id"), nullable=False)
    last_update = Column(DateTime, nullable=False)

    customer = relationship("Customer")
    inventory = relationship("Inventory")
    staff = relationship("Staff")


class Staff(Base):
    __tablename__ = "staff"

    staff_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    address_id = Column(Integer, ForeignKey("address.address_id"), nullable=False)
    email = Column(String(100), nullable=True)
    store_id = Column(Integer, nullable=False)
    active = Column(Integer, nullable=False)
    username = Column(String(50), nullable=False)
    password = Column(String(50), nullable=True)
    last_update = Column(String(50), nullable=False)

class Store(Base):
    __tablename__ = "store"

    store_id = Column(Integer, primary_key=True, index=True)
    manager_staff_id = Column(Integer, ForeignKey("staff.staff_id"))
    address_id = Column(Integer, ForeignKey("address.address_id"))
    last_update = Column(DateTime, nullable=False)

    # Relaciones (opcional pero útil)
    staff = relationship("Staff")

class Inventory(Base):
    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True, index=True)
    film_id = Column(Integer, ForeignKey("film.film_id"), nullable=False)
    store_id = Column(Integer, nullable=False)