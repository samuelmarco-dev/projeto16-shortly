CREATE DATABASE "shortly";

CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "sessions"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "userId" INTEGER REFERENCES "users"("id") NOT NULL, 
    "token" CHAR UNIQUE NOT NULL
);
