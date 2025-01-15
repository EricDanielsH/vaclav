import ThemeToggleButton from "./ThemeToggleButton";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 h-[10vh] bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
      <h1 className="text-xl font-bold">Search Word</h1>
      <ThemeToggleButton />
    </nav>
  );
}