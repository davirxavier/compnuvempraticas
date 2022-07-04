import {AppDataSource} from "./data-source";
import {CountryData} from "./entity/CountryData";

async function init() {
    if (!AppDataSource.isInitialized) {
        return AppDataSource.initialize().then(() => console.log('Initialized DB connection.'));
    } else {
        return Promise.resolve(undefined);
    }
}

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
export const helloPubSub = (event, context) => {
    console.log('Received new event: ', event);

    init().then(() => {
        AppDataSource.manager.save(new CountryData(event))
            .then(() => console.log('Updated country: ' + JSON.stringify(event)))
            .catch(err => console.error('Error while trying to save country: ', err));
    });
};
