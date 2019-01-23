from flask import Flask, send_from_directory, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS 
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
import datetime


basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__, static_folder='../../client/build/static')
app.config['SECRET_KEY'] = 'development key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'messages.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
socket = SocketIO(app)
CORS(app,resources={r"/*":{"origins":"*"}})
db = SQLAlchemy(app)
ma = Marshmallow(app)

@app.route('/')
def serve_static_index():
    return send_from_directory('../../client/build/', 'index.html')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(80))
    author = db.Column(db.String(120))
    body = db.Column(db.String(140))
    timeStamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __init__(self, room, author, body):
        self.room = room
        self.author = author
        self.body = body
        self.timeStamp = datetime.datetime.utcnow()

class MessageSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('room', 'author','body','timeStamp')

message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

# endpoint to create new message
@app.route("/message", methods=["POST"])
def add_message():
    room = request.json['room']
    author = request.json['author']
    body = request.json['body']
    new_message = Message(room, author, body)
    db.session.add(new_message)
    db.session.commit()
    return message_schema.jsonify(new_message)

# endpoint to show all messages
@app.route("/message", methods=["GET"])
def get_message():
    all_messages = Message.query.all()
    result = messages_schema.dump(all_messages)
    return jsonify(result.data)

# endpoint to get message detail by id
@app.route("/message/<id>", methods=["GET"])
def message_detail(id):
    message = Message.query.get(id)
    return message_schema.jsonify(message)

@socket.on('send_message')
def on_chat_sent(data):
    room = data['room']
    emit('message_sent', data, room=room)

@socket.on('broadcast_message')
def test_message(data):
    emit('message_broadcasted', data, broadcast=True)

@socket.on('connect')
def on_connect():
    print('user connected')
    retrieve_active_users()

def retrieve_active_users():
    emit('retrieve_active_users', broadcast=True)

@socket.on('activate_user')
def on_active_user(data):
    user = data.get('username')
    emit('user_activated', {'user': user}, broadcast=True)

@socket.on('deactivate_user')
def on_inactive_user(data):
    user = data.get('username')
    emit('user_deactivated', {'user': user}, broadcast=True)
    print (user, " user_deactivated")

@socket.on('join_room')
def on_join(data):
    room = data['room']
    join_room(room)
    emit('open_room', {'room': room}, broadcast=True)
    emit('roomJoined', {'room': room}, broadcast=True)