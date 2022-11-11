module.exports = {
    app_port: process.env.APP_PORT,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT
    },
    listPerPage: process.env.LISTPERPAGE
}