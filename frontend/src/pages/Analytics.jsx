import React, { useEffect, useState } from 'react';
import { getAnalytics } from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function Analytics() {
    const [data, setData] = useState(null);
    const [availableCategories, setAvailableCategories] = useState([]);

    // View State: 'day', 'week', 'month', 'year', 'category_distribution'
    const [view, setView] = useState('day');

    // Filter State: 'All' or specific category name
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getAnalytics(selectedCategory);
            setData(result);
            // On first load, capture available categories if not already set (or always update to ensure sync)
            if (result.available_categories) {
                setAvailableCategories(result.available_categories);
            }
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory]); // Refetch when category filter changes

    const getChartTitle = () => {
        const catText = selectedCategory === 'All' ? 'All Categories' : selectedCategory;
        switch (view) {
            case 'day': return `Daily Trend (${catText})`;
            case 'week': return `Weekly Trend (${catText})`;
            case 'month': return `Monthly Overview (${catText})`;
            case 'year': return `Yearly Overview (${catText})`;
            case 'category_distribution': return `Category Distribution (${catText})`; // Logic check: if specific cat selected, likely 100%
            default: return 'Analytics';
        }
    };

    // Helper to render the appropriate chart based on 'view' state
    const renderChart = () => {
        if (!data) return null;

        if (view === 'category_distribution') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.category}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.category.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        // For Time Series Views
        const chartData = data[view];
        const isLine = view === 'day'; // Use Line for Day, Bar for others? Or Line for all trends? User had Bar for week/month/year.

        // Match user's previous preference: Day=Line, Week/Month/Year=Bar
        if (isLine) {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" name="Grievances" />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" name="Grievances" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    };

    if (loading && !data) return <div className="p-8 text-center">Loading analytics...</div>;
    if (!data) return <div className="p-8 text-center">Failed to load data.</div>;

    return (
        <div className="dashboard-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '1.5rem' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Analytics Dashboard</h2>
                <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>Insights and trends for grievance management</p>
            </header>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'nowrap' }}>

                {/* Left: Chart Area (Takes remaining space - wider) */}
                <div className="card" style={{
                    flex: '1',
                    height: '450px', // Reduced height as requested
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    minWidth: '600px' // Ensure it doesn't get too squashed
                }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155', margin: 0 }}>
                            {getChartTitle()}
                        </h3>
                        <span style={{ padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '20px', fontSize: '0.75rem', color: '#64748b' }}>
                            {data[view] ? data[view].length : 0} Data Points
                        </span>
                    </div>

                    <div style={{ height: '350px', width: '100%' }}>
                        {renderChart()}
                    </div>
                </div>

                {/* Right: Controls Sidebar (Fixed width) */}
                <div style={{
                    flex: '0 0 300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>

                    {/* View Control Card */}
                    <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                                View Type
                            </label>
                            <select
                                className="input"
                                value={view}
                                onChange={(e) => setView(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#f8fafc',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="day">Daily Trend</option>
                                <option value="week">Weekly Trend</option>
                                <option value="month">Monthly Overview</option>
                                <option value="year">Yearly Overview</option>
                                <option value="category_distribution">Category Distribution</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Control Card */}
                    <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgb(0 0 0 / 0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                                Filter by Category
                            </label>
                            <select
                                className="input"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: '#f8fafc',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="All">All Categories</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Summary / Info Card */}
                    <div className="card" style={{ padding: '1.25rem', borderRadius: '12px', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>Quick Tip</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                            Select 'Category Distribution' view to see the breakdown for the selected filter.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
