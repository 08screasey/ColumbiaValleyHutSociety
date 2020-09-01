const checkValidity = (rules, target, form) => {
		if (rules.required && target.value.trim().length < 1) {
			return false;
		}
		if (rules.minLength && target.value.trim().length < rules.minLength) {
			return false;
		}
		if (rules.passwordMatch && target.value !== form.password.value) {
			return false;
		}
		if (rules.name && target.value.split("").length < 1) {
			return false;
		}
		if (rules.maxLength && target.value.trim().length > rules.maxLength){
			return false
		}
		if (rules.phone && !target.value.match(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)){
			return false
		}
		if (
			rules.email &&
			!target.value.match(/(?!.*\.\.)(^[^\.][^@\s]+@[^@\s]+\.[^@\s\.]+$)/)
		) {
			return false;
		} else {
			return true;
		}
	};

	export default checkValidity;