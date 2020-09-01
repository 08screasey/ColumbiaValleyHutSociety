import React from "react";
import Toolbar from "../../components/navigation/Toolbar/Toolbar";
import Footer from "../../components/Footer/Footer";
const Layout = (props) => {
	return (
		<React.Fragment>
			<Toolbar />
			<main>{props.children}</main>
			<Footer />
		</React.Fragment>
	);
};

export default Layout;
