import { AppDataSource } from "./data-source"

import express = require('express');
import {Answer} from "./entity/Answer";
import * as cors from 'cors';
const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors({credentials: true, origin: true}))

router.get('/answers', function (req, res, next) {
    console.log('Returning answers');
    AppDataSource.manager.find(Answer)
        .then(found => res.status(200).send(found.map(a => `${a.name} - Acertou ${a.get_right_answer_count()}/5`)))
        .catch(err => res.status(500).send(err));
});

router.post('/answers', function (req, res, next) {
    console.log('Saving new answer:');
    const ans = new Answer(req.body);
    console.log(ans);
    AppDataSource.manager.save(new Answer(req.body))
        .then(() => res.status(200).send())
        .catch(err => res.status(500).send(err));
});

app.use('/', router);

AppDataSource.initialize().then(async () => {
    const port = process.env.PORT || 8080;
    app.listen(port, function () {
        console.log(`app listening on port ${port}`);
    });
}).catch(error => console.log(error))
