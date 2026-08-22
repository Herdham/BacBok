#!/usr/bin/env bash
set -o errexit

python -m pip install --upgrade pip
pip install -r requirements.txt

cd bacbok

python manage.py collectstatic --noinput --verbosity 2
python manage.py migrate