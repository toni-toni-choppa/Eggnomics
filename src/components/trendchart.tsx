"use client";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    animator,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);
import './styles/trendchart.css';

export default function TrendChart({ labels, data }: { labels: string[]; data: number[] }) {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Price",
                data: data,
                borderColor: "rgba(55, 125, 34, 1)",
                fill: true,
                tension: 0.4,
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
        },
    };

    return (
        <div className="chart-wrapper">
            <Line data={chartData} options={options} />
        </div>
    );
}