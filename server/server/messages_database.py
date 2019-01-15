from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
import datetime

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'messages.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)

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
        self.timeStamp = datetime.datetime.now()

class MessageSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('room', 'author','body','timeStamp')

message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

# endpoint to get user detail by id
@app.route("/user/<id>", methods=["GET"])
def user_detail(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

# endpoint to create new user
@app.route("/message", methods=["POST"])
def add_message():
    room = request.json['room']
    author = request.json['author']
    body = request.json['body']
    new_message = Message(room, author, body)
    db.session.add(new_message)
    db.session.commit()
    return message_schema.jsonify(new_message)

# endpoint to show all users
@app.route("/message", methods=["GET"])
def get_message():
    all_messages = Message.query.all()
    result = messages_schema.dump(all_messages)
    return jsonify(result.data)

# endpoint to get user detail by id
@app.route("/message/<id>", methods=["GET"])
def message_detail(id):
    message = Message.query.get(id)
    return message_schema.jsonify(user)

if __name__ == '__main__':
    app.run(debug=True)