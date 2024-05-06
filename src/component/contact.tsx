import { useRef } from "react";

import gsap from "gsap"; // <-- import GSAP
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

export default function Contact() {
  const container = useRef();

  useGSAP(() => {
    // gsap code here...
    gsap.to(".box", {rotation: 180}); // <-- automatically reverted

  }, { scope: container }); // <-- scope for selector text (optional)

 return (
  <div className="container">
    <h1 className="title mt-4">Page de Contact</h1>
  </div>
 );
}