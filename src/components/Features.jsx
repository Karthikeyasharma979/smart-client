import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSparkles, LuZap, LuScanSearch, LuRocket, LuTrendingUp, LuSearch } from 'react-icons/lu';

const Features = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);

    const featuresData = [
        {
            id: 0,
            title: "GenAI",
            subtitle: "Co-Pilot.",
            subtitleColor: "#a3e635",
            desc: "Not just a chatbot. An intelligent partner that drafts, edits, and refines your content in real-time. Overcome writer's block instantly.",
            featuresList: ["Context-aware suggestions", "Tone adjustment", "Multi-format drafting"],
            icon: <LuSparkles />,
            mockup: {
                mainTitle: "Content Gen",
                mainValue: "2,500w",
                mainLabel: "Generated today",
                sideName: "AI Model",
                sideAmount: "98%",
                sideLabel: "Accuracy Score",
                transactions: [
                    { name: 'Blog Draft', type: 'Generated', color: '#e0e7ff', icon: '📝' },
                    { name: 'Email Rewriter', type: 'Polished', color: '#fce7f3', icon: '✉️' },
                    { name: 'Story Idea', type: 'Brainstormed', color: '#f0fdf4', icon: '💡' },
                ],
                graphColor: "#a3e635"
            }
        },
        {
            id: 1,
            title: "Instant",
            subtitle: "Summaries.",
            subtitleColor: "#60a5fa",
            desc: "Don't drown in data. Turn hours of reading into minutes of understanding. Paste long text and get actionable insights immediately.",
            featuresList: ["Key point extraction", "Action item detection"],
            icon: <LuZap />,
            mockup: {
                mainTitle: "Time Saved",
                mainValue: "4.5 hrs",
                mainLabel: "This week",
                sideName: "Summarizer",
                sideAmount: "12 Docs",
                sideLabel: "Processed",
                transactions: [
                    { name: 'Annual Report', type: 'Summarized', color: '#ffdddd', icon: '📊' },
                    { name: 'Research Paper', type: 'Condensed', color: '#daeeff', icon: '📄' },
                    { name: 'Meeting Notes', type: 'Action Items', color: '#fff1f2', icon: 'M' },
                ],
                graphColor: "#60a5fa"
            }
        },
        {
            id: 2,
            title: "Deep",
            subtitle: "Text Compare.",
            subtitleColor: "#f472b6",
            desc: "Instantly check if two texts are same or different. Our comparison engine highlights matching segments and provides a detailed similarity score.",
            featuresList: ["Side-by-side comparison", "Identical phrase highlighting", "Instant similarity score"],
            icon: <LuScanSearch />,
            mockup: {
                mainTitle: "Originality",
                mainValue: "100%",
                mainLabel: "Unique Content",
                sideName: "Comparison",
                sideAmount: "95%",
                sideLabel: "Similarity Score",
                transactions: [
                    { name: 'Thesis Final', type: 'Verified', color: '#fff1f2', icon: '✅' },
                    { name: 'Client Article', type: 'Safe', color: '#f0fdf4', icon: '🛡️' },
                    { name: 'Essay Draft', type: 'Checking...', color: '#fff7ed', icon: '⏳' },
                ],
                graphColor: "#f472b6"
            }
        },
        {
            id: 3,
            title: "Smart",
            subtitle: "Analytics.",
            subtitleColor: "#c084fc",
            desc: "Write better, every day. Track your vocabulary richness, readability scores, and tone consistency with detailed writing analytics.",
            featuresList: ["Vocabulary richness", "Readability scores", "Tone consistency"],
            icon: <LuTrendingUp />,
            mockup: {
                mainTitle: "Readability",
                mainValue: "Grade 12",
                mainLabel: "Expert Level",
                sideName: "Vocabulary",
                sideAmount: "Top 5%",
                sideLabel: "Richness",
                transactions: [
                    { name: 'Tone Check', type: 'Professional', color: '#f5f3ff', icon: '👔' },
                    { name: 'SEO Score', type: '95/100', color: '#ecfdf5', icon: '📈' },
                    { name: 'Grammar', type: 'Perfect', color: '#fffbeb', icon: '✨' },
                ],
                graphColor: "#c084fc"
            }
        },
        {
            id: 4,
            title: "Live",
            subtitle: "Web Search.",
            subtitleColor: "#00FF9D",
            desc: "Connect your writing to the world. Search the web directly from your editor and insert verified links and citations instantly.",
            featuresList: ["DuckDuckGo integration", "Instant link insertion", "Deep-web research"],
            icon: <LuSearch />,
            mockup: {
                mainTitle: "Search Activity",
                mainValue: "450+",
                mainLabel: "Queries processed",
                sideName: "Connectivity",
                sideAmount: "Real-time",
                sideLabel: "Live Data",
                transactions: [
                    { name: 'Latest Trends', type: 'Fetched', color: '#e0f2fe', icon: '🌐' },
                    { name: 'Quick Fact-check', type: 'Verified', color: '#f0fdf4', icon: '✅' },
                    { name: 'Citation Hunt', type: 'Stored', color: '#fdf2f8', icon: '🔗' },
                ],
                graphColor: "#00FF9D"
            }
        }
    ];

    const activeData = featuresData[activeFeature];

    return (
        <section className="feature-section-dark">
            <div className="container feature-container">

                {/* Main Feature Showcase (Interactive) */}
                <div className="feature-showcase" style={{ gap: '80px' }}>
                    {/* Text Side */}
                    <div className="feature-text-content" style={{ position: 'relative' }}>

                        <h2>
                            {activeData.title} <br />
                            <span style={{ color: activeData.subtitleColor, transition: 'color 0.3s' }}>{activeData.subtitle}</span>
                        </h2>
                        <p>
                            {activeData.desc}
                        </p>

                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                            {activeData.featuresList.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '1rem', opacity: 0.9 }}>
                                    <span style={{ color: activeData.subtitleColor }}>✓</span> {item}
                                </li>
                            ))}
                        </ul>

                        <button onClick={() => navigate('/dashboard')} className="btn-learn-more">
                            Learn more
                        </button>

                        {/* Feature Navigation Tabs */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                            {featuresData.map((feature, index) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveFeature(index)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: activeFeature === index ? 'var(--accent-color, #fff)' : 'rgba(255,255,255,0.05)',
                                        color: activeFeature === index ? '#000' : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        transform: activeFeature === index ? 'scale(1.1)' : 'scale(1)',
                                        boxShadow: activeFeature === index ? '0 0 20px rgba(255,255,255,0.3)' : 'none'
                                    }}>
                                    <span style={{ fontSize: '20px' }}>{feature.icon}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mockup Side - Dynamic Content */}
                    <div className="mockup-stage" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="mockup-elements" style={{ position: 'relative', width: '100%', height: 'auto' }}>

                            {/* Card 1: Main Dashboard */}
                            <div className="dashboard-card card-main" style={{
                                position: 'relative',
                                top: '0',
                                left: '0',
                                width: '100%',
                                maxWidth: '650px',
                                height: 'auto',
                                minHeight: '360px',
                                transform: 'none',
                                margin: '0 auto'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 700 }}>{activeData.mockup.mainTitle}</h3>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
                                            Analysis based on your recent activity
                                        </p>
                                    </div>
                                    <div style={{ color: activeData.subtitleColor }}>
                                        {activeData.icon}
                                    </div>
                                </div>

                                <div className="chart-area feature-text-content">
                                    <div className="chart-line" style={{ background: activeData.mockup.graphColor, transition: 'background 0.3s ease' }}></div>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
                                        Your {activeData.title.split('\n')[0]} Score has improved by <span style={{ color: activeData.subtitleColor, fontWeight: 'bold' }}>12%</span> this week.
                                        {activeFeature === 0 ? " The AI suggestions are becoming more tailored to your style." :
                                            activeFeature === 1 ? " You're summarizing articles 2x faster than average." :
                                                activeFeature === 2 ? " Your content is 100% original and citation-ready." :
                                                    activeFeature === 3 ? " Vocabulary richness allows you to target more complex demographics." :
                                                        " Real-time search ensures your data is always up-to-date and verified."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Removed Secondary Feature */}

            </div>
        </section>
    );
};

export default Features;
