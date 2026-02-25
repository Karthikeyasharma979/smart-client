import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuSparkles, LuZap, LuScanSearch, LuRocket, LuTrendingUp, LuPlane, LuPuzzle, LuUser } from 'react-icons/lu';

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
            desc: "Don't drown in data. Turn hours of reading into minutes of understanding. Upload dense PDFs or paste long text and get actionable insights immediately.",
            featuresList: ["Key point extraction", "Action item detection", "PDF support"],
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
            subtitle: "Scan.",
            subtitleColor: "#f472b6",
            desc: "Guaranteed originality. Our deep scan checks your text against 16 billion+ web pages and academic sources to ensure 100% authentic work.",
            featuresList: ["16B+ source database", "Academic paper matching", "Detailed reports"],
            icon: <LuScanSearch />,
            mockup: {
                mainTitle: "Originality",
                mainValue: "100%",
                mainLabel: "Unique Content",
                sideName: "Plagiarism",
                sideAmount: "0%",
                sideLabel: "Matches Found",
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
                                                    " Vocabulary richness allows you to target more complex demographics."}
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
