import {AppDataSource} from "./data-source";
import {CountryData} from "./entity/CountryData";

const init = async () => {
    if (!AppDataSource.isInitialized) {
        return AppDataSource.initialize();
    } else {
        return Promise.resolve();
    }
};

init().then();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
export const helloPubSub = (event, context) => {
    console.log(typeof event)
    AppDataSource.manager.find(CountryData).then(res => {
       console.log(res);
    });
};
