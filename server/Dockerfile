FROM python:3.11-slim

WORKDIR /app

COPY . /app

RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

# Allow logging to stdout
ENV PYTHONUNBUFFERED=1

CMD ["poetry", "run", "python", "/app/api/main.py"]