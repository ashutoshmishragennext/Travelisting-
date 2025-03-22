import { useEffect, useState } from "react";


export default function Sidebar() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      const res = await fetch("/categories");
      const data = await res.json();
      setCats(data);
    };
    getCats();
  }, []);

  return (
    <div className="flex flex-col flex-3 m-5 pb-7 bg-white rounded-lg">
      <div className="flex flex-col items-center">
        <span className="my-2 py-1 w-4/5 border-t border-b border-gray-400 text-center text-gray-800 font-semibold text-sm">
          ABOUT ME
        </span>
        <img
          src="https://i.pinimg.com/236x/1e/3f/58/1e3f587572a7a7b20bbf1828595a1786--holiday-party-themes-holiday-gift-guide.jpg"
          alt=""
          className="mt-4"
        />
        <p className="p-8">
          Welcome to our blogging community! We're thrilled to have you here. Create your account to start sharing your unique stories and insights with the world. Feel free to update and refine your posts anytime, and if needed, you can also delete them. Join us in creating a vibrant and engaging platform for everyone!
        </p>
      </div>
      <div className="flex flex-col items-center">
        <span className="my-2 py-1 w-4/5 border-t border-b border-gray-400 text-center text-gray-800 font-semibold text-sm">
          CATEGORIES
        </span>
        {/* <ul className="list-none mb-7">
          {cats.map((c) => (
            <Link to={`/?cat=${c.name}`} className="link" key={c.name}>
              <li className="inline-block w-1/2 mt-4 cursor-pointer">
                {c.name}
              </li>
            </Link>
          ))}
        </ul> */}
      </div>
      <div className="flex flex-col items-center">
        <span className="my-2 py-1 w-4/5 border-t border-b border-gray-400 text-center text-gray-800 font-semibold text-sm">
          FOLLOW US
        </span>
        <div className="mt-4 w-64 flex items-center justify-center">
          <i className="sidebarIcon fab fa-facebook-square"></i>
          <i className="sidebarIcon fab fa-twitter-square"></i>
          <i className="sidebarIcon fab fa-pinterest-square"></i>
          <a href="https://www.instagram.com/ashutosh_mishraa_0?igsh=eGhkaWhjcGE2YTRy">
            <i className="sidebarIcon fab fa-instagram-square"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
