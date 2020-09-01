import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
	return (
		<section id="footer" className="DarkBlue-BG ">
			<div className="container">
				<div className="row text-center text-xs-center text-sm-left text-md-left">
					<div className="col-xs-12 col-sm-4 col-md-4">
						<h5 className="Orange">Reservations</h5>
						<ul className="list-unstyled quick-links">
							<li>
								<Link to="/reservations">
									<i className="fa fa-angle-double-right"></i>
									Book a Cabin
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-xs-12 col-sm-4 col-md-4">
						<h5 className="Orange">Quick links</h5>
						<ul className="list-unstyled quick-links">
							<li>
								<Link to="/">
									<i className="fa fa-angle-double-right"></i>
									Home
								</Link>
							</li>
							<li>
								<Link to="/about">
									<i className="fa fa-angle-double-right"></i>
									About
								</Link>
							</li>
							<li>
								<Link to="/rules-amenities">
									<i className="fa fa-angle-double-right"></i>
									Rules & Amenities
								</Link>
							</li>
							<li>
								<Link to="/updates">
									<i className="fa fa-angle-double-right"></i>
									Access Updates
								</Link>
							</li>
							<li>
								<Link to="/contact">
									<i className="fa fa-angle-double-right"></i>
									Contact
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-xs-12 col-sm-4 col-md-4">
						<h5 className="Orange">The Cabins</h5>
						<ul className="list-unstyled quick-links">
							<li>
								<Link to="/huts/jumbo">
									<i className="fa fa-angle-double-right"></i>
									Jumbo Pass Cabin
								</Link>
							</li>
							<li>
								<Link to="/huts/kingsbury">
									<i className="fa fa-angle-double-right"></i>
									Kingbury Cabin
								</Link>
							</li>
							<li>
								<Link to="/huts/olive">
									<i className="fa fa-angle-double-right"></i>
									Olive Hut
								</Link>
							</li>
							<li>
								<Link to="/huts/mcmurdo">
									<i className="fa fa-angle-double-right"></i>
									McMurdo Cabin
								</Link>
							</li>
							<li>
								<Link to="/huts/david-white">
									<i className="fa fa-angle-double-right"></i>
									David White Cabin
								</Link>
							</li>
						</ul>
					</div>
				</div>
				<div className="row">
					<div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-2 text-center text-white">
						<p>
							<u>
								<Link to="/">Columbia Valley Hut Society</Link>
							</u>{" "}
							is a Registered Mountaineering Association, run by
							volunteers operating in the Columbia region.
						</p>
						<p className="h6">© All right Reversed.</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Footer;
