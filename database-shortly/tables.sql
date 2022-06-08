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
    "userId" INTEGER REFERENCES "users"("id") NOT NULL, 
    "token" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "linksUsers"(
    "id" SERIAL PRIMARY KEY NOT NULL,
    "userId" INTEGER REFERENCES "users"("id") NOT NULL, 
    "linkId" INTEGER REFERENCES "links"("id") NOT NULL,
    "views" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "links"(
    "id" SERIAL PRIMARY KEY NOT NULL, 
    "url" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW()
);
