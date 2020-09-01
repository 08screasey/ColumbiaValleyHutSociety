import React from 'react';
import {connect} from 'react-redux';

const AdminUsers = (props) => {
	return (<div>
	I am the AdminUsers component
</div>)
};

const mapStateToProps = state => {
	return {}
};

const mapDispatchToProps = dispatch => {
	return {

	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers)