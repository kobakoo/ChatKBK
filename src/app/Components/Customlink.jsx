import React from "react";
import Link from "next/link";
const CustomLink = ({ href, children }) => {
  return (
    <div>
      <Link href={href} target="_blank">
        {children}
      </Link>
    </div>
  );
};
export default CustomLink;
