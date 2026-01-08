import React, { useEffect } from 'react';
import { LuSparkles, LuZap, LuScanSearch, LuBrainCircuit, LuLock, LuCheck } from 'react-icons/lu';

const FeaturesPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            id: 'gen-ai',
            icon: LuSparkles,
            title: "Generative AI Chat",
            subtitle: "Your Intelligent Brainstorming Partner",
            description: "Stuck on a blank page? Our Gen AI Chat isn't just a chatbot; it's a creative co-pilot. Whether you need to draft an email, outline a blog post, or rephrase a tricky sentence, just ask. It understands context, tone, and nuance, ensuring your voice remains authentic while enhancing clarity.",
            details: [
                "Context-aware suggestions",
                "Tone adjustment (Professional, Friendly, Persuasive)",
                "Real-time drafting assistance"
            ]
        },
        {
            id: 'summaries',
            icon: LuZap,
            title: "Instant Summaries",
            subtitle: "Digest Content in Seconds",
            description: "Don't drown in information. Our Instant Summaries tool digests long articles, reports, and whitepapers into concise, bulleted visuals. It identifies key arguments, data points, and conclusions, allowing you to stay informed without spending hours reading.",
            details: [
                "One-click summarization",
                "Key takeaways extraction",
                "Adjustable summary length"
            ]
        },
        {
            id: 'plagiarism',
            icon: LuScanSearch,
            title: "Deep Scan Plagiarism Detection",
            subtitle: "Originality Guaranteed",
            description: "Ensure your work is truly yours. Our detection engine scans against a database of over 16 billion web pages and academic papers. It highlights potential matches and provides citation suggestions, making it the standard for academic and professional integrity.",
            details: [
                "Billions of sources scanned",
                "Detailed match percentage",
                "Integrated citation generator"
            ]
        },
        {
            id: 'qa',
            icon: LuBrainCircuit,
            title: "Interactive Document Q&A",
            subtitle: "Have a Conversation with Your Data",
            description: "Static documents are a thing of the past. Upload any PDF or Doc and start chatting with it. Ask specific questions like 'What is the projected revenue?' or 'What are the main risk factors?' and get instant, cited answers directly from the text.",
            details: [
                "Chat with PDF/Word/Docs",
                "Citation-backed answers",
                "Multi-document analysis"
            ]
        },
        {
            id: 'security',
            icon: LuLock,
            title: "Enterprise-Grade Security",
            subtitle: "Your Data, Protected",
            description: "We take security seriously. Your data is encrypted both in transit and at rest using industry-standard protocols. We are SOC2 and ISO compliant, and we never use your private data to train our public models without explicit permission.",
            details: [
                "SOC2 & ISO Compliant",
                "End-to-end encryption",
                "Private cloud deployment options"
            ]
        }
    ];

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '100px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>

            {/* Header */}
            <header className="container" style={{ textAlign: 'center', marginBottom: '100px' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '24px' }}>
                    Powerful Features for <br />
                    <span className="glow-text" style={{ color: 'var(--accent-color)' }}>Modern Writing</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto' }}>
                    Explore the suite of tools designed to elevate your communication, ensure originality, and streamline your workflow.
                </p>
            </header>

            {/* Detailed Feature List */}
            <div className="container">
                {features.map((feature, index) => (
                    <div key={feature.id} id={feature.id} style={{
                        display: 'flex',
                        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                        alignItems: 'center',
                        gap: '80px',
                        marginBottom: '150px'
                    }}>
                        {/* Text Side */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'rgba(0, 255, 157, 0.1)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '24px',
                                border: '1px solid var(--accent-color)'
                            }}>
                                <feature.icon size={32} color="var(--accent-color)" />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{feature.title}</h2>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)', marginBottom: '24px', fontWeight: 500 }}>{feature.subtitle}</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                                {feature.description}
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {feature.details.map((detail, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '1.05rem' }}>
                                        <LuCheck color="var(--accent-color)" size={20} />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Visual Side */}
                        <div style={{ flex: 1 }}>
                            {feature.id === 'gen-ai' ? (
                                <div className="glass-panel" style={{
                                    height: '400px',
                                    width: '100%',
                                    borderRadius: '32px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    padding: '40px'
                                }}>
                                    {/* Mock Chat Interface */}

                                    {/* User Bubble */}
                                    <div style={{
                                        alignSelf: 'flex-end',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        padding: '16px 24px',
                                        borderRadius: '24px 24px 4px 24px',
                                        marginBottom: '32px',
                                        maxWidth: '85%',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        transform: 'translateY(10px)',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.8s ease-out forwards 0.2s'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>Write a catchy tagline for our new coffee brand.</p>
                                    </div>

                                    {/* AI Bubble */}
                                    <div style={{
                                        alignSelf: 'flex-start',
                                        background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1), rgba(0, 255, 157, 0.05))',
                                        border: '1px solid var(--accent-color)',
                                        padding: '24px',
                                        borderRadius: '4px 24px 24px 24px',
                                        maxWidth: '90%',
                                        width: '100%',
                                        boxShadow: '0 10px 40px -10px rgba(0, 255, 157, 0.15)',
                                        transform: 'translateY(10px)',
                                        opacity: 0,
                                        animation: 'fadeInUp 0.8s ease-out forwards 0.6s'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                            <LuSparkles style={{ color: 'var(--accent-color)' }} size={18} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '0.5px' }}>AI SUGGESTION</span>
                                        </div>
                                        <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: 500 }}>
                                            <p style={{ margin: 0 }}>"Awaken Your Senses, One Sip at a Time." ☕✨</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                            <div style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Short</div>
                                            <div style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '100px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Punchy</div>
                                        </div>
                                    </div>

                                    {/* Background Decor */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '300px',
                                        height: '300px',
                                        background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)',
                                        opacity: 0.05,
                                        filter: 'blur(60px)',
                                        borderRadius: '50%',
                                        zIndex: -1
                                    }} />

                                </div>
                            ) : (
                                <div className="glass-panel" style={{
                                    height: '400px',
                                    width: '100%',
                                    borderRadius: '32px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                                }}>
                                    {/* Abstract Visual Representation for other items */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '300px',
                                        height: '300px',
                                        background: `radial-gradient(circle, ${index % 2 === 0 ? 'var(--accent-color)' : '#9D00FF'} 0%, transparent 70%)`,
                                        opacity: 0.1,
                                        filter: 'blur(40px)',
                                        borderRadius: '50%'
                                    }} />

                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <feature.icon size={120} color="rgba(255,255,255,0.05)" style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,157,0.1))' }} />
                                    </div>

                                    {/* Floating Elements (Skeleton) */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '40px',
                                        right: '40px',
                                        left: '40px',
                                        padding: '20px',
                                        background: 'var(--glass-bg)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--glass-border)',
                                        transform: 'translateY(20px)',
                                        opacity: 0.8
                                    }}>
                                        <div style={{ height: '8px', width: '60%', background: 'var(--text-secondary)', borderRadius: '4px', marginBottom: '12px', opacity: 0.5 }} />
                                        <div style={{ height: '8px', width: '90%', background: 'var(--text-secondary)', borderRadius: '4px', marginBottom: '12px', opacity: 0.3 }} />
                                        <div style={{ height: '8px', width: '75%', background: 'var(--text-secondary)', borderRadius: '4px', opacity: 0.4 }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesPage;
