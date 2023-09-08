const express = require( "express" );
const mongoose = require( "mongoose" );
const dotenv = require( "dotenv" );
const helmet = require( "helmet" );
const morgan = require( "morgan" );

const userRoute = require( './routes/users' );
const authRoute = require( './routes/auth' );

dotenv.config();

const app = express();

// Middleware
app.use( express.json() );
app.use( helmet() );
app.use( morgan( "common" ) );

app.use( "/api/users", userRoute );
app.use( "/api/auth", authRoute );

mongoose.connect( process.env.MONGO_URL ).then( () => console.log( 'Connected Mongo' ) ).
    catch( error => console.log( error ) );

app.listen( 8000, () => {
    console.log( 'Server is ready' )
} )