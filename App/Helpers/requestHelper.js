import * as constants from "../Util/Constants";
import { handlerException } from "../Services/Exception";
/**
 * Check ride status
 * @param {object} request
 */
export const checkRequestStatus = request =>
{
    var status = 0

    if ( request.is_cancelled == 1 ) {
        status = constants.NO_REQUEST
        return status
    }

    if ( request.is_completed )
        status = constants.IS_REQUEST_COMPLETED
    else if ( request.is_started )
        status = constants.IS_REQUEST_STARTED
    else if ( request.is_provider_arrived )
        status = constants.IS_PROVIDER_ARRIVED
    else if ( request.is_provider_started )
        status = constants.IS_PROVIDER_STARTED
    else if ( request.confirmed_provider != 0 )
        status = constants.PROVIDER_ACCEPTED_JOB

    return status
}

/**
 * Format time to string with hours or min
 * @param {float} num
 */
export const timeConvert = num =>
{
    num = Math.ceil(num)
    var hours = Math.floor(num / 60)
    var minutes = num % 60
    minutes = (hours==0 && minutes==0) ? 1 : minutes

    hours = hours > 0 ? `${hours}hours ` : ''
    minutes = minutes > 0 ? `${minutes}min` : ''

    return `${hours}${minutes}`
}

/**
 * Format polyline
 * @param {Array} polyline
 */
export const convertPolyline = polyline =>
{
    try {
        let data = [];
        if (typeof polyline == 'object')
            if (polyline.length > 0) {
                for (let index = 0; index < polyline.length; index++) {
                    const element = polyline[index];
                    data.push({
                        latitude: element.lat,
                        longitude: element.lng
                    });
                }
            }

        return data;
    } catch (error) {
      handlerException('requestHelper.convertPolyline', error);
      return [];
    }
}
