const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic('update-covid-data-middleware');

const axios = require('axios').default;
const url = 'https://api.brasil.io/dataset/covid19/caso/data/';
const token = '51404cfb7eb0f47c7a1aa3b77293bca6b56cefd4';

exports.helloPubSub = (event, context) => {
    axios.get(url, {headers: {'Authorization': 'Token ' + token}}).then(res => {
        let arr = [];
        const results = res.data.results;
        if (results) {
            results.filter(r => r.city == null).forEach(r => {
               if (!arr.find(es => es.state == r.state)) {
                   arr.push(r);
               }
            });
        }

        const population = arr.reduce((prev, curr) => prev + curr.estimated_population, 0);
        const totalConfirmed = arr.reduce((prev, curr) => prev + curr.confirmed, 0);
        const totalDeaths = arr.reduce((prev, curr) => prev + curr.deaths, 0);

        const messageObject = {
            data: {
                message: {
                    country: 'BR',
                    cases: totalConfirmed,
                    deaths: totalDeaths,
                    population: population
                },
            },
        };

        const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');
        try {
            topic.publish(messageBuffer)
                .then(() => console.log('Update event sent.'))
                .catch(err => console.error('Error while sending update event: ', err));
        } catch (err) {
            console.error(err);
        }
    }).catch(err => console.error('Error while fetching data: ', err));
};
