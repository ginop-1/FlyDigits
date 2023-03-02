import pymysql
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

mysql_host = os.environ.get('MYSQL_HOST')

engine = create_engine(f'mysql+pymysql://dbuser:fermi@{mysql_host}:3306/test')

LocalSession = sessionmaker(autocommit = False, autoflush = False, bind = engine)
