#!/usr/bin/env bash
# exit on error
set -o errexit


python -m pip install --upgrade pip
pip install -r requirements.txt

cd bacbok

python manage.py collectstatic --noinput
python manage.py migrate