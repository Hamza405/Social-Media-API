const mongoose = require( "mongoose" );
const dotenv = require( "dotenv" );

dotenv.config();

const mongooseConnect = () => {
    return mongoose
        .connect( process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true } )
        .then( () => console.log( "Database Connected" ) )
        .catch( ( err ) => console.log( err ) );
};

exports.mongooseConnect = mongooseConnect;