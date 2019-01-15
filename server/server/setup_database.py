#this will create sqlite database messages.sqlite
import flask
from messages_database import db 
db.create_all()