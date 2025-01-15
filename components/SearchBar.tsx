"use client"
import { useState, useEffect } from "react";
import { parseXML } from "../utils/parseXML";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Statistics {
    male: number;
    female: number;
    ageGroups: {
        "0-17": number;
        "18-24": number;
        "25-34": number;
        "35-44": number;
        "45-54": number;
        "55-64": number;
        "65+": number;
    };
    total: number;
}


export default function SearchBar({ xmlData }: { xmlData: string }) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [hasSearched, setHasSearched] = useState(false); // Track whether search has been initiated


    const getAgeGroup = (age: number) => {
        if (age < 18) return "0-17";
        if (age < 25) return "18-24";
        if (age < 35) return "25-34";
        if (age < 45) return "35-44";
        if (age < 55) return "45-54";
        if (age < 65) return "55-64";
        return "65+";
    }

    const handleSearch = async () => {
        console.log("Searching for: ", search);
        // Convert xml data to json
        const data = await parseXML(xmlData);
        if (!data) return;

        // Create the default stats
        const stats = { male: 0, female: 0, ageGroups: { "0-17": 0, "18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55-64": 0, "65+": 0 }, total: 0 };

        // Get the conversations
        const conversations = data.conversation.u;

        // Filter the conversations
        const filteredConversations = conversations.filter((conversation: any) => {
            return conversation._.toLowerCase().includes(search.toLowerCase());
        });

        filteredConversations.forEach((conversation: any) => {
            const { age, gender } = conversation.$;
            const text = conversation._;

            // Update the stats
            stats.total++;
            gender == "male" ? stats.male++ : stats.female++;
            const ageGroup = getAgeGroup(parseInt(age));
            stats.ageGroups[ageGroup] = stats.ageGroups[ageGroup] ? stats.ageGroups[ageGroup] + 1 : 1;

        });

        // Set the new results and stats
        setResults(filteredConversations);
        setStatistics(stats);
        setHasSearched(true);
    }

    // Prepare chart data
    const chartData = [
        { name: "Male", count: statistics?.male || 0 },
        { name: "Female", count: statistics?.female || 0 },
        ...Object.entries(statistics?.ageGroups || {}).map(([ageGroup, count]) => ({
            name: ageGroup,
            count: count,
        })),
    ];


    return (
        <div className="flex justify-center flex-col items-center gap-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Search for a word or phrase"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setHasSearched(false)
                    }}
                    className="p-2 border border-gray-200 dark:border-gray-800 rounded-lg"
                />
                <button className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {/* Display a message if there are no results */}
            {hasSearched && results.length === 0 && search.length > 0 && (
                <div className="mt-4">
                    <p>No results found for: {search}</p>
                </div>
            )}

            {/* Display the results */}
            {results.length > 0 && (
                <div>
                    <div className="flex flex-col md:flex-row gap-4">

                        <section>
                            {
                                <div className="mt-4">
                                    <h2 className="text-xl font-bold">Results</h2>
                                    <ul className="max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-800 rounded-lg">

                                        {results.map((result: any, index: number) => (
                                            <li key={index} className="mt-2">
                                                {result._}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                        </section>

                        {/* Display Statistics */}
                        <section>
                            {statistics && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold">Statistics</h3>
                                    <p>Total Results: {statistics.total}</p>
                                    <p>Male: {statistics.male}</p>
                                    <p>Female: {statistics.female}</p>
                                    <div className="mt-4">
                                        <h4 className="font-semibold">Age Groups:</h4>
                                        <ul>
                                            {Object.entries(statistics.ageGroups).map(([ageGroup, count]) => (
                                                <li key={ageGroup}>
                                                    {ageGroup}: {count}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </section>

                    </div>
                    {/* Display the results in a graph */}
                    <section>
                        {/* Bar Chart Visualization */}
                        <div className="w-[400px]">
                            <h4 className="font-semibold">Visualization</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>
            )}


        </div>
    );

}