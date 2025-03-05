"use client";

import { useState, useRef, useEffect } from "react";
import { searchUsers } from "@/actions/user.action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";

// Define user type
interface User {
  id: string;
  username: string;
  name?: string;
  image?: string;
}

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search input change
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (value.trim() === "") {
      setUsers([]);
      return;
    }

    const results = await searchUsers(value);
    const formattedResults: User[] = results.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name ?? undefined,
      image: user.image ?? undefined,
    }));
    setUsers(formattedResults);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full max-w-xs sm:max-w-md mx-2"
      ref={dropdownRef}
    >
      {/* Search Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center border rounded-lg bg-gray-50 focus-within:ring-2  transition-all duration-200"
      >
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Be Friends with..."
          className="w-full p-2 pl-3 text-sm focus:outline-none sm:text-base"
        />
        <Button
          type="submit"
          className="p-3 rounded-r-lg transition-colors duration-200 "
        >
          <FaSearch size={5} />
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && users.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name || user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="ml-3 truncate">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.name || user.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
