# Prairie and Tree Planting Tool

An application to assist Iowan landowners to blueprint prairie and tree planting initiatives.

## Dependencies

This project requires [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/). 

## Setup

Install modules:    
`yarn`

Create a copy of the env file:    
`cp .env.base .env`    
Fill out environmental variables in `.env` using your keys. **Don't fill out `.env.base` because we want to keep api keys from being committed.**

## Build
`npm run build`
This will produce `bundle.js` and `bundle.js.map` in `./public`.

## Local Hot-reloading Server
`npm run serve`
This will serve `./public` at `localhost:8080`.

## Host
Serve `./public` as static files.

## Miscellaneous

To convert Excel columns to CSV to JSON array, use the following tools:
http://www.convertcsv.com/transpose-csv.htm
https://onlinecsvtools.com/convert-csv-to-json

Uncheck first row is column name.
Use tab as field separator.

For JSON dictionaries:
https://shancarter.github.io/mr-data-converter/