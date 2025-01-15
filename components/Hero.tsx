import SearchBar from "../components/SearchBar";
import fs from "fs";
import path from "path";

export default function Hero() {
    const filePath = path.join(process.cwd(), "public", "large_conversation.xml");
    const xmlData = fs.readFileSync(filePath, "utf-8");

    return (
        <div className="flex items-center justify-center flex-col min-h-[90vh]">
            <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mt-10">The most epic XML word searcher</h1>
                <h2 className="text-lg mt-2">Are you ready to search your next phrase?</h2>
            </div>

            <SearchBar xmlData={xmlData} />
        </div>
    );
}
