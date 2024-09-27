import Model from "react-native-models";

/**
 * Reference: https://www.npmjs.com/package/react-native-models
 */
export default class User extends Model{

    /**
     * get Model's Name
     */
    static get className(){
        return "Marker";
    }

    /**
     * Constructor passing the name of the variables with their respective default value
     * creating the SET and GET Methods.
     * @param {Number} id 
     * @param {String} title 
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {String} image
     */
    constructor(id = 0, title = "", latitude = 0, longitude = 0, image = ""){
        
        /**
         * Create the Model Variables with Set and Get methods
         */
        super({
            id: "Number", title: "String", latitude: "Number", longitude: "Number", image: "String"
        });

        this.initializeModel(id, title, latitude, longitude, image);
    }

    /**
     * 
     * @param {Number} id 
     * @param {String} title
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {String} image
     */
    initializeModel(id, title, latitude, longitude, image) {

        if((id !== undefined) && (id !== null)){
            this.setId(id);
        }
        if((title !== undefined) && (title !== null)){
            this.setTitle(title);
        }
        if((latitude !== undefined) && (latitude !== null)){
            this.setLatitude(latitude);
        }
        if((longitude !== undefined) && (longitude !== null)){
            this.setLongitude(longitude);
        }
        if((image !== undefined) && (image !== null)){
            this.setImage(image);
        }
    }

    /**
     * Clear all information of Model.
     */
    clearModel (){

        this.setId(0);
        this.setTitle("");
        this.setLatitude(0);
        this.setLongitude(0);
        this.setImage("");
        
    }
}