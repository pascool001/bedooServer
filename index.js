const HyperExpress = require('hyper-express');
const webserver = new HyperExpress.Server()
const { sse } = require('./middlewares')
require('dotenv').config()
const port = process.env.SERVER_PORT;
const root_api_prefix = process.env.ROOT_API_PREFIX
const cors = require('cors')
/// ---user for SSE ---------------------------
// const crypto = require('crypto');
// const sse_streams = {};
/// --------------------------------
const {connectDB} = require('./database/mongodb/connection')
// connection de la base de données
connectDB()

const {auth_api_router, upload_api_router, todo_api_router} = require('./routes')

// webserver.hosts.add('localhost',{});
webserver.use(cors({}))

webserver.get('/', (request, response) => {
    response.json({'message': 'hello World !!!'})
})


webserver.use(sse())

webserver.get(`${root_api_prefix}/sse`, (request, response) => {
    response.initStream()
})


webserver.use(`${root_api_prefix}`, auth_api_router);

webserver.use(`${root_api_prefix}`, upload_api_router);

webserver.use(`${root_api_prefix}`, todo_api_router);




webserver.listen(port || 5000, 'localhost').then(() => {
    
    console.log(`Webserver started on port ${port}`)
})
.catch(err => console.log('Failed to start webserver'))