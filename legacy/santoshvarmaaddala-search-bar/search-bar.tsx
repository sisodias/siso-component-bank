import { useEffect, useState } from "react";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { ArrowUpAZ, ArrowDownAZ, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";

interface SearchItem {
  id: number;
  creator: string;
  title: string;
  description: string;
  tags: string[];
}

interface SearchComponentProps {
  data: SearchItem[];
}

const SearchComponent = ({ data }: SearchComponentProps) => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "">("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim();
    let results = data.filter((item) =>
      item.title.toLowerCase().includes(lowerCaseQuery)
    );

    if (sortOrder === "asc") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "desc") {
      results.sort((a, b) => b.title.localeCompare(a.title));
    }

    setFilteredData(results);
  }, [query, sortOrder, data]);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      {/* Search Input and Sort Dropdown */}
      <div className="w-full md:w-[40%] max-w-lg flex flex-col sm:flex-row gap-4">
        {/* Search Bar with Icon */}
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search your data..."
            className="w-full pr-10"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        </div>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem 
              onClick={() => setSortOrder("asc")}
              className="flex justify-between items-center"
            >
              <span>Title Ascending</span>
              <ArrowUpAZ className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSortOrder("desc")}
              className="flex justify-between items-center"
            >
              <span>Title Descending</span>
              <ArrowDownAZ className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Results with Scroll */}
      <ScrollArea className="h-72 w-full md:w-[40%] max-w-lg border rounded-md">
        <div className="p-4 space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-card text-card-foreground p-4 rounded-lg border shadow-sm"
              >
                <h3 className="text-lg font-medium leading-none">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-secondary text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No results found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export { SearchComponent };