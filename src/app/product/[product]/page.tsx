"use client";
import { useParams } from 'next/navigation';
import './styles/product.css';
import { useEffect } from 'react';

export default function ProductPage() {
    const { product } = useParams();

    useEffect(() => {
        if (product) {
            document.title = `${product} - Eggnomics`;
        }
    }, [product]);
    
    return (
        <main>
            <h2>{product}</h2>
        </main>
    );
}