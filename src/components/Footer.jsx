import React from "react";
import "./Footer.css";

const Footer = () => {
return (
	<div className="box">
	<h6 style={{ color: "whitesmoke",
				textAlign: "center",
				marginTop: "-50px" }}>
		iconicStartups: A Place to start your journey...
	</h6>
	<div className="container">
		<div className="footerRow">
		<div className="column">
			<p className="heading">About Us</p>
			<a className="footerLink" href="#">Aim</a>
			<a className="footerLink" href="#">Vision</a>
			<a className="footerLink" href="#">Testimonials</a>
		</div>
		<div className="column">
			<p className="heading">Services</p>
			<a className="footerLink" href="#">Writing</a>
			<a className="footerLink" href="#">Internships</a>
			<a className="footerLink" href="#">Coding</a>
			<a className="footerLink" href="#">Teaching</a>
		</div>
		<div className="column">
			<p className="heading">Contact Us</p>
			<a className="footerLink" href="#">Uttar Pradesh</a>
			<a className="footerLink" href="#">Ahemdabad</a>
			{/* <a className="footerLink" href="#">Indore</a>
			<a className="footerLink" href="#">Mumbai</a> */}
		</div>
		{/* <div className="column">
			<p className="heading">Social Media</p>
			<a className="footerLink" href="#">
			<i className="fab fa-facebook-f">
				<span style={{ marginLeft: "10px" }}>
				Facebook
				</span>
			</i>
			</a>
			<a className="footerLink" href="#">
			<i className="fab fa-instagram">
				<span style={{ marginLeft: "10px" }}>
				Instagram
				</span>
			</i>
			</a>
			<a className="footerLink" href="#">
			<i className="fab fa-twitter">
				<span style={{ marginLeft: "10px" }}>
				Twitter
				</span>
			</i>
			</a>
			<a className="footerLink" href="#">
			<i className="fab fa-youtube">
				<span style={{ marginLeft: "10px" }}>
				Youtube
				</span>
			</i>
			</a>
		</div> */}
		</div>
	</div>
	</div>
);
};
export default Footer;
