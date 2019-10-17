# Simple Note App Api

A simple note app api that created with nodejs and express and fully tested with jest.

## Installation

1. clone the project
2. go to project folder
3. install npm dependencies with running ```npm install```
4. you need to install **mongo** as db for the project (prefer to install it with docker)
    - docker run --name mongo -p 27017:27017 -d mongo:tag
5. run the app with ```npm run start```
6. to run the test cases use ```npm run test```

### Endpoints

#### Auth

- Register user with email, password, name
- Get JWT token

#### Note

- Create note with title and content
- Update note title and content
- Delete note 
- Get list of all notes