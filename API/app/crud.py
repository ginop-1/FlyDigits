from sqlalchemy.orm import Session

from app import models, schemas

def get_test(db: Session, id: int):
	return db.query(models.Test).filter(models.Laureato.id == id).first()

def post_test(db: Session, id: schemas.TestCreate):
	db_laureato = models.Test(id=id)
	db.add(db_laureato)
	db.commit()
	db.refresh(db_laureato)
	return db_laureato

