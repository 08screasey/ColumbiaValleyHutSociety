import React from "react";
import NewsUpdate from "./NewsUpdate/NewsUpdate";
import "./LatestAccessUpdates.css";
import { connect } from "react-redux";

const LatestAccessUpdates = (props) => {
	const updates = props.news.slice(0, 4).map((update, key) => {
		return <NewsUpdate key={key} update={update} />;
	});

	return (
		<div className="LatestAccessUpdates Raised pt-4 pb-3">
			<h4 className="mt-3 Font3 Orange TextOutline">
				Latest News Updates{" "}
			</h4>
			<ul className="m-0 p-0">{updates}</ul>
			 <hr className="mt-0 mb-3 mx-5"/>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		news: state.news.accessUpdates,
	};
};

export default connect(mapStateToProps)(LatestAccessUpdates);
