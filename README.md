# Docs

## Run with Docker

Remember to add `.env` file to your project. Check out `.env.sample` in `server`

`docker build -t myserver .`

`docker run -p 8000:8000 --env-file .env myserver`

## CORS Error Fix For Files Access on Google Storage bucket

To fix cors error when trying to view pdf

make a file called `cors.json`

```json
[
    {
      "origin": ["*"],
      "method": ["GET"],
      "maxAgeSeconds": 3600
    }
  ]
```

and run `gsutil cors set cors.json gs://storageBucketId`

See this [stackoverflow post](https://stackoverflow.com/questions/37760695/firebase-storage-and-access-control-allow-origin) for more info about this issue
