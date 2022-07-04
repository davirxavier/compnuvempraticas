const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const topic = pubsub.topic('update-covid-data-middleware');

const axios = require('axios').default;
const url = 'https://covid19.richdataservices.com/rds/api/query/int/jhu_country/select?cols=date_stamp,cnt_confirmed,cnt_death,cnt_recovered&where=(iso3166_1=CN)&format=amcharts&limit=1&orderby=date_stamp desc';

exports.helloPubSub = (event, context) => {
    axios.get(url).then(res => {
        const result = res.data.dataProvider && res.data.dataProvider.length > 0 ? res.data.dataProvider[0] : {};

        const messageObject = {
            data: {
                message: {
                    country: 'CN',
                    cases: result.cnt_confirmed,
                    deaths: result.cnt_death,
                    // population: population
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
