# Run with Docker

Remember to add `.env` file to your project. Check out `.env.sample`

`docker build -t myserver .`

`docker run -p 8000:8000 --env-file .env myserver`
