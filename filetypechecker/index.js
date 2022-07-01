const mb = require('magic-bytes.js');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket(process.env.BUCKET_NAME);

async function readAll(stream) {
    const chunks = [];
    for await (let chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.helloWorld = (req, res) => {
    if (!req.body || !req.body.data) {
        res.status(400).send();
        return;
    }

    if (req.body.isBucketFile) {
        const file = bucket.file(req.body.data);
        const stream = file.createReadStream({start: 0, end: 3});
        readAll(stream)
            .then(fetched => {
                res.status(200).send(mb.filetypeinfo(fetched));
            })
            .catch(err => {
                console.error(err);
                res.status(500).send(err);
            });
    } else {
        res.status(200).send(mb.filetypeinfo(req.body.data));
    }
};
