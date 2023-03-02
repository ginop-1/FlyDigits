from sqlalchemy import Column, ForeignKey, Integer, String, CHAR
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

from app.database import engine

Base = declarative_base()

class Test(Base):
    __tablename__ = "test"

    id = Column(Integer, primary_key=True)


Base.metadata.create_all(bind = engine)
