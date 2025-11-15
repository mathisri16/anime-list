import { useEffect, useState } from "react";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string };
  };
  synopsis: string;
};

export default function AnimeList() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const fetchTopAnime = async () => {
    try {
      const res = await fetch("https://api.jikan.moe/v4/top/anime");
      const data = await res.json();
      setAnime(data.data);
    } catch (err) {
      setError("Failed to load anime");
    } finally {
      setLoading(false);
    }
  };

  const searchAnime = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&limit=15`
      );
      const data = await res.json();
      setAnime(data.data);
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopAnime();
  }, []);

  return (
    <div className="container">
      {/* Search Box */}
      <div className="mb-lg">
        <input
          type="text"
          placeholder="Search anime… (press Enter)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchAnime()}
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid grid-4">
        {anime.map((item) => (
          <div key={item.mal_id} className="card">
            <img className="card-img" src={item.images.jpg.image_url} alt={item.title} />
            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>
              <p className="card-text">{item.synopsis}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
