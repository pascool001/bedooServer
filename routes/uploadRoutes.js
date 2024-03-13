const HyperExpress = require('hyper-express');

const mongoose = require('mongoose');

const grid = require('gridfs-stream');

const media_api_router = new HyperExpress.Router()

const MEDIA_API_PREFIX = process.env.MEDIA_API_PREFIX

const {upload} = require('../middlewares')

const {authenticate} = require('../middlewares')

let gfs, gridfsBucket;

(() => {
  mongoose.connection.on("connected", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
  });
})();


const getFileStreaming = async (filename, res) => {
        const file = await gfs.files.findOne({ filename });
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(res);
}

const getFileToBase64 = async (filename, res) => {
    const file = await gfs.files.findOne({ filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    const bufs = []
    readStream.on('data', (chunk) => {
        bufs.push(chunk)
    })
    let base64;
    readStream.on('end', () => {
        const fbuf = Buffer.concat(bufs);
        base64 = fbuf.toString('base64');
        return res.json({data: base64})
    });

}


media_api_router.use(`${MEDIA_API_PREFIX}/upload`, upload().single("file"))

media_api_router.route(`${MEDIA_API_PREFIX}/upload`).post(async (request, response) => {
    try {
        // await getFileStreaming(request.file.filename, response)
        await getFileToBase64(request.file.filename, response)
        // const file = await gfs.files.findOne({ filename: request.file.filename });
        // const readStream = gridfsBucket.openDownloadStream(file._id);
        // readStream.pipe(response);
    } catch (error) {
        response.json({message: error.message});
    }
})

// ----------------------Pour test d'application de multiple Middlewares
const specific_middleware1 = (request, response, next) => {
    console.log('route specific middleware 1 ran!');
    return next();
};

const specific_middleware2 = (request, response, next) => {
    console.log('route specific middleware 2 ran!');
    return next();
};
// --------------------------------------------------------------------------

media_api_router.route(`${MEDIA_API_PREFIX}/download/:filename`).get({
    middlewares: [specific_middleware1, specific_middleware2]
}, async (request, response) => {
    let filename = request.path_parameters.filename
    try {
        //  await getFileStreaming(filename, response)
         await getFileToBase64(filename, response)
    } catch (error) {
        response.json({message: error.message});
    }
})


module.exports = media_api_router