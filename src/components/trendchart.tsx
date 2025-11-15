"use client";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    Filler
);
import './styles/trendchart.css';

export default function TrendChart({ labels, data, color }: { labels: string[]; data: number[]; color: string }) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Price",
                data: data,
                borderColor: color,
                fill: true,
                backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1)`,
                tension: 0.1,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false as const,
        scales: {
            y: {
                beginAtZero: false,
                
            },
            x: {
                reverse: true,
                grid: {
                    display: false,
                },
                ticks: {
                    maxTicksLimit: 6,
                    maxRotation: 0,
                    minRotation: 0,
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                padding: 12,
                titleFont: { size: 16, family: 'Inter', weight: 600 },
                bodyFont: { size: 13, family: 'Inter' },
                displayColors: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
            filler: {
                propagate: true,
            },
        },
    };

    return (
        <Line data={chartData} options={options} color={color} />
    );
}