import React, { useState, useEffect, useRef } from "react";
import Hamburger from "../Hamburger/Hamburger";
import NavItems from "../NavItems/NavItems";
import Logo from "../../UI/Logo/Logo";

import "./Toolbar.css";

const Toolbar = (props) => {
	const [active, setActive] = useState(false);
	useEffect(() => {
		window.addEventListener("scroll", (e) => {
			if (
				window.pageYOffset >
					navBar.current.getBoundingClientRect().height &&
				!navBar.current.classList["Scrolling"]
			) {
				navBar.current.classList.add("Scrolling");
			} else if (
				window.pageYOffset <=
					navBar.current.getBoundingClientRect().height &&
				navBar.current.classList.contains("Scrolling")
			) {
				navBar.current.classList.remove("Scrolling");
			} else {
				return;
			}
		});
	}, []);

	const navBar = useRef();
	const handleSetActive = () => {
		setActive(!active);
	};
	return (
		<nav
			ref={navBar}
			className="Toolbar px-3 d-flex justify-content-between align-items-center"
		>
			{/*<Logo />*/}
			<Hamburger clicked={handleSetActive} active={active}>
				<NavItems clicked={handleSetActive} />
			</Hamburger>
		</nav>
	);
};

export default Toolbar;
