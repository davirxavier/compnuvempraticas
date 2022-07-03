const Knex = require("knex");

const createTcpPool = async () => {
    // Extract host and port from socket address
    const dbSocketAddr = process.env.DB_HOST.split(':'); // e.g. '127.0.0.1:5432'

    // Establish a connection to the database
    return Knex({
        client: 'pg',
        connection: {
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            host: dbSocketAddr[0],
            port: dbSocketAddr[1],
        },
        pool: { min: 0, max: 5 }
    });
};

let conn = undefined;
async function getConn() {
    if (!conn) {
        conn = await createTcpPool();
    }

    return conn;
}

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.helloPubSub = (event, context) => {
    getConn().then(conn => console.log(conn))
};
