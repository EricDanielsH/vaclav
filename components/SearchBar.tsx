"use client";
import { useState } from "react";
import { parseXML } from "../utils/parseXML";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [displayedResults, setDisplayedResults] = useState([]); // For the current visible results
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // Tracks if the user has searched anything
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const getAgeGroup = (age: number) => {
    if (age < 18) return "0-17";
    if (age < 25) return "18-24";
    if (age < 35) return "25-34";
    if (age < 45) return "35-44";
    if (age < 55) return "45-54";
    if (age < 65) return "55-64";
    return "65+";
  };

  const handleShowMore = () => {
    const nextPage = currentPage + 1;
    const nextResults = results.slice(0, nextPage * resultsPerPage);
    setDisplayedResults(nextResults);
    setCurrentPage(nextPage);
  };

  const handleSearch = async () => {
    console.log("Searching for: ", search);

    // Avoid searching if the search term is empty
    // This is to prevent unnecessary API calls and processing
    if (search.length === 0) return;

    // Convert xml data to json
    const data = await parseXML(xmlData);
    if (!data) return;

    // Create the default stats
    const stats = {
      male: 0,
      female: 0,
      ageGroups: {
        "0-17": 0,
        "18-24": 0,
        "25-34": 0,
        "35-44": 0,
        "45-54": 0,
        "55-64": 0,
        "65+": 0,
      },
      total: 0,
    };

    // Get the conversations
    const conversations = data.conversation.u;

    // Filter the conversations
    const filteredConversations = conversations.filter((conversation: any) => {
      return conversation._.toLowerCase().includes(search.toLowerCase());
    });

    filteredConversations.forEach((conversation: any) => {
      const { age, gender } = conversation.$;

      // Update the stats
      stats.total++;
      gender == "male" ? stats.male++ : stats.female++;
      const ageGroup = getAgeGroup(parseInt(age));
      stats.ageGroups[ageGroup] = stats.ageGroups[ageGroup]
        ? stats.ageGroups[ageGroup] + 1
        : 1;
    });

    // Set the new results and stats
    setResults(filteredConversations);
    setDisplayedResults(filteredConversations.slice(0, resultsPerPage)); // Display the first 10 (resultsPerPage) results
    setStatistics(stats);
    setHasSearched(true);
    setCurrentPage(1);
  };

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
            setSearch(e.target.value);
            setHasSearched(false);
          }}
          className="p-2 border border-gray-200 dark:border-gray-800 dark:text-black rounded-lg"
        />
        <button
          className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg"
          onClick={handleSearch}
        >
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
        <div className="">
          <section className="mb-8">
            {
              <div className="mt-4 flex flex-col items-center">
                <h2 className="text-xl font-bold">Results</h2>
                <ul
                  className="max-h-48 overflow-y-auto w-full max-w-xs md:max-w-2xl overflow-x-auto
                  p-4 border border-gray-200 bg-gray-200 dark:bg-gray-800 dark:border-gray-800 rounded-lg"
                >
                  {displayedResults.map((result: any, index: number) => (
                    <li key={index} className="mt-2 flex flex-col">
                      <span className="font-bold"> Text: </span>
                      {result._}
                      <span className="font-bold"> Age: </span>
                      {result.$.age}
                      <span className="font-bold"> Gender: </span>
                      {result.$.gender}
                      <span className="font-bold">
                        _______________________________
                      </span>
                    </li>
                  ))}
                  {results.length > displayedResults.length && (
                    <button
                      onClick={handleShowMore}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Show More
                    </button>
                  )}
                </ul>
              </div>
            }
          </section>

          <div className="flex flex-col items-center gap-4">
            {/* Display the results in a graph */}
            <section>
              <div className="min-w-[300px] max-w-[300px] md:min-w-[500px] w-full">
                <h3 className="text-xl font-semibold">Visualisation</h3>
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

            {/* Display Statistics */}
            <section>
              {statistics && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">Statistics</h3>
                  <div className="grid grid-cols-1  md:grid-cols-3 gap-4 mt-6 text-center">
                    <Card className="w-full px-4 dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-xl">Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{statistics.total}</p>
                      </CardContent>
                    </Card>

                    <Card className="w-full px-4 dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-xl">Male</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{statistics.male}</p>
                      </CardContent>
                    </Card>

                    <Card className="w-full px-4 dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-xl">Female</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{statistics.female}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold">Age Groups:</h4>
                    <ul>
                      {Object.entries(statistics.ageGroups).map(
                        ([ageGroup, count]) => (
                          <li key={ageGroup}>
                            <span className="font-semibold">{ageGroup}</span>:{" "}
                            {count}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
