// import Sidebar from "../sidebar/Sidebar";
// import Topbar from "../topbar/Topbar";

export default function Header() {
  return (
    <div className="relative">
      <div className="flex flex-col items-center text-gray-700 font-serif">
        <span className="absolute text-white top-1/2 text-2xl md:text-4xl">
          Welcome to
        </span>
        <span className="absolute text-white top-1/2 text-6xl md:text-8xl">
          Blog
        </span>
      </div>
      <img
        className="w-full h-[450px] object-cover"
        src="https://cdn.pixabay.com/photo/2019/12/03/21/29/mountains-4671122_1280.jpg"
        alt=""
      />
    </div>
  );
}
