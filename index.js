const express = require( "express" );
const mongoose = require( "mongoose" );
const dotenv = require( "dotenv" );
const helmet = require( "helmet" );
const morgan = require( "morgan" );

dotenv.config();

const app = express();
mongoose.connect( process.env.MONGO_URL ).then( () => console.log( 'Connected Mongo' ) ).
    catch( error => console.log( error ) );

app.listen( 8000, () => {
    console.log( 'Server is ready' )
} )