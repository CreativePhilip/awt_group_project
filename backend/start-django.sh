#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

echo "### STARTING DJANGO DEVELOPMENT SERVER ###"

echo "### Making migrations..."
python manage.py makemigrations

echo "### Migrating..."
python manage.py migrate

echo "### Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "### Seeding the database..."
# python manage.py loaddata db_seed.json

echo "### Starting django runtime..."
python manage.py runserver 0.0.0.0:80
