import Model from "react-native-models";

/**
 * Reference: https://www.npmjs.com/package/react-native-models
 */
export default class Provider extends Model {

    /**
     * get Model's Name
     */
    static get className() {
        return "Provider";
    }

    /**
     * Constructor passing the name of the variables with their respective default value
     * creating the SET and GET Methods.
     * @param {Number} id
     * @param {String} first_name
     * @param {String} last_name
     * @param {String} phone
     * @param {String} email
     * @param {String} bio
     * @param {String} address
     * @param {String} state
     * @param {String} country
     * @param {String} zipcode
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {Number} type
     * @param {Number} category_id
     * @param {String} car_model
     * @param {String} car_number
     * @param {String} car_brand
     * @param {Number} bearing
     * @param {Number} types
     * @param {Number} review
     * @param {Number} servicesProvided
     * @param {Number} time
     * @param {Number} distance
     * @param {Number} estimatedPrice
     * @param {Number} picture
     * @param {String} register_step
     * @param {Array} provider_type
     * @param {String} gender
     * @param {String} token
     * @param {String} birth
     * @param {Number} number
     * @param {String} complement
     * @param {String} neighborhood
     * @param {String} city
     * @param {String} indication_code
     * @param {Array} certificates
     * @param {String} type_titular
     * @param {String} type_account
     * @param {Number} bank
     * @param {String} account
     * @param {Number} account_digit
     * @param {String} agency
     * @param {Number} agency_digit
     * @param {String} account_titular
     * @param {String} document_bank
     * @param {String} birthday_bank
     * @param {Array} docs
     * @param {Number} amount
     * @param {Number} earned
     * @param {Number} spent
     * @param {Number} is_active
     * @param {Number} is_available
     * @param {Number} is_approved
     * @param {String} status_id
     * @param {String} is_txt_approved
     * @param {Number} receiving_request
     * @param {Number} waiting_docs
     * @param {Number} rate
     * @param {Number} rate_count
     * @param {Number} completed_rides
     * @param {Number} cancelated_rides
     * @param {Number} ledger
     */
    constructor(id = 0, first_name = "", last_name = "", phone = "", email = "", bio = "", address = "",
        state = "", country = "", zipcode = "", latitude = "", longitude = "0.00", type = 0, category_id = 0,
        car_model = "", car_number = "", car_brand = "", bearing = 0.00, types = [], review = 0.00, servicesProvided = 0,
        time = 0, distance = 0, estimatedPrice = 0, picture = "", register_step = "", provider_type = [], gender = "male", token = "",
        birth = '00/00/00', number = 0, complement = "", neighborhood = "", city = "", indication_code = "", certificates = [],
        type_titular = "", type_account = "", bank = 0, account = "", account_digit = 0, agency = "", agency_digit = 0, account_titular = "",
        document_bank = "", birthday_bank = '00/00/00', docs = [], amount = 0.00, earned = 0.00, spent = 0.00, is_active = 0, is_available = 0,
        is_approved = 0, status_id = "", is_txt_approved = "", receiving_request = 0, waiting_docs = 0, rate = 0, rate_count = 0, completed_rides = 0.00,
        cancelated_rides = 0.00, ledger = 0
    ) {

        /**
         * Create the Model Variables with Set and Get methods
         */
        super({
            id: "Number", first_name: "String", last_name: "String", phone: "String", email: "String",
            bio: "String", address: "String", state: "String", country: "String", zipcode: "String",
            latitude: "String", longitude: "String", type: "Number", category_id: "Number",
            car_model: "String", car_number: "String", car_brand: "String", bearing: "Number", types: "Array", review: "Number",
            servicesProvided: "Number", time: "Number", distance: "Number", estimatedPrice: "Number", picture: "String", register_step: "String", provider_type: "Array", gender: "String", token: "String",
            birth: "String", number: "Number", complement: "String", neighborhood: "String", city: "String", indication_code: "String", certificates: "Array",
            type_titular: "String", type_account: "String", bank: "Number", account: "String", account_digit: "Number", agency: "String", agency_digit: "Number", account_titular: "String",
            document_bank: "String", birthday_bank: "String", docs: "Array", amount: "Number", earned: "Number", spent: "Number", is_active: "Number", is_available: "Number", is_approved: "Number",
            status_id: "String", is_txt_approved: "String", receiving_request: "Number", waiting_docs: "Number", rate: "Number", rate_count: "Number", completed_rides: "Number", cancelated_rides: "Number", ledger: "Number"
        });

        this.initializeModel(id, first_name, last_name, phone, email, bio, address, state, country, zipcode,
            latitude, longitude, type, category_id, car_model, car_number, car_brand, bearing, types, review, servicesProvided,
            time, distance, estimatedPrice, picture, register_step, provider_type, gender, token, birth,
            number, complement, neighborhood, city, indication_code, certificates, type_titular, type_account, bank,
            account, account_digit, agency, agency_digit, account_titular, document_bank, birthday_bank, docs,
            amount, earned, spent, is_active, is_available, is_approved, status_id, is_txt_approved, receiving_request, waiting_docs,
            rate, rate_count, completed_rides, cancelated_rides, ledger
        );
    }

    /**
     *
     * @param {Number} id
     * @param {String} first_name
     * @param {String} last_name
     * @param {String} phone
     * @param {String} email
     * @param {String} bio
     * @param {String} address
     * @param {String} state
     * @param {String} country
     * @param {String} zipcode
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {Number} type
     * @param {Number} category_id
     * @param {String} car_model
     * @param {String} car_number
     * @param {String} car_brand
     * @param {Number} bearing
     * @param {Number} types
     * @param {Number} review
     * @param {Number} servicesProvided
     * @param {Number} time
     * @param {Number} distance
     * @param {Number} estimatedPrice
     * @param {Number} picture
     * @param {String} register_step
     * @param {Array} provider_type
     * @param {String} gender
     * @param {String} token
     * @param {String} birth
     * @param {Number} number
     * @param {String} complement
     * @param {String} neighborhood
     * @param {String} city
     * @param {String} indication_code
     * @param {Array} certificates
     * @param {String} type_titular
     * @param {String} type_account
     * @param {Number} bank
     * @param {String} account
     * @param {Number} account_digit
     * @param {String} agency
     * @param {Number} agency_digit
     * @param {String} account_titular
     * @param {String} document_bank
     * @param {String} birthday_bank
     * @param {Array} docs
     * @param {Number} amount
     * @param {Number} earned
     * @param {Number} spent
     * @param {Number} is_active
     * @param {Number} is_available
     * @param {Number} is_approved
     * @param {String} is_txt_approved
     * @param {Number} receiving_request
     * @param {Number} waiting_docs
     * @param {Number} rate_count
     * @param {Number} completed_rides
     * @param {Number} cancelated_rides
     * @param {Number} status_id
     * @param {Number} ledger
     */
    initializeModel(id, first_name, last_name, phone, email, bio, address, state, country, zipcode,
        latitude, longitude, type, category_id, car_model, car_number, car_brand, bearing, types, review, servicesProvided,
        time, distance, estimatedPrice, picture, register_step, provider_type, gender, token, birth, number,
        complement, neighborhood, city, indication_code, certificates, type_titular, type_account, bank,
        account, account_digit, agency, agency_digit, account_titular, document_bank, birthday_bank, docs, amount, earned, spent,
        is_active, is_available, is_approved, status_id, is_txt_approved, receiving_request, waiting_docs, rate, rate_count, completed_rides, cancelated_rides, ledger) {

        if ((id !== undefined) && (id !== null)) {
            this.setId(id);
        }
        if ((first_name !== undefined) && (first_name !== null)) {
            this.setFirst_name(first_name);
        }
        if ((last_name !== undefined) && (last_name !== null)) {
            this.setLast_name(last_name);
        }
        if ((phone !== undefined) && (phone !== null)) {
            this.setPhone(phone);
        }
        if ((email !== undefined) && (email !== null)) {
            this.setEmail(email);
        }
        if ((bio !== undefined) && (bio !== null)) {
            this.setBio(bio);
        }
        if ((address !== undefined) && (address !== null)) {
            this.setAddress(address);
        }
        if ((state !== undefined) && (state !== null)) {
            this.setState(state);
        }
        if ((country !== undefined) && (country !== null)) {
            this.setCountry(country);
        }
        if ((zipcode !== undefined) && (zipcode !== null)) {
            this.setZipcode(zipcode);
        }
        if ((latitude !== undefined) && (latitude !== null)) {
            this.setLatitude(latitude);
        }
        if ((longitude !== undefined) && (longitude !== null)) {
            this.setLongitude(longitude);
        }
        if ((type !== undefined) && (type !== null)) {
            this.setType(type);
        }
        if ((category_id !== undefined) && (category_id !== null)) {
            this.setCategory_id(category_id);
        }
        if ((car_model !== undefined) && (car_model !== null)) {
            this.setCar_model(car_model);
        }
        if ((car_number !== undefined) && (car_number !== null)) {
            this.setCar_number(car_number);
        }
        if ((car_brand !== undefined) && (car_brand !== null)) {
            this.setCar_brand(car_brand);
        }
        if ((bearing !== undefined) && (bearing !== null)) {
            this.setBearing(bearing);
        }
        if ((types !== undefined) && (types !== null)) {
            this.setTypes(types);
        }
        if ((review !== undefined) && (review !== null)) {
            this.setReview(review);
        }
        if ((servicesProvided !== undefined) && (servicesProvided !== null)) {
            this.setServicesProvided(servicesProvided);
        }
        if ((time !== undefined) && (time !== null)) {
            this.setTime(time);
        }
        if ((distance !== undefined) && (distance !== null)) {
            this.setDistance(distance);
        }
        if ((estimatedPrice !== undefined) && (estimatedPrice !== null)) {
            this.setEstimatedPrice(estimatedPrice);
        }
        if ((picture !== undefined) && (picture !== null)) {
            this.setPicture(picture);
        }
        if ((register_step !== undefined) && (register_step !== null)) {
            this.setRegister_step(register_step);
        }
        if ((provider_type !== undefined) && (provider_type !== null)) {
            this.setProvider_type(provider_type);
        }
        if ((gender !== undefined) && (gender !== null)) {
            this.setGender(gender);
        }
        if ((token !== undefined) && (token !== null)) {
            this.setToken(token);
        }
        if ((birth !== undefined) && (birth !== null)) {
            this.setBirth(birth);
        }
        if ((number !== undefined) && (number !== null)) {
            this.setNumber(number);
        }
        if ((complement !== undefined) && (complement !== null)) {
            this.setComplement(complement);
        }
        if ((neighborhood !== undefined) && (neighborhood !== null)) {
            this.setNeighborhood(neighborhood);
        }
        if ((city !== undefined) && (city !== null)) {
            this.setCity(city);
        }
        if ((indication_code !== undefined) && (indication_code !== null)) {
            this.setIndication_code(indication_code);
        }
        if ((certificates !== undefined) && (certificates !== null)) {
            this.setCertificates(certificates);
        }
        if ((type_titular !== undefined) && (type_titular !== null)) {
            this.setType_titular(type_titular);
        }
        if ((type_account !== undefined) && (type_account !== null)) {
            this.setType_account(type_account);
        }
        if ((bank !== undefined) && (bank !== null)) {
            this.setBank(bank);
        }
        if ((account !== undefined) && (account !== null)) {
            this.setAccount(account);
        }
        if ((account_digit !== undefined) && (account_digit !== null)) {
            this.setAccount_digit(account_digit);
        }
        if ((agency !== undefined) && (agency !== null)) {
            this.setAgency(agency);
        }
        if ((agency_digit !== undefined) && (agency_digit !== null)) {
            this.setAgency_digit(agency_digit);
        }
        if ((account_titular !== undefined) && (account_titular !== null)) {
            this.setAccount_titular(account_titular);
        }
        if ((document_bank !== undefined) && (document_bank !== null)) {
            this.setDocument_bank(document_bank);
        }
        if ((birthday_bank !== undefined) && (birthday_bank !== null)) {
            this.setBirthday_bank(birthday_bank);
        }
        if ((docs !== undefined) && (docs !== null)) {
            this.setDocs(docs);
        }
        if ((amount !== undefined) && (amount !== null)) {
            this.setAmount(amount);
        }
        if ((earned !== undefined) && (earned !== null)) {
            this.setEarned(earned);
        }
        if ((spent !== undefined) && (spent !== null)) {
            this.setSpent(spent);
        }
        if ((is_active !== undefined) && (is_active !== null)) {
            this.setIs_active(is_active);
        }
        if ((is_available !== undefined) && (is_available !== null)) {
            this.setIs_available(is_available);
        }
        if ((is_approved !== undefined) && (is_approved !== null)) {
            this.setIs_approved(is_approved);
        }
        if ((is_txt_approved !== undefined) && (is_txt_approved !== null)) {
            this.setIs_txt_approved(is_txt_approved);
        }
        if ((receiving_request !== undefined) && (receiving_request !== null)) {
            this.setReceiving_request(receiving_request);
        }
        if ((waiting_docs !== undefined) && (waiting_docs !== null)) {
            this.setWaiting_docs(waiting_docs);
        }
        if ((status_id !== undefined) && (status_id !== null)) {
            this.setStatus_id(status_id);
        }
        if ((rate !== undefined) && (rate !== null)) {
            this.setRate(rate);
        }
        if ((rate_count !== undefined) && (rate_count !== null)) {
            this.setRate_count(rate_count);
        }
        if ((completed_rides !== undefined) && (completed_rides !== null)) {
            this.setCompleted_rides(completed_rides);
        }
        if ((cancelated_rides !== undefined) && (cancelated_rides !== null)) {
            this.setCancelated_rides(cancelated_rides);
        }
        if ((ledger !== undefined) && (ledger !== null)) {
            this.setLedger(ledger);
        }
    }

    /**
     * Clear all information of Model.
     */
    clearModel() {

        this.setId(0);
        this.setFirst_name('');
        this.setLast_name('');
        this.setPhone('');
        this.setEmail('');
        this.setBio('');
        this.setAddress('');
        this.setState('');
        this.setCountry('');
        this.setZipcode('');
        this.setLatitude('');
        this.setLongitude('');
        this.setType(0);
        this.setCategory_id(0);
        this.setCar_model('');
        this.setCar_number('');
        this.setCar_brand('');
        this.setBearing(0.00);
        this.setTypes([]);
        this.setReview(0.00);
        this.setServicesProvided(0);
        this.setTime(0);
        this.setDistance(0);
        this.setEstimatedPrice(0.00);
        this.setPicture('');
        this.setRegister_step('');
        this.setProvider_type([]);
        this.setGender("male");
        this.setToken('');
        this.setBirth("00/00/00");
        this.setNumber(0);
        this.setComplement('');
        this.setNeighborhood('');
        this.setCity('');
        this.setIndication_code('');
        this.setCertificates([]);
        this.setType_titular('');
        this.setType_account('');
        this.setBank(0);
        this.setAccount('');
        this.setAccount_digit(0);
        this.setAgency('');
        this.setAgency_digit(0);
        this.setAccount_titular('');
        this.setDocument_bank('');
        this.setBirthday_bank('');
        this.setDocs([]);
        this.setAmount(0);
        this.setEarned(0);
        this.setSpent(0);
        this.setIs_active(0);
        this.setIs_available(0);
        this.setIs_approved(0);
        this.setIs_txt_approved('');
        this.setReceiving_request(0);
        this.setWaiting_docs(0);
        this.setRate(0);
        this.setRate_count(0);
        this.setCompleted_rides(0);
        this.setCancelated_rides(0);
        this.setStatus_id('');
        this.setLedger(0);
    }
}
