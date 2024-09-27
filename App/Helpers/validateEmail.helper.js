/**
 * Function to validate email avaliable in : 
 * https://www.devmedia.com.br/validando-e-mail-em-inputs-html-com-javascript/26427
 * @param {String} field
 */
export default validateEmail = field => {
	var user = field.substring(0, field.indexOf("@"));
	var domain = field.substring(field.indexOf("@") + 1, field.length);
	if (
		field != null &&
		field != "" &&
		(user != null && user != "") &&
		(domain != null && domain != "")
	) {
		if (
			user.length >= 1 &&
			domain.length >= 3 &&
			user.search("@") == -1 &&
			domain.search("@") == -1 &&
			user.search(" ") == -1 &&
			domain.search(" ") == -1 &&
			domain.search(".") != -1 &&
			domain.indexOf(".") >= 1 &&
			domain.lastIndexOf(".") < domain.length - 1
		) {
			return true;
		} else {
			return false;
		}
	} else if (field == null || field == "") {
		return false;
	} else {
		return false;
	}
};