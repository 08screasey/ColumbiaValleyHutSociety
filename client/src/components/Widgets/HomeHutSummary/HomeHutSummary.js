import React, { useState } from "react";
import HomeHutIcon from "./HomeHutIcon/HomeHutIcon";
import "./HomeHutSummary.css";
import jumbo from "../../../assets/Jumbo Pass Cabin.jpg";
import olive from "../../../assets/HutSociety_backgd_hiker.jpg";
import kingsbury from "../../../assets/mountain 2.jpg";
import davidwhite from "../../../assets/purcells-2.jpg";
import mcmurdo from "../../../assets/HutSociety_McMurdo3.jpg";

const HomeHutSummary = (props) => {
	return (
		<div className={"HomeHutSummary"}>
			<h2 className="DarkBlue Font1 mb-5 TextOutline">Our Cabins</h2>
			<div className="row justify-content-center ">
				<HomeHutIcon
					link="/huts/jumbo"
					imgPath={jumbo}
					cabin="Jumbo Pass Cabin"
					content="An East & West Kootenay favourite, the Jumbo Hut is a great backcountry experience at the height of the Purcells."
				/>
				<HomeHutIcon
					link="/huts/olive"
					imgPath={olive}
					cabin="Olive Hut"
					content=" Located high on the Catamount Glacier, the Olive Hut requires mountaineering skills and experience to access, and rewards visitors with unparalleled scenery and solitude."
				/>
				<HomeHutIcon
					link="/huts/kingsbury"
					imgPath={kingsbury}
					cabin="Kingsbury Pass Cabin"
					content="This hut is hard to get to and offers a true wilderness experience with ski touring, climbing and wildlife viewing."
				/>
				<HomeHutIcon
					link="/huts/davidWhite"
					imgPath={davidwhite}
					cabin="David White Cabin"
					content="This cabin requires some route finding to access in summer, as well as two creek crossings which can be challenging in high water conditions. It offers beautiful views across the basin to the Catamount Glacier, not to mention steep and deep tree skiing from the ridge above in winter."
				/>
				<HomeHutIcon
					link="/huts/mcmurdo"
					imgPath={mcmurdo}
					cabin="McMurdo Cabin"
					content="The area accessible from the rustic McMurdo hut offers wildlife, scenery and high country travel in the summer and a great ski touring options for winter users."
				/>
			</div>
		</div>
	);
};

export default HomeHutSummary;
