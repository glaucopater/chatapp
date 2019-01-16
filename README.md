# ChatApp
---
A simple chat application that features a python backend side, React on frontend side and Socket.io for communication.

![ChatApp Demo](/chatapp.jpg)

# Backend
---
The backend side is made in Python with Flask and SqlAlchemy to manage the database (Sqlite3) and a simple api rest for limited CRUD actions.
On the same endpoint is running also the socket io host, this could be moved to another host for scalability.

# Frontend
---
In Frontend side a react app, with sass, proptypes and cookie management. The cookie is used to simulate an user session.
The components are managing a login process, the chatroom and the message and.
For semplicity at the moment there is only one chatroom, but this can be extended easily.
Messages are presented as required in chronological order, with distinction for the current user message.
I have added a check in order to let unique user at once.
In case of connection error the client is able to render a diffent component.

# Open points / nice to have / proposals
---
* Auth token and users stored in the db
* Https 
* Client side syncronization: this is anche idea I had during the first commits. In order to simulate a local db I used localStorage. At the same time It can be used to have a small PWA keeping the message for the user when there is no connection.

It has been tested in desktop and mobile, Windows,Gnu/Linux and Mac. And also running in AWS. 


## How to Start:
1. Verify that you have NPM, Python3, and Pip installed (inside the server folder there is a requirements.txt for this)


**1. Start the Flask Backend server:**

```bash
$ cd server/server
$ export FLASK_DEBUG=True
$ export FLASK_APP=server
$ flask run
```
This will start up a Flask server at default `http://localhost:5000`.

Database
---
There is already a prepared sqlite3 database of messages in order to test, otherwise to create a new fresh database run:

```bash
$ cd server/server
$ python setup_database.py
```

**2. Start the React development server:**
```bash
$ cd client
$ npm start
```
This will startup a React development server at `http://localhost:3000`.

**3. Visit `http://localhost:3000` in your browser to view the application.**