import React from "react";
import NavItem from "./NavItem/NavItem";
import "./NavItems.css";
import { connect } from "react-redux";
const NavItems = (props) => {
	const dropChildren = [{
						link:"/account-info", name:"Account Info"
					},
						{link:"/logout", name:"Logout"}
						];
if(props.admin){
	dropChildren.unshift({link:"/admin", name:"Admin"})
}

	return (
		<ul className="NavItems d-flex p-1 flex-column align-items-center justify-content-around">
			<NavItem link="/">
				<span onClick={props.clicked}>Home</span>
			</NavItem>
			<hr />
			<NavItem link="/updates">
				<span onClick={props.clicked}>Important Access Updates</span>
			</NavItem>
			<hr />
			<NavItem
				link="/huts"
				clicked={props.clicked}
				dropdown
				dropdownChildren={[
					{ link: "/huts/jumbo", name: "Jumbo Pass Cabin" },
					{ link: "/huts/olive", name: "Olive Hut" },
					{ link: "/huts/kingsbury", name: "Kingsbury Pass Cabin" },
					{ link: "/huts/david-white", name: "David White Cabin" },
					{ link: "/huts/mcmurdo", name: "McMurdo Cabin" },
				]}
			>
				The Huts
			</NavItem>
			<hr />
			<NavItem link="/reservations">
				<span onClick={props.clicked}>Make A Reservation</span>
			</NavItem>
			<hr />
			<NavItem link="/rules-amenities">
				<span onClick={props.clicked}>Rules & Amenities</span>
			</NavItem>
			<hr />
			{props.authenticated ? 
				(
				<React.Fragment>
					<NavItem  
					clicked={props.clicked} 
					dropdown 
					dropdownChildren={dropChildren}>
						{props.name ? props.name : "Logout"}
					</NavItem>
					<hr />
				</React.Fragment>
			) : (
				<React.Fragment>
					<NavItem link="/login">
						<span onClick={props.clicked}>Login/Signup</span>
					</NavItem>
					<hr />
				</React.Fragment>
			)}
			<NavItem link="/contact">
				<span onClick={props.clicked}>Contact</span>
			</NavItem>
		</ul>
	);
};

const mapStateToProps = (state) => {
	return {
		authenticated: state.auth.token !== null,
		name:state.auth.userData.firstName,
		admin:state.auth.userData.admin
	};
};

export default connect(mapStateToProps)(NavItems);
