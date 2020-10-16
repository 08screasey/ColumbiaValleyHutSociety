import React, { useState } from "react";
import "./Gallery.css";
import Image1 from "../../assets/DavidWhite.jpg";
import Image2 from "../../assets/HutSociety_backgd_skier.jpg";
import Image3 from "../../assets/HutSociety_CairnCommander.jpg";
import Image4 from "../../assets/HutSociety_JumboHutHike.jpg";
import Image5 from "../../assets/HutSociety_JumboHutHike2.jpg";
import Image6 from "../../assets/HutSociety_McMurdo1.jpg";
import Image7 from "../../assets/HutSociety_McMurdo3.jpg";
import Image8 from "../../assets/KMC Trip 1.jpg";
import Image9 from "../../assets/MAndy snow 2.jpg";
import Image10 from "../../assets/mountain 1.jpg";
import Image11 from "../../assets/Jumbo Pass Cabin.jpg";
import Image12 from "../../assets/snow 910.jpg";
import Image13 from "../../assets/mandy meadows.jpg";
import Image14 from "../../assets/purcells 21.jpg";
import Image15 from "../../assets/HutSociety_LakeHangingGlacier.jpg";
import Image16 from "../../assets/HutSociety_heliHikingPurcells.jpg";
import { Waypoint } from "react-waypoint";


import Image from "./Image/Image";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const Gallery = (props) => {
	const [inView, setInView] = useState(false);
	

	const images = [
		Image1,
		Image2,
		Image3,
		Image4,
		Image5,
		Image6,
		Image7,
		Image8,
		Image9,
		Image10,
		Image11,
		Image12,
		Image13,
		Image14,
		Image15,
		Image16,
	];
	const imgElements = images.map((jpg, index) => {
		return (
			<Image
				source={jpg}
				key={index}
			/>
		);
	});
	return (
		<LazyLoadComponent>
			<h3 className="Font0 DarkBlue my-4 TextOutline">Gallery</h3>
			<div className={inView ? "row Gallery Visible" : "row Gallery"}>
				<Waypoint
					onEnter={() => {
						setInView(true);
					}}
					
				>
					<div className="col-12 p-0 d-flex flex-wrap justify-content-center">
						{imgElements}
					</div>
				</Waypoint>
			</div>
		</LazyLoadComponent>
	);
};

export default Gallery;
