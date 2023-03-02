from pydantic import BaseModel

class Test(BaseModel):
	id: int

class TestCreate(BaseModel):
	cod_ateneo: int
	cod_corso: int
	genere: str
	num_laureati: int