FROM python:3.11-slim

WORKDIR /app


COPY . /app
RUN pip install poetry && \
    poetry config virtualenvs.create true && \
    poetry install --no-dev

# Allow logging to stdout
ENV PYTHONUNBUFFERED=1

CMD ["poetry", "run", "start"]