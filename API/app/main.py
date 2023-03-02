from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from app.database import LocalSession, engine
from app import crud, models, schemas

app = FastAPI()

# Dependency
def get_db():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()


@app.post("/test/", response_model=schemas.Test)
def create_test(test: schemas.LaureatoCreate, db: Session = Depends(get_db)):
    # if crud.get_test(, db=db):
        # raise HTTPException(status_code=400, detail="test already registered")
    return crud.post_test(db=db, id=id)

@app.get("/test/", response_model=int)
def read_test(id = id, db: Session = Depends(get_db)):
    tests = crud.get_test(id=id, db=db)
    if tests is None:
        raise HTTPException(status_code=404, detail="test not found")
