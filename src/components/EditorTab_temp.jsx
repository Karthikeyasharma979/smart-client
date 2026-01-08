
const EditorTab = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [score, setScore] = useState(85);

    // Basic word count
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    const chars = content.length;

    return (
        <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
            {/* Main Writing Area */}
            <div className="glass-panel" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(20, 20, 25, 0.6)',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)' }}>
                    <input
                        type="text"
                        placeholder="Untitled Document"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                <textarea
                    placeholder="Type or paste your text here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        flex: 1,
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        padding: '32px',
                        resize: 'none',
                        outline: 'none',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: 'var(--text-primary)',
                        fontFamily: 'Inter, sans-serif'
                    }}
                />

                <div style={{ padding: '12px 32px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <div>{words} words · {chars} chars</div>
                    <div>Last saved: Just now</div>
                </div>
            </div>

            {/* Analysis Sidebar */}
            <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Overall Score */}
                <div className="glass-panel" style={{ padding: '24px 24px 20px', borderRadius: '24px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '8px solid var(--glass-border)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '8px solid var(--accent-color)', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
                        <span style={{ fontSize: '2rem', fontWeight: 800 }}>{score}</span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Overall Score</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Good job! A few things to fix.</p>
                    <button className="btn-primary" style={{ marginTop: '16px', width: '100%', padding: '10px' }}>See Performance</button>
                </div>

                {/* Categories */}
                <div className="glass-panel" style={{ padding: '16px', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <AnalysisItem label="Correctness" count={3} color="#FF5F56" />
                    <AnalysisItem label="Clarity" count={1} color="#00C2FF" />
                    <AnalysisItem label="Engagement" count={0} color="#00FF9D" />
                    <AnalysisItem label="Delivery" count={2} color="#9D00FF" />
                </div>
            </div>
        </div>
    );
};

const AnalysisItem = ({ label, count, color }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        background: 'rgba(255,255,255,0.02)'
    }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            <span style={{ fontWeight: 500 }}>{label}</span>
        </div>
        {count > 0 ? (
            <span style={{ background: color, color: '#000', padding: '2px 8px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>{count}</span>
        ) : (
            <LuCheckCircle size={16} color="var(--text-secondary)" />
        )}
    </div>
);
