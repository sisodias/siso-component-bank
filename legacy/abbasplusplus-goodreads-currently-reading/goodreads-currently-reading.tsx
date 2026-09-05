"use client";

import { BookOpen, Star } from "lucide-react";
import { useEffect, useState } from "react";

export const Component = ({ goodreadsUserId = "117356165-mohammad-abbas" }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const RSS_URL = `https://www.goodreads.com/review/list_rss/${goodreadsUserId}?shelf=currently-reading`;

  // Simplified parsing using direct XML tags
  const parseRSSItem = (item) => {
    // Direct tag extraction - much cleaner!
    const title =
      item.querySelector("title")?.textContent?.trim() || "Unknown Title";
    const author =
      item.querySelector("author_name")?.textContent?.trim() ||
      "Unknown Author";
    const rating = item.querySelector("average_rating")?.textContent?.trim();
    const published = item.querySelector("book_published")?.textContent?.trim();
    const bookId = item.querySelector("book_id")?.textContent?.trim();

    // Get image URLs - multiple sizes available
    const largeImage = item
      .querySelector("book_large_image_url")
      ?.textContent?.trim();
    const mediumImage = item
      .querySelector("book_medium_image_url")
      ?.textContent?.trim();
    const smallImage = item
      .querySelector("book_small_image_url")
      ?.textContent?.trim();

    // Use the best available image
    const imageUrl = largeImage || mediumImage || smallImage;

    // Construct Goodreads book URL
    const bookUrl = bookId
      ? `https://www.goodreads.com/book/show/${bookId}`
      : null;

    return {
      title,
      author,
      imageUrl,
      bookUrl,
      rating: rating ? Number.parseFloat(rating) : null,
      published: published ? Number.parseInt(published) : null,
    };
  };

  useEffect(() => {
    const fetchCurrentlyReading = async () => {
      try {
        setLoading(true);

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
          RSS_URL
        )}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch RSS feed`);
        }

        const data = await response.json();

        if (!data.contents) {
          throw new Error("No content received from RSS feed");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");

        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
          throw new Error("Invalid XML format in RSS feed");
        }

        const items = xmlDoc.querySelectorAll("item");

        if (items.length === 0) {
          throw new Error("No books found in currently reading shelf");
        }

        // Parse the first (most recent) book
        const bookData = parseRSSItem(items[0]);
        setBook(bookData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching Goodreads data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyReading();
  }, [RSS_URL]); // Add RSS_URL to dependencies since it changes with userId

  if (loading) {
    return (
      <div className="space-y-12 p-12">
        <div className="text-4xl text-muted-foreground font-mono tracking-widest">CURRENTLY READING</div>
        <div className="space-y-8 animate-pulse">
          <div className="flex items-start gap-12">
            <div className="w-64 h-96 bg-muted rounded-xl"></div>
            <div className="flex-1 space-y-8">
              <div className="h-16 bg-muted rounded w-3/4"></div>
              <div className="h-12 bg-muted rounded w-1/2"></div>
              <div className="flex items-center gap-8">
                <div className="h-10 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return null;
  }

  return (
    <div className="space-y-12 p-12">
      <div className="text-4xl text-muted-foreground font-mono tracking-widest">CURRENTLY READING</div>
      <div className="flex items-start gap-12">
        {book.imageUrl && book.bookUrl ? (
          <a
            href={book.bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img
              src={book.imageUrl || "/placeholder.svg"}
              alt={`Cover of ${book.title}`}
              className="w-64 h-96 object-cover rounded-2xl shadow-2xl border-4 border-gray-200 hover:shadow-3xl hover:scale-105 transition-all duration-500"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.closest("a").nextElementSibling.style.display = "flex";
              }}
            />
          </a>
        ) : book.imageUrl ? (
          <img
            src={book.imageUrl || "/placeholder.svg"}
            alt={`Cover of ${book.title}`}
            className="w-64 h-96 object-cover rounded-2xl shadow-2xl border-4 border-gray-200 flex-shrink-0 hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback placeholder */}
        <div
          className="w-64 h-96 bg-muted rounded-2xl border-4 border-border flex items-center justify-center flex-shrink-0 shadow-2xl"
          style={{ display: book.imageUrl ? "none" : "flex" }}
        >
          <BookOpen className="w-24 h-24 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-6 min-w-0">
          {book.bookUrl ? (
            <a
              href={book.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h4 className="text-5xl font-black text-foreground leading-tight line-clamp-4 hover:text-muted-foreground transition-colors">
                {book.title}
              </h4>
            </a>
          ) : (
            <h4 className="text-5xl font-black text-foreground leading-tight line-clamp-4">
              {book.title}
            </h4>
          )}

          <p className="text-3xl text-muted-foreground font-bold">
            by {book.author}
          </p>

          <div className="flex items-center gap-12 text-2xl text-muted-foreground font-semibold">
            {book.rating && (
              <div className="flex items-center gap-4">
                <Star className="w-10 h-10 text-yellow-400 fill-current" />
                <span className="text-3xl font-bold">{book.rating}</span>
              </div>
            )}
            {book.published && (
              <div className="text-xl opacity-75">
                Published {book.published}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;