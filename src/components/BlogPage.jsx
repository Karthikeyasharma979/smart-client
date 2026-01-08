import React, { useEffect } from 'react';
import { LuCalendar, LuUser, LuArrowRight, LuClock } from 'react-icons/lu';

const BlogPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const blogPosts = [
        {
            id: 1,
            title: "The Future of AI in Writing",
            excerpt: "How generative AI is reshaping the way we communicate, from emails to novels, and why the human touch remains essential.",
            author: "Sarah Jenkings",
            date: "June 15, 2024",
            readTime: "5 min read",
            category: "AI & Tech",
            image: "linear-gradient(135deg, #FF6B6B 0%, #556270 100%)"
        },
        {
            id: 2,
            title: "Mastering the Art of Conciseness",
            excerpt: "Tips and tricks to trim the fat from your writing. Learn how to say more with less and keep your reader engaged.",
            author: "David Chen",
            date: "June 10, 2024",
            readTime: "8 min read",
            category: "Writing Tips",
            image: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)"
        },
        {
            id: 3,
            title: "Grammar Myths Debunked",
            excerpt: "Is it really wrong to end a sentence with a preposition? We tackle common grammar misconceptions that might be holding you back.",
            author: "Emily Ross",
            date: "June 05, 2024",
            readTime: "6 min read",
            category: "Grammar",
            image: "linear-gradient(135deg, #A8E6CF 0%, #DCEDC1 100%)"
        },
        {
            id: 4,
            title: "Effective Business Communication",
            excerpt: "Strategies for clear, professional communication in the remote workplace. Avoid misunderstandings and build stronger teams.",
            author: "Michael Scott",
            date: "May 28, 2024",
            readTime: "7 min read",
            category: "Business",
            image: "linear-gradient(135deg, #ffd194 0%, #70e1f5 100%)"
        },
        {
            id: 5,
            title: "The Psychology of Persuasion",
            excerpt: "Understand the psychological triggers that make writing persuasive. Use these principles to write better marketing copy and proposals.",
            author: "Dr. Robert C.",
            date: "May 20, 2024",
            readTime: "10 min read",
            category: "Psychology",
            image: "linear-gradient(135deg, #f83600 0%, #f9d423 100%)"
        },
        {
            id: 6,
            title: "Productivity Hacks for Writers",
            excerpt: "Struggling with writer's block? Here are actionable techniques to boost your daily output and maintain creativity.",
            author: "Lisa Wong",
            date: "May 15, 2024",
            readTime: "4 min read",
            category: "Productivity",
            image: "linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)"
        }
    ];

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '100px', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
            <div className="container">
                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '24px' }}>
                        Insights & <span className="glow-text" style={{ color: 'var(--accent-color)' }}>Ideas</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Expert analysis, writing tips, and industry trends to help you communicate with confidence.
                    </p>
                </header>

                {/* Featured Post (First one) */}
                <div className="glass-panel" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: '80px',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ flex: 1, minHeight: '400px', background: blogPosts[0].image, position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: '24px', left: '24px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>
                            FEATURED
                        </div>
                    </div>
                    <div style={{ flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ color: 'var(--accent-color)', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                            {blogPosts[0].category}
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', lineHeight: '1.2' }}>{blogPosts[0].title}</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                            {blogPosts[0].excerpt}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LuUser /> {blogPosts[0].author}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LuCalendar /> {blogPosts[0].date}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LuClock /> {blogPosts[0].readTime}
                            </div>
                        </div>
                        <button className="btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Read Article <LuArrowRight />
                        </button>
                    </div>
                </div>

                {/* Grid for other posts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                    {blogPosts.slice(1).map(post => (
                        <div key={post.id} className="glass-panel" style={{
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,157,0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ height: '200px', background: post.image }} />
                            <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '12px' }}>
                                    {post.category}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                                    {post.excerpt}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                                    <span>{post.date}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LuClock size={14} /> {post.readTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
