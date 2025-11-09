"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import './styles/sidebar.css';

interface Product {
    name: string;
    price: string;
    unit: string;
    change: string;
}

export default function Sidebar() {
    const [products, setProducts] = useState<Record<string, Product>>({});
    const pathname = usePathname();

    useEffect(() => {
        fetch("/api/latest")
            .then((response) => response.json())
            .then(setProducts)
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    return (
        <aside className="sidebar">
            <h2>Products</h2>
            <ul>
                {Object.entries(products).map(([key, product]) => {
                    const isActive = pathname === `/product/${key}`;
                    return (
                        <li key={key} className={isActive ? "active" : ""}>
                            <Link
                                href={`/product/${key}`}
                            >
                                <p>{product.name}</p>
                                <span>
                                    <div>
                                        <h2>${product.price}</h2>
                                        <p>&nbsp;per {product.unit}</p>
                                    </div>
                                    <span className="change">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className={product.change.includes("-") ? "negative" : "positive"} viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"/>
                                        </svg>
                                        <p className={product.change.includes("-") ? "negative" : "positive"}>{product.change}</p>
                                    </span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
}
