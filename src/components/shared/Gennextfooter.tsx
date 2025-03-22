import Image from "next/image";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gold-100">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-5">
        {/* Logo Column */}
        <div className="w-full md:w-1/4 flex items-center justify-center md:justify-start mb-4 md:mb-0">
          <a href="/" className="flex title-font font-medium items-center text-gray-900">
            <Image src="/logo.png" alt="logo" height={98} width={98}  />
          </a>
        </div>

        {/* Navigation Links Columns */}
        <div className="w-full md:w-3/4 flex justify-center md:justify-end">
          <div className="flex md:space-x-56 ">
            <div className="flex flex-col">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">COMPANY</h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800" href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800" href="/terms">Terms & Conditions</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800" href="/blog">Blog</a>
                </li>
              </nav>
            </div>
            <div className="flex flex-col">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">CONTACT</h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800" href="tel:+917840079095">India: +91-78400 79095</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800" href="tel:+911204994499">India: +91-120-4994499</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800" href="mailto:info@gennextit.com">info@gennextit.com</a>
                </li>
              </nav>
            </div>
            <div className="flex flex-col">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">ADDRESS</h2>
              <nav className="list-none mb-10">
                <li>
                  <p className="text-gray-600">Basement (C-001), Building H-53</p>
                </li>
                <li>
                  <p className="text-gray-600">Sector 63, Noida (UP)-201305, India</p>
                </li>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
