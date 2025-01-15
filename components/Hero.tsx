import SearchBar from "../components/SearchBar";
import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("../components/SearchBar"), {
  // Only load the component on the client side
  ssr: false,
});

export default function Hero() {
  return (
    <div className="flex items-center justify-center flex-col min-h-[90vh]">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mt-10">
          The most epic XML word searcher
        </h1>
        <h2 className="text-lg mt-2">
          Are you ready to search your next phrase?
        </h2>
      </div>

      <SearchBar />
    </div>
  );
}
