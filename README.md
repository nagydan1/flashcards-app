# Flash Cards - the vocabulary app

## Description

![Flashcards](frontend/public/flashcards.jpg)

Flashcards are a language learning method that helps memorising foreign words. One side of the cards bear the word in your native language, while the other has the translation in the language you're learning. Try to recall the translation while looking at the native side of the cards then check your solution by flipping them. Repeat iterating through your cards until you can remember every word.

Users can create and play with such cards in this application.

## Pages
1. Home
2. Register
3. Login
4. Profile
5. Manage cards
6. Play with cards

## Levels of authentication
1. Visitors can see home, register and login pages
2. Registered users can see and use the whole application after login

## Technologies

### Backend
* Node.js
* Express.js
* MongoDB
* JSON Web Token

### Frontend
* React
* Bootstrap 5

### API documentation
* OpenAPI/Swagger

### Testing
* Jest

## Installation guide
1. Create `.env.dev` file based on `.env.dev.example` in the root folder
2. Run `docker-compose build` in the root folder
3. Servers start up by running `docker-compose --env-file ./.env.dev up`
4. Load sample data into the database by running `yarn loadData` on the backend
5. Afterwards the app can be opened in a browser under http://localhost:3000/
6. The open API documentation is available under http://localhost:3030/api-docs/