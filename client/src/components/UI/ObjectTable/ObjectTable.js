import React from 'react';

const ObjectTable = (props) => {
	return (<div className="w-100 pt-2">
	{Object.keys(props.object).map((key, i, arr)=>{
		return (<div className="row">
			<div className="col-6 d-flex justify-content-end"><p className="text-left DarkBlue" style={{width:"90px", fontSize:props.price && i === arr.length-1 ? "18px" : "15px"}}><strong>{key}:</strong></p></div>
			<div className="col-6"><p className="w-100 text-left" style={{fontSize:props.price && i === arr.length-1 ? "18px" : "15px"}}>{props.object[key]}</p></div>
			</div>)
	})}
</div>)
};

export default ObjectTable ;