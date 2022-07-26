This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Project Stack:
- NEXT ( react )
- MongoDB
- Vercel ( Deploy )

We've used NEXT for an easy backend monolith because this is a small project, but he's a great choice for bff for his optimized security and deploy/render velocity. For the database we used mongo for the same reasons, as he's easy to deploy and is great for bigger and small project alike.

The database is used to save created users and to save the leaderboard's scores for both users and guests.

## How to Access the Game

To acces the game first you have to create a user or login as a guest on the app, you can do this by following the steps presented on the main page of the application.

To create a user you must enter you name, a country and password, which is saved on our database to fill the leaderboard after you complete the game loop.

## Gameplay

As you login the game will start, you can move your spaceship with the `arrow buttons` and shoot with `spacebar`, you have 3 lives and earn 10 score for each enemy's spaceship you bring down, after losing all lives you
are redirected to the leaderboard, which saves all users.