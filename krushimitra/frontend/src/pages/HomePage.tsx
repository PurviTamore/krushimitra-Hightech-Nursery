import React, { useState } from "react";
import { Link } from "react-router-dom";

interface PlantItem {
  id: number;
  title: string;
  route: string;
  img: string;
}

const HomePage: React.FC = () => {
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const items: PlantItem[] = [
    { id: 1, title: "Fruit Plants", route: "Fruit", img: "/images/fruit.webp" },
    { id: 2, title: "Flower Plants", route: "Flower", img: "/images/flower.jpg" },
    { id: 3, title: "Vegetable Plants", route: "Vegetable", img: "/images/vegetable.jpg" },
    { id: 4, title: "Medicinal Plants", route: "Medicinal", img: "/images/medicinal.jpg" },
    { id: 5, title: "Indoor Plants", route: "Indoor", img: "/images/indoor.webp" },
    { id: 6, title: "Outdoor Plants", route: "Outdoor", img: "/images/outdoor.jpg" },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <>
      {!showCarousel ? (
        <div className="slideshow"></div>
      ) : (
        <div className="explore-background"></div>
      )}

      {!showCarousel ? (
        <div className="content">
          <h1>Welcome to Krushimitra</h1>
          <p>Empowering Farmers, Enriching Lives</p>
          <button className="btn" onClick={() => setShowCarousel(true)}>
            Explore Our Collection
          </button>
        </div>
      ) : (
        <div className="content" style={{ paddingTop: "80px" }}>
          <div className="carousel">
            <div
              className="carousel-wrapper"
              style={{ height: "420px", marginBottom: "30px" }}
            >
              {items.map((item, index) => {
                let className = "card";
                if (index === activeIndex) className += " active";
                else if (index === (activeIndex - 1 + items.length) % items.length)
                  className += " prev";
                else if (index === (activeIndex + 1) % items.length)
                  className += " next";

                return (
                  <Link
                    to={`/category/${item.route}`}
                    key={item.id}
                    className={className}
                    style={{
                      width: "320px",
                      height: "400px",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                      }}
                    />
                    <h3
                      style={{
                        margin: 0,
                        padding: "25px",
                        fontSize: "1.4em",
                        textAlign: "center",
                      }}
                    >
                      {item.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div className="nav-controls">
              <button onClick={handlePrev} className="nav-btn">
                ‹ Prev
              </button>
              <button onClick={handleNext} className="nav-btn">
                Next ›
              </button>
            </div>

            <button
              className="btn back-btn"
              onClick={() => setShowCarousel(false)}
            >
              ⬅ Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
