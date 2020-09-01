const formChecker = (form)=>{
	let valid = true;
	for(let key in form){
		if(!form[key].valid || !valid){
			valid = false
		}
	}
	return valid;
}

export default formChecker;