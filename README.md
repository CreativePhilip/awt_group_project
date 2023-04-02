# How to run

Build project

`docker compose -f docker-compose.yml build`

Start containers

`docker compose up`

Create superuser
`docker exec -it awt_back_django sh`
`python manage.py createsuperuser --noinput`
