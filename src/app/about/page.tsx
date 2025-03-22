import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Section */}
            <div className="relative">
              <img
                src="/ashu.jpeg"
                alt="About me"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <p className="text-white text-lg md:text-2xl font-bold">
                  Fullstack Developer
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                About Me
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                I am a passionate Fullstack Developer with extensive experience
                delivering projects for a wide range of clients. My expertise
                spans across modern technologies, allowing me to build scalable
                and robust web applications.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>Expert in the MERN stack (MongoDB, Express, React, Node.js).</li>
                <li>Proficient in TypeScript and modern frontend frameworks.</li>
                <li>Experience in building dynamic and user-friendly UI/UX designs.</li>
                <li>Committed to writing clean, efficient, and maintainable code.</li>
                <li>Worked on projects across diverse industries, from startups to enterprises.</li>
              </ul>
              <p className="text-gray-600 text-lg mb-4">
                Beyond coding, I enjoy exploring new technologies, mentoring
                aspiring developers, and continuously learning to stay ahead in
                the tech world.
              </p>

              {/* Contact Information */}
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600 text-lg mb-4">
                If you’d like to connect or collaborate, feel free to reach out:
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:ashutoshmishra8796@gmail.com"
                  className="text-blue-500 hover:underline"
                >
                  ashutoshmishra8796@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* About Blogify */}
          <div className="p-6 md:p-12 border-t">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Blogify</h2>
            <p className="text-gray-600 text-lg mb-4">
              Blogify is a platform designed for writers and content creators to
              share their ideas with the world. Whether you want to share your
              thoughts publicly or keep them private, Blogify offers you the
              tools to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              <li>Write and publish public blog posts.</li>
              <li>Keep personal notes and private entries.</li>
              <li>Engage with readers and build a community.</li>
              <li>Customize your posts with rich formatting options.</li>
            </ul>
            <p className="text-gray-600 text-lg">
              Join Blogify today to start writing, sharing, and making an impact!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
