# sample FASTAPI Dockerfile
FROM python:3.9.15-slim-bullseye

# set work directory
WORKDIR /app

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

ENV MYSQL_HOST = "mysql_host"

# copy project
COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]