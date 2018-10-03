/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');

// Initialise postgres client
const config = {
    user: 'chrisssy',
    host: '127.0.0.1',
    database: 'pokemons',
    port: 5432,
};

if (config.user === 'ck') {
    throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function(err) {
    console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

const getRoot = (request, response) => {
    // query database for all pokemon

    // respond with HTML page displaying all pokemon
    //
    const queryString = 'SELECT * from pokemon;';
    pool.query(queryString, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            console.log('Query result:', result);

            // redirect to home page
            response.render('pokemon/home', { pokemon: result.rows });
        }
    });
}

const getNew = (request, response) => {
    response.render('pokemon/new');
}

const findWhoCaught = async function(id) {
    var userCaptured = [];
    let text = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME like 'caught'`;
    pool.query(text, (err, res) => {
        if(err) {
            console.log('Error: ', err);
        } else {
            let rows = res.rows;
            for ( let i = 0; i < rows.length; i++ ) {
                let text = `SELECT caught FROM ${rows[i].table_name} WHERE caught > 0 AND id = ${id}`;
                pool.query(text, (error, result) => {
                    if (error) {
                        console.log('Error', error);
                    } else {
                        console.log("THING IM TRYING", result.rows);
                        userCaptured.push(res.rows);
                    }
                })
            }
        }
    });

};

const getPokemon = (request, response) => {
    let id = request.params['id'];

    findWhoCaught(id);

    const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
    pool.query(queryString, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {

            // redirect to home page
            response.render('pokemon/pokemon', { pokemon: result.rows[0] });
        }
    });
}

const postPokemon = (request, response) => {
    let params = request.body;

    const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);';
    const values = [params.name, params.height];

    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.log('query error:', err.stack);
        } else {
            console.log('query result:', result);

            // redirect to home page
            response.redirect('/');
        }
    });
};

const editPokemonForm = (request, response) => {
    let id = request.params['id'];
    const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
    pool.query(queryString, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            console.log('Query result:', result);

            // redirect to home page
            response.render('pokemon/edit', { pokemon: result.rows[0] });
        }
    });
}

const updatePokemon = (request, response) => {
    let id = request.params['id'];
    let pokemon = request.body;
    const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
    const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
    console.log(queryString);
    pool.query(queryString, values, (err, result) => {
        if (err) {
            console.error('Query error:', err.stack);
        } else {
            console.log('Query result:', result);

            // redirect to home page
            response.redirect('/');
        }
    });
}

const deletePokemonForm = (request, response) => {
    response.send("COMPLETE ME");
}

const deletePokemon = (request, response) => {
    response.send("COMPLETE ME");
}
/**
 * ===================================
 * User
 * ===================================
 */

const newDex = function(username) {
    for (i = 0; i < 151; i++) {
        let text = `INSERT INTO "${username}" (caught) VALUES ('0')`;
        pool.query(text);
    };
};

const userNew = (request, response) => {
    response.render('users/new');
}

const allUsers = (request, response) => {
    let text = `SELECT * FROM Users ORDER BY id ASC`;

    pool.query(text, (err, res) => {
        if(err){
            console.log('Error: ', err);
        }
        response.render('users/allusers', {users: res.rows});
    })
}

const userCreate = (request, response) => {

    let username = request.body.name;
    const queryString = `CREATE TABLE "${username}" (id SERIAL PRIMARY KEY, caught INTEGER)`;

    pool.query(queryString, (err, result) => {

        if (err) {
            console.log('Query error:', err.stack);
            if ( err.stack.includes('already exists') ) {
                response.send('Username taken, please choose another name!');
            } else response.send('Did not work');
        } else {
            newDex(username);

            let text = `INSERT INTO users (name) VALUES ('${username}')`;

            pool.query(text);

            let textall = `SELECT * FROM Users ORDER BY id ASC`;

            pool.query(textall, (err, res) => {
                if(err){
                    console.log('Error: ', err);
                }
                response.render('users/allusers', {users: res.rows});
            });
        }
    })
}

const singleUser = (request, response) => {

    let username = request.params.username;

    let text = `SELECT pokemon.id, caught, pokemon.name, pokemon.img FROM ${username} INNER JOIN pokemon on ${username}.id = pokemon.id`;

    pool.query(text, (err, res) => {
        if(err) {
            console.log('Error: ', err);
        } else response.render('users/singleuser', {user: res.rows});
    });
};

const capture = (request, response) => {
    if( request.query._method == 'PUT' && request.query.id != undefined ) {

        let text =  `SELECT caught FROM ${request.params.username} WHERE id = ${request.query.id}`;

        pool.query(text, (err, res) => {
            if(err) {
                console.log('Error: ', err);
            } else {
            let caught = res.rows[0].caught;

            let caughtPlus = parseInt(caught) + 1;

            let text = `UPDATE ${request.params.username} SET caught = ${caughtPlus} WHERE id = ${request.query.id}`;

            pool.query(text);

            };
        });
            let username = request.params.username;

            let text1 = `SELECT pokemon.id, caught, pokemon.name, pokemon.img FROM ${username} INNER JOIN pokemon on ${username}.id = pokemon.id`;

            pool.query(text1, (err, res) => {
                if(err) {
                    console.log('Error: ', err);
                } else response.render('users/singleuser', {user: res.rows});
            });
    }
}

const allPokemon = (request, response) => {
    let text = `SELECT * FROM pokemon ORDER BY id ASC`;

    pool.query(text, (err, res) => {
        if(err) {
            console.log('Error: ', err);
        } else {
            console.log(res.rows);
            response.render('pokemon/allpokemon', {pokemon: res.rows} )
        }
    })
}



/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);
app.get('/pokemon', allPokemon)

app.get('/users/new', userNew);
app.post('/users', userCreate);

app.get('/users', allUsers);

app.get('/users/:username', singleUser);
app.put('/users/:username', capture)


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
    console.log('Recalling all ships to harbour...');
    server.close(() => {
        console.log('... all ships returned...');
        pool.end(() => {
            console.log('... all loot turned in!');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);