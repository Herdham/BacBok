#!/usr/bin/env bash
<<<<<<< HEAD

# Exit immediately if any command exits with a non-zero status
set -o errexit

echo "Installing requirements..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running database migrations..."
=======
# exit on error
set -o errexit


python -m pip install --upgrade pip
pip install -r requirements.txt

cd bacbok

python manage.py collectstatic --no-input
>>>>>>> 652dfae96142b5b8b09eba057f6727f806ccb18a
python manage.py migrate