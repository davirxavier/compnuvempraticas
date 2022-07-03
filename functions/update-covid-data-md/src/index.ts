import {AppDataSource} from "./data-source";
import {CountryData} from "./entity/CountryData";

const init = async () => {
    if (!AppDataSource.isInitialized) {
        return AppDataSource.initialize();
    } else {
        return Promise.resolve();
    }
};

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
export const helloPubSub = (event, context): Promise<any> => {
    console.log(typeof event)
    return init().then(() => AppDataSource.manager.find(CountryData)).then(res => {
       console.log(res);
    });
};
