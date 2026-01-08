
const ToneButton = ({ icon, label, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        transition: 'all 0.2s',
        textAlign: 'left'
    }}
        onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--accent-color)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
    >
        {icon}
        <span>{label}</span>
    </button>
);
