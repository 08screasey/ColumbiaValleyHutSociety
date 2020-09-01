import React from "react";
import OpacityAnimation from "../UI/OpacityAnimation/OpacityAnimation";

const RuleList = (props) => {
	const rules = props.rules.map((rule, index) => {
		return (
			<li key={index}>
				<OpacityAnimation>
					<p className="ml-3 my-0">{rule}</p>
				</OpacityAnimation>
			</li>
		);
	});

	let rulesList = <ul className="text-left">{rules}</ul>;
	if (props.ordered) {
		rulesList = <ol className="text-left">{rules}</ol>;
	}

	return (
		<React.Fragment>
			<div className="my-3 mx-auto" style={{width:"100%", maxWidth:"500px"}}>
				<h3 className="Blue Font3">{props.header}</h3>
				<p>{props.text}</p>
				{rulesList}
			</div>
		</React.Fragment>
	);
};

export default RuleList;
