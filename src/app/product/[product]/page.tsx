"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import './styles/product.css';
import { useEffect, useState } from 'react';
import TrendChart from '../../../components/trendchart';
import { Line } from 'react-chartjs-2';

export default function ProductPage() {
    const { product } = useParams();
    const [ productData, setProductData ] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/product?id=${product}`)
            .then(response => response.json())
            .then(data => {
                setProductData(data);
                document.title = `${data?.name} - Eggnomics`;
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }, [product]);

    return (
        <main>
            <div className="product-header">
                <h2 className="product-name">{productData?.name}</h2>

                <span>
                    <h2>${productData?.prices[0].price}</h2>
                    <p>per {productData?.unit}</p>
                    <p>{(productData?.prices[0].price - productData?.prices[1].price).toPrecision(2)}</p>
                </span>
                <p>{new Date(productData?.prices[0].date).toLocaleDateString('default', { month: 'long' , year: 'numeric' })}<br></br>
                Source US Bureau of Labor Statistics</p>
            </div>
            <TrendChart data={productData?.prices.map((p: any) => p.price) || []} labels={productData?.prices.map((p: any) => new Date(p.date).toLocaleDateString('default', { month: 'short', year: 'numeric' })) || []} />
        </main>
    );
}