import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyerHome() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const applyFilter = () => {
    let result = listings;

    if (search.trim() !== "") {
      result = result.filter((l) =>
        l.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (brand) {
      result = result.filter((l) => l.brand === brand);
    }

    if (minPrice) {
      result = result.filter((l) => l.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((l) => l.price <= Number(maxPrice));
    }

    setFiltered(result);
  };

  if (loading) {
    return <div style={styles.loading}>Loading cars...</div>;
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🚗 Browse Cars for Sale</h1>
      <p style={styles.subtitle}>Find your perfect used car today.</p>

      <div style={styles.layout}>
        {/* LEFT FILTER PANEL */}
        <div style={styles.filterPanel}>
          <h3 style={styles.filterTitle}>Filters</h3>

          {/* Search */}
          <div style={styles.filterGroup}>
            <label>Search</label>
            <input
              style={styles.input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search car name..."
            />
          </div>

          {/* Brand */}
          <div style={styles.filterGroup}>
            <label>Brand</label>
            <select
              style={styles.input}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">All</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Mazda">Mazda</option>
              <option value="Nissan">Nissan</option>
            </select>
          </div>

          {/* Price */}
          <div style={styles.filterGroup}>
            <label>Price Range</label>
            <input
              style={styles.input}
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              style={{ ...styles.input, marginTop: "6px" }}
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <button style={styles.btn} onClick={applyFilter}>
            Apply Filters
          </button>
        </div>

        {/* RIGHT LISTINGS GRID */}
        <div style={styles.grid}>
          {filtered.length === 0 ? (
            <p>No cars found.</p>
          ) : (
            filtered.map((car) => (
              <div key={car.listing_id} style={styles.card}>
                <div style={styles.cardImg}></div>
                <img
                    src={
                     car.brand === "Toyota"
                        ? "/car2.jpg"
                        : "/car1.jpg"
                    }
                    alt={`${car.brand} ${car.model}`}
                    style={styles.cardImg}
                />

                <h3 style={styles.cardTitle}>
                  {car.brand} {car.model}
                </h3>

                <p style={styles.cardText}>{car.year}</p>
                <p style={styles.cardPrice}>{car.price.toLocaleString()} THB</p>

                <button
                        style={styles.cardBtn}
                        onClick={() => navigate(`/buyer/car/${car.listing_id}`)}

                      >
                 View Details
                </button>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    background: "#e8f1ff",
    minHeight: "100vh",
  },
  title: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#1a4fa3",
  },
  subtitle: {
    color: "#4b74c0",
    marginBottom: "30px",
  },
  layout: {
    display: "flex",
    gap: "25px",
  },

  /* LEFT FILTER */
  filterPanel: {
    width: "260px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  filterTitle: {
    fontSize: "20px",
    marginBottom: "15px",
    color: "#1a4fa3",
  },
  filterGroup: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #a7c2f3",
  },

  btn: {
    width: "100%",
    padding: "10px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  /* RIGHT GRID */
  grid: {
    flexGrow: 1,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  cardImg: {
    width: "100%",
    height: "180px",
    borderRadius: "10px",
    objectFit: "cover",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  cardText: {
    margin: 0,
    color: "#555",
  },
  cardPrice: {
    marginTop: "8px",
    fontWeight: "700",
    fontSize: "20px",
    color: "#1a4fa3",
  },
  cardBtn: {
    marginTop: "10px",
    padding: "10px 14px",
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  loading: {
    padding: "50px",
    fontSize: "24px",
    textAlign: "center",
  },
};
