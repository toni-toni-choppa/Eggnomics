"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import TrendChart from "../../../components/trendchart";
import "../../../components/styles/trendchart.css";
import "./styles/product.css";

export default function ProductPage() {
    const { product } = useParams();
    const [productData, setProductData] = useState<any>(null);
    const [range, setRange] = useState("1Y");

    // Fetch product data
    useEffect(() => {
        fetch(`/api/product?id=${product}`)
            .then((r) => r.json())
            .then((data) => {
                setProductData(data);
                document.title = `${data?.name} - Eggnomics`;
            })
            .catch((e) => console.error("Error fetching product data:", e));
    }, [product]);

    // Safe loading state → prevents crashes
    if (!productData || !Array.isArray(productData.prices)) {
        return <p>Loading...</p>;
    }

    // Filter price data based on range
    function getFilteredData() {
        const now = new Date();
        const monthsBack = {
            "6M": 6,
            "1Y": 12,
            "2Y": 24,
            "5Y": 60,
            "10Y": 120,
        }[range];

        return productData.prices.filter((p: any) => {
            const [month, year] = p.date.split("-");
            const d = new Date(year, parseInt(month) - 1);
            const diffMonths =
                (now.getFullYear() - d.getFullYear()) * 12 +
                (now.getMonth() - d.getMonth());
            return diffMonths <= monthsBack;
        });
    }

    const filtered = getFilteredData();

    const startPrice = filtered[filtered.length - 1]?.price;
    const endPrice = filtered[0]?.price;

    const trendColor = endPrice >= startPrice ? "#FF0000" : "#008000";


    // Handle case where the range returns no data
    if (filtered.length === 0) {
        return (
            <main>
                <h2>{productData.name}</h2>
                <p>No price data available for this range.</p>

                <div className="range-options">
                    {["6M", "1Y", "2Y", "5Y", "10Y"].map((r) => (
                        <button
                            key={r}
                            className={`range-button ${range === r ? "active" : ""}`}
                            onClick={() => setRange(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </main>
        );
    }

    // Compute chart data safely
    const labels = filtered.map((p: any) => {
        const [month, year] = p.date.split("-");
        return new Date(year, parseInt(month) - 1).toLocaleDateString("default", {
            month: "short",
            year: "numeric",
        });
    });

    const prices = filtered.map((p: any) => p.price);

    // Price change logic
    const latest = filtered[0]?.price;
    const delta = (endPrice - startPrice);

    const latestDate = filtered[0]?.date
        ? (() => {
              const [month, year] = filtered[0].date.split("-");
              return new Date(year, parseInt(month) - 1).toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
              });
          })()
        : "Unknown";

    return (
        <main>
            <div className="product-header">
                <h2 className="product-name">{productData.name}</h2>

                <span>
                    <h2>${latest}</h2>
                    <p>per {productData.unit}</p>
                    <p style={{ color: trendColor }}>{`${delta >= 0 ? "+" : "-"}$${Math.abs(delta).toFixed(2)}`}</p>
                </span>

                <p>
                    {latestDate} <br />
                    Source: US Bureau of Labor Statistics
                </p>
            </div>

            <div className="chart-wrapper">
                <div className="range-options">
                    {["6M", "1Y", "2Y", "5Y", "10Y"].map((r) => (
                        <button
                            key={r}
                            className={`range-button ${range === r ? "active" : ""}`}
                            onClick={() => setRange(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <TrendChart
                    labels={labels}
                    data={prices}
                    color={trendColor}
                />
            </div>
        </main>
    );
}
