
import React, { useState, useEffect } from 'react';
import {
    LuLayoutDashboard,
    LuSparkles,
    LuZap,
    LuScanSearch,
    LuBrainCircuit,
    LuSettings,
    LuLogOut,
    LuSearch,
    LuBell,
    LuFileText,
    LuPenTool,
    LuSend,
    LuUpload,

    LuPanelLeft,
    LuMoveRight,
    LuMoveLeft,
    LuRefreshCw,
    LuDownload,
    LuCode,
    LuImage,
    LuPaperclip,
    LuChevronDown,
    LuLoader,
    LuArrowUpRight
} from 'react-icons/lu';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import EditorTab from './EditorTab';
import ActivityPulse from './ActivityPulse';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Dashboard Ready', time: 'Just now', unread: true },
        { id: 2, text: 'Welcome Guest', time: '1 min ago', unread: true },
        { id: 3, text: 'System Online', time: '2 mins ago', unread: false }
    ]);
    const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/notionists/svg?seed=Guest');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);

        // Randomize Avatar
        const randomSeed = Math.random().toString(36).substring(7);
        setAvatarUrl(`https://api.dicebear.com/7.x/notionists/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`);

        return () => window.removeEventListener('resize', handleResize);
    }, []);



    const handleLogout = () => {
        navigate('/');
    };

    const addNotification = (text, type = 'info') => {
        setNotifications(prev => {
            if (prev.length > 0) {
                const latest = prev[0];
                const isRecent = (Date.now() - latest.id) < 2000;
                if (latest.text === text && isRecent) {
                    return prev;
                }
            }

            const newNotif = {
                id: Date.now(),
                text,
                time: 'Just now',
                unread: true,
                type
            };
            return [newNotif, ...prev];
        });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab setActiveTab={setActiveTab} />;
            case 'editor': return <EditorTab addNotification={addNotification} />;
            case 'chat': return <ChatTab addNotification={addNotification} />;
            case 'summarizer': return <SummarizerTab addNotification={addNotification} />;
            case 'plagiarism': return <PlagiarismTab addNotification={addNotification} />;
            case 'doc-qa': return <DocQATab addNotification={addNotification} />;
            default: return <OverviewTab setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Sidebar */}
            <aside style={{
                width: isSidebarOpen ? '280px' : '0',
                background: 'var(--sidebar-bg)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                position: isMobile ? 'fixed' : 'sticky',
                top: 0,
                height: '100vh',
                zIndex: 50
            }}>
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={logo} alt="Logo" style={{
                        width: '70px',
                        height: '70px',
                        objectFit: 'contain',
                        borderRadius: '6px'
                    }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, whiteSpace: 'nowrap' }}>STA</span>
                </div>

                <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarItem icon={LuLayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={LuPenTool} label="Write" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
                    <div style={{ height: '1px', background: 'var(--glass-border)', margin: '16px 0' }} />
                    <SidebarItem icon={LuSparkles} label="AI Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
                    <SidebarItem icon={LuZap} label="Summarizer" active={activeTab === 'summarizer'} onClick={() => setActiveTab('summarizer')} />
                    <SidebarItem icon={LuScanSearch} label="Plagiarism Check" active={activeTab === 'plagiarism'} onClick={() => setActiveTab('plagiarism')} />
                    <SidebarItem icon={LuBrainCircuit} label="Document Q&A" active={activeTab === 'doc-qa'} onClick={() => setActiveTab('doc-qa')} />
                </nav>

                <div style={{ padding: '24px 16px', borderTop: '1px solid var(--glass-border)' }}>
                    {/* <SidebarItem icon={LuSettings} label="Settings" /> */}
                    <SidebarItem icon={LuLogOut} label="Exit Dashboard" onClick={handleLogout} />
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Header */}
                <header style={{
                    height: '80px',
                    padding: isMobile ? '0 16px' : '0 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px',
                                borderRadius: '8px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--button-hover)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        >
                            <LuPanelLeft size={24} />
                        </button>
                        <div style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {activeTab === 'chat' ? 'AI Assistant' :
                                activeTab === 'summarizer' ? 'Summarizer' :
                                    activeTab === 'plagiarism' ? 'Plagiarism' :
                                        activeTab === 'doc-qa' ? 'Doc Q&A' : 'Dashboard'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>




                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <LuBell size={20} />
                                {notifications.some(n => n.unread) && (
                                    <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'red', borderRadius: '50%' }} />
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div style={{
                                    position: 'absolute',
                                    top: '40px',
                                    right: '-10px', // Align slightly to the right to prevent cutoff
                                    width: '320px',
                                    background: 'var(--glass-bg)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                                    zIndex: 1000,
                                    padding: '16px',
                                    maxHeight: '400px',
                                    overflowY: 'auto'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Actions</h4>
                                        <button
                                            onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                                            style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--accent-color)',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Mark all read
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map(notif => (
                                                <div key={notif.id} style={{
                                                    padding: '12px',
                                                    background: notif.unread ? 'var(--secondary-bg)' : 'transparent',
                                                    borderRadius: '12px',
                                                    border: '1px solid transparent',
                                                    borderLeft: notif.type === 'success' ? '4px solid #22c55e' : notif.type === 'error' ? '4px solid #ef4444' : '4px solid transparent',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '4px'
                                                }}
                                                    onMouseEnter={e => {
                                                        if (!notif.unread) e.currentTarget.style.background = 'var(--secondary-bg)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!notif.unread) e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: notif.unread ? 600 : 400 }}>
                                                        {notif.text}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {notif.time}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                                                No recent actions.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <img
                            onClick={() => setShowProfileModal(true)}
                            src={avatarUrl}
                            alt="Guest Avatar"
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                objectFit: 'cover',
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </header>

                <div style={{ flex: 1, padding: isMobile ? '16px' : '32px', overflowY: 'auto' }}>
                    {renderContent()}
                </div>
            </main>

            {/* User Profile Modal */}
            {showProfileModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onClick={() => setShowProfileModal(false)}>
                    <div style={{
                        background: 'var(--bg-primary)',
                        padding: '32px', borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        width: '90%', maxWidth: '400px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        animation: 'enterModal 0.3s ease-out'
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ position: 'relative' }}>
                            <img src={avatarUrl} alt="Big Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--glass-bg)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', background: '#fff' }} />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#22c55e', width: '24px', height: '24px', borderRadius: '50%', border: '4px solid var(--bg-primary)' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Welcome, Guest!</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>You are using a temporary guest session. Your work is saved locally.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                            <button
                                onClick={() => {
                                    const seed = Math.random().toString(36).substring(7);
                                    setAvatarUrl(`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`);
                                }}
                                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600 }}
                            >
                                <LuRefreshCw /> Regenerate
                            </button>
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="btn-primary"
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            borderRadius: '12px',
            background: active ? 'var(--accent-color)' : 'transparent',
            color: active ? '#000' : 'var(--text-primary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: active ? 600 : 500,
            fontSize: '1rem',
            textAlign: 'left',
            opacity: active ? 1 : 0.7
        }}
        onMouseEnter={e => {
            if (!active) {
                e.currentTarget.style.background = 'var(--button-hover)';
                e.currentTarget.style.opacity = '1';
            }
        }}
        onMouseLeave={e => {
            if (!active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.opacity = '0.7';
            }
        }}
    >
        <Icon size={20} />
        {label}
    </button>
);

const OverviewTab = ({ setActiveTab }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="dashboard-grid-top">
            {/* Welcome Card */}
            <div className="animate-enter responsive-padding" style={{
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                {/* Aurora Background Layer */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(0,255,157,0.15), transparent 50%), radial-gradient(circle at 0% 0%, rgba(0,194,255,0.1), transparent 50%)',
                    filter: 'blur(40px)',
                    animation: 'aurora 10s infinite alternate',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Welcome to your Workspace! 👋</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', marginBottom: '32px' }}>
                        Your intelligent writing assistant is ready. What would you like to do today?
                    </p>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <button onClick={() => setActiveTab('chat')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LuSparkles /> Start New Chat
                        </button>
                        <button onClick={() => setActiveTab('doc-qa')} style={{
                            padding: '12px 24px',
                            background: 'var(--secondary-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '100px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                            Upload Document
                        </button>
                    </div>
                </div>
            </div>

            {/* Activity Pulse Widget */}
            <div className="animate-enter delay-1" style={{ height: '100%' }}>
                <ActivityPulse />
            </div>
        </div>

        <div>
            <h3 className="animate-enter delay-2" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Quick Access</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="animate-enter delay-3 hover-3d"><ToolCard
                    title="Gen AI Chat"
                    desc="Brainstorm ideas and draft content."
                    icon={LuSparkles}
                    color="#00FF9D"
                    onClick={() => setActiveTab('chat')}
                /></div>
                <div className="animate-enter delay-3 hover-3d"><ToolCard
                    title="Instant Summaries"
                    desc="Get bulleted overviews of long texts."
                    icon={LuZap}
                    color="#FFD700"
                    onClick={() => setActiveTab('summarizer')}
                /></div>
                <div className="animate-enter delay-4 hover-3d"><ToolCard
                    title="Plagiarism Check"
                    desc="Scan text against billions of sources."
                    icon={LuScanSearch}
                    color="#FF5F56"
                    onClick={() => setActiveTab('plagiarism')}
                /></div>
                <div className="animate-enter delay-4 hover-3d"><ToolCard
                    title="Document Q&A"
                    desc="Chat with your PDF files instantly."
                    icon={LuBrainCircuit}
                    color="#00C2FF"
                    onClick={() => setActiveTab('doc-qa')}
                /></div>
            </div>
        </div>
    </div>
);

const ToolCard = ({ title, desc, icon: Icon, color, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            className="glass-panel"
            style={{
                padding: '24px',
                borderRadius: '24px',
                cursor: 'pointer',
                border: isHovered ? `1px solid ${color}` : '1px solid var(--glass-border)',
                background: isHovered ? `linear-gradient(135deg, ${color}10, transparent)` : 'var(--glass-bg)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: isHovered ? `0 20px 40px -10px ${color}30` : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: isHovered ? color : `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? `0 10px 20px -5px ${color}60` : 'none',
                    transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)'
                }}>
                    <Icon size={26} color={isHovered ? '#000' : color} style={{ transition: 'color 0.3s' }} />
                </div>

                {/* Arrow Action */}
                <div style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translate(0, 0)' : 'translate(-10px, 10px)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    color: color
                }}>
                    <LuArrowUpRight size={24} />
                </div>
            </div>

            <h4 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px', color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>{title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{desc}</p>
        </div>
    );
};

// --- Feature Placeholders ---

const ChatTab = ({ addNotification }) => {
    // 1. Personas Configuration
    const personas = {
        friendly: { id: 'friendly', name: 'Friendly', icon: LuSparkles, color: '#00FF9D', greeting: "Hi there! I'm here to help you write something amazing today. 🌟" },
        professional: { id: 'professional', name: 'Professional', icon: LuPenTool, color: '#00C2FF', greeting: "Greetings. I am ready to assist with your professional documentation." },
        creative: { id: 'creative', name: 'Creative', icon: LuZap, color: '#D946EF', greeting: "Let's make some magic! What wild ideas are we cooking up? 🎨" },
        academic: { id: 'academic', name: 'Academic', icon: LuBrainCircuit, color: '#F59E0B', greeting: "Welcome. Let us analyze your text for rigor and clarity." }
    };

    const [activePersona, setActivePersona] = useState('friendly');
    // Start empty to show Hero View
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [activeModel, setActiveModel] = useState('Gemini Fast (Free)');

    const MODEL_MAP = {
        'Gemini Fast (Free)': 'google/gemini-2.0-flash-exp:free',
        'Smart GPT (Free)': 'openai/gpt-oss-120b:free',
        'DeepSeek (Free)': 'tngtech/deepseek-r1t2-chimera:free',
        'Llama 3.1 (Free)': 'meta-llama/llama-3.1-405b-instruct:free'
    };

    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const messagesEndRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const imageInputRef = React.useRef(null);

    const handleImageSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAttachment({ type: 'image', name: file.name, url: URL.createObjectURL(file) });
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAttachment({ type: 'file', name: file.name });
        }
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Handle Persona Change
    const handlePersonaChange = (personaId) => {
        setActivePersona(personaId);
    };

    // Handle Send
    const handleSend = (textOverride) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', type: 'text', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const fetchAIResponse = async () => {


            const selectedModelId = MODEL_MAP[activeModel] || 'meta-llama/llama-3.2-3b-instruct:free';

            try {
                const response = await fetch('/generative', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: textToSend,
                        user: 'dashboard-user',
                        tone: personas[activePersona]?.name?.toLowerCase() || 'friendly',
                        model: selectedModelId
                    })
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    const errorMessage = errData.details || errData.error || response.statusText || 'Network error';
                    throw new Error(errorMessage);
                }

                const data = await response.json();

                setIsTyping(false);
                const aiMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'text',
                    content: data.output || "I'm sorry, I couldn't generate a response."
                };
                setMessages(prev => [...prev, aiMsg]);

                if (addNotification) addNotification('Message processed successfully', 'success');

            } catch (error) {
                console.error("Chat Error:", error);
                setIsTyping(false);
                const errorMsg = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    type: 'text',
                    content: `Error: ${error.message}. Please try again.`
                };
                setMessages(prev => [...prev, errorMsg]);

                if (addNotification) addNotification('Failed to generate response', 'error');
            }
        };

        fetchAIResponse();
    };

    const hasMessages = messages.length > 0;
    const activeColor = personas[activePersona].color;

    return (
        <div className="glass-panel" style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--glass-bg)',
            transition: 'all 0.3s ease'
        }}>

            {!hasMessages ? (
                // --- HERO VIEW ---
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '32px' }}>

                    {/* Glowing Orb Avatar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${activeColor}, #ffffff)`,
                            boxShadow: `0 0 60px ${activeColor}60`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            animation: 'float 6s ease-in-out infinite'
                        }}>
                            {React.createElement(personas[activePersona].icon, { size: 40, color: '#000' })}
                        </div>
                    </div>

                    {/* Greeting */}
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: 700,
                            marginBottom: '12px',
                            background: 'linear-gradient(to right, #fff, #888)',
                            color: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Good evening, John
                        </h2>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                            How can I help you today?
                        </h3>
                    </div>

                    {/* Prompt Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', width: '100%', maxWidth: '600px' }}>
                        {['Brainstorm creative ideas', 'Draft a professional email', 'Summarize this document', 'Debug my code'].map((prompt, i) => (
                            <button key={i}
                                onClick={() => handleSend(prompt)}
                                style={{
                                    padding: '16px 20px',
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = activeColor; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                            >
                                {prompt}
                                <LuMoveRight size={16} style={{ opacity: 0.5 }} />
                            </button>
                        ))}
                    </div>

                    {/* Hero Input */}
                    {/* ThinkAI Style Input Card */}
                    <div style={{
                        width: '100%',
                        maxWidth: '750px',
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: 'none',
                        position: 'relative'
                    }}>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={`How can ${personas[activePersona].name} help you today?`}
                            style={{
                                width: '100%',
                                minHeight: '60px',
                                border: 'none',
                                resize: 'none',
                                background: 'transparent',
                                fontSize: '1.2rem',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                fontFamily: 'inherit',
                                lineHeight: '1.5'
                            }}
                        />

                        {/* Input Bottom Bar */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: attachment ? '8px' : '0',
                            flexWrap: 'wrap', // Allow wrapping on small screens
                            gap: '12px'
                        }}>
                            {/* Left: Model Selector & Persona Selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>

                                {/* Model Selector Trigger */}
                                <div
                                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                    style={{
                                        fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px',
                                        color: 'var(--text-primary)', cursor: 'pointer', userSelect: 'none',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '4px 8px', borderRadius: '6px'
                                    }}
                                >
                                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {activeModel}
                                    </span>
                                    <LuChevronDown size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                                </div>

                                {/* Model Menu */}
                                {isModelMenuOpen && (
                                    <div style={{
                                        position: 'absolute', bottom: 'calc(100% + 4px)', left: '0', top: 'auto',
                                        background: '#1e1e1e',
                                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                                        padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px',
                                        width: 'max-content', minWidth: '160px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 1000,
                                        maxHeight: '240px', overflowY: 'auto'
                                    }}>
                                        {['Gemini 1.5 Pro', 'GPT-4o', 'Deepseek', 'Llama 3 70B'].map(model => (
                                            <button key={model}
                                                onClick={() => { setActiveModel(model); setIsModelMenuOpen(false); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '8px', border: 'none', background: activeModel === model ? 'var(--secondary-bg)' : 'transparent',
                                                    color: 'var(--text-primary)', cursor: 'pointer',
                                                    width: '100%', borderRadius: '8px',
                                                    textAlign: 'left', fontSize: '0.9rem',
                                                    fontWeight: activeModel === model ? 600 : 400
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary-bg)'}
                                                onMouseLeave={e => e.currentTarget.style.background = activeModel === model ? 'var(--secondary-bg)' : 'transparent'}
                                            >
                                                {model}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Persona Dropdown Trigger */}
                                <div
                                    onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(56, 189, 248, 0.1)',
                                        color: '#38bdf8',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        cursor: 'pointer',
                                        userSelect: 'none'
                                    }}
                                >
                                    <LuSparkles size={12} />
                                    {personas[activePersona].name}
                                    <LuChevronDown size={12} />
                                </div>

                                {/* Persona Menu */}
                                {isPersonaMenuOpen && (
                                    <div style={{
                                        position: 'absolute', bottom: 'calc(100% + 4px)', left: '160px', top: 'auto',
                                        background: '#1e1e1e',
                                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                                        padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px',
                                        width: '160px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 1000,
                                        maxHeight: '200px', overflowY: 'auto'
                                    }}>
                                        {Object.values(personas).map(p => (
                                            <button key={p.id}
                                                onClick={() => { setActivePersona(p.id); setIsPersonaMenuOpen(false); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    padding: '8px', border: 'none', background: 'transparent',
                                                    color: 'var(--text-primary)', cursor: 'pointer',
                                                    width: '100%', borderRadius: '8px',
                                                    textAlign: 'left', fontSize: '0.9rem'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary-bg)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                                <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageSelect} />
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />

                                <button onClick={() => imageInputRef.current.click()} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#2a2a2a', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                    <LuImage size={20} />
                                </button>
                                <button onClick={() => fileInputRef.current.click()} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#2a2a2a', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                                    <LuPaperclip size={20} />
                                </button>
                                <button onClick={() => handleSend()} style={{ width: '36px', height: '36px', borderRadius: '8px', background: activeColor, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px' }}>
                                    <LuSend color="#000" size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Attachment Preview */}
                        {attachment && (
                            <div style={{
                                position: 'absolute', top: '16px', right: '16px',
                                background: 'var(--secondary-bg)', padding: '4px 12px',
                                borderRadius: '100px', fontSize: '0.8rem',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                                {attachment.type === 'image' ? <LuImage size={12} /> : <LuPaperclip size={12} />}
                                {attachment.name}
                                <button onClick={() => setAttachment(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginLeft: '4px' }}>x</button>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div style={{ width: '100%', maxWidth: '750px', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AI can make mistakes. Please double-check responses.</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span>Use</span>
                            <span style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>shift + return</span>
                            <span>for new line</span>
                        </div>
                    </div>

                    {/* Persona Selector (Hidden/integrated or reimagined) - Removing old pills to match design */}

                </div>
            ) : (
                // --- CHAT INTERFACE ---
                <>
                    {/* Header: Persona Selector */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${personas[activePersona].color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {React.createElement(personas[activePersona].icon, { size: 20, color: personas[activePersona].color })}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{personas[activePersona].name} Assistant</h3>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', background: 'var(--input-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            {Object.values(personas).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handlePersonaChange(p.id)}
                                    title={p.name}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                        background: activePersona === p.id ? p.color : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {React.createElement(p.icon, { size: 16, color: activePersona === p.id ? '#000' : 'var(--text-secondary)' })}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                {msg.type === 'text' ? (
                                    <div style={{
                                        background: msg.sender === 'user' ? activeColor : 'rgba(255,255,255,0.05)',
                                        color: msg.sender === 'user' ? '#000' : 'var(--text-primary)',
                                        border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                                        padding: '16px 24px',
                                        borderRadius: msg.sender === 'user' ? '24px 24px 0 24px' : '24px 24px 24px 0',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                        lineHeight: '1.6'
                                    }}>
                                        {msg.content}
                                    </div>
                                ) : (
                                    /* Artifact Card */
                                    <div style={{
                                        width: '400px',
                                        background: 'var(--secondary-bg)',
                                        border: `1px solid ${activeColor}`,
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: `0 8px 32px -8px ${activeColor}30`
                                    }}>
                                        <div style={{ background: `${activeColor}10`, padding: '12px 16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem', color: activeColor }}>
                                                {msg.isCode ? <LuCode /> : <LuFileText />} {msg.title}
                                            </div>
                                            <button style={{ fontSize: '0.8rem', background: 'var(--bg-primary)', border: 'none', padding: '4px 12px', borderRadius: '100px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                                {msg.action}
                                            </button>
                                        </div>
                                        <div style={{ padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', background: 'var(--chat-bubble-bg)', padding: '12px 20px', borderRadius: '24px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0s' }} />
                                <div style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
                                <div style={{ width: '8px', height: '8px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Area */}
                    <div style={{ padding: '24px', background: 'rgba(0,0,0,0.02)', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={() => setIsVoiceMode(true)}
                                style={{
                                    width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer',
                                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                            </button>

                            <div style={{ flex: 1, position: 'relative' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Ask ${personas[activePersona].name} anything...`}
                                    style={{
                                        width: '100%',
                                        padding: '16px 60px 16px 24px',
                                        background: 'var(--input-bg)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '100px',
                                        color: 'var(--text-primary)',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    onClick={() => handleSend()}
                                    style={{
                                        position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: activeColor,
                                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                        boxShadow: `0 4px 12px ${activeColor}40`
                                    }}
                                >
                                    <LuSend color="#000" size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Voice Mode Overlay (Preserved) */}
            {isVoiceMode && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 100,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>I'm Listening...</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Speak naturally to describe your request</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '60px', marginBottom: '60px' }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{
                                width: '8px',
                                height: '20%',
                                background: activeColor,
                                borderRadius: '100px',
                                animation: `wave 1s ease-in-out infinite ${i * 0.1}s`
                            }} />
                        ))}
                    </div>

                    <button
                        onClick={() => setIsVoiceMode(false)}
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: '#FF5F56', color: '#fff', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(255, 95, 86, 0.4)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ width: '24px', height: '24px', background: '#fff', borderRadius: '4px' }} />
                    </button>

                    <style>{`
                        @keyframes wave {
                            0%, 100% { height: 20%; opacity: 0.5; }
                            50% { height: 100%; opacity: 1; }
                        }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                    `}</style>
                </div>
            )}
        </div>
    );
};

const SummarizerTab = ({ addNotification }) => {
    // State for the Enhanced Distillery
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOutput, setShowOutput] = useState(false);
    const [summaryLength, setSummaryLength] = useState('medium'); // 'short' | 'medium' | 'long'
    const [summaryFormat, setSummaryFormat] = useState('bullets'); // 'bullets' | 'paragraph'
    const [particles, setParticles] = useState([]);
    const [inputText, setInputText] = useState('');

    // Pre-filled text for demo
    const defaultText = "Artificial Intelligence (AI) simulates human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions), and self-correction. Particular applications of AI include expert systems, speech recognition, and machine vision.";

    const [summaryResult, setSummaryResult] = useState('');

    const handleSummarize = async () => {
        const textToSummarize = inputText.trim() || defaultText;
        if (!textToSummarize) return;

        setIsProcessing(true);
        setShowOutput(false);
        setParticles([]);
        setSummaryResult(''); // Clear previous result

        // 1. Emit Particles from Input (Left -> Center)
        const inboundParticles = Array.from({ length: 12 }).map((_, i) => ({
            id: `in-${i}`,
            delay: Math.random() * 0.5,
            type: 'inbound'
        }));
        setParticles(inboundParticles);

        try {
            // 2. Call Backend API
            const response = await fetch('/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: textToSummarize,
                    user: 'dashboard-user',
                    length: summaryLength,
                    format: summaryFormat
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || 'Failed to summarize');
            }

            const data = await response.json();
            setSummaryResult(data.output);

            // 3. Process & Emit Output Particles (Center -> Right)
            const outboundParticles = Array.from({ length: 12 }).map((_, i) => ({
                id: `out-${i}`,
                delay: Math.random() * 0.5,
                type: 'outbound'
            }));
            setParticles(prev => [...prev, ...outboundParticles]);

            // 4. Show Result after a short animation buffer
            setTimeout(() => {
                setIsProcessing(false);
                setShowOutput(true);
                if (addNotification) addNotification('Summary generated successfully!', 'success');
            }, 1000);

        } catch (error) {
            console.error("Summarize Error:", error);
            setIsProcessing(false);
            setSummaryResult(`Error: ${error.message}`);
            setShowOutput(true); // Show error payload
            if (addNotification) addNotification('Failed to generate summary.', 'error');
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {/* Header / Config Bar */}
            <div className="responsive-header-stack">
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LuZap color="var(--accent-color)" /> Text Distillery
                </h2>

                {/* Configuration Controls */}
                <div className="responsive-controls">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LENGTH</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {['short', 'medium', 'long'].map(l => (
                                <button key={l}
                                    onClick={() => setSummaryLength(l)}
                                    style={{
                                        padding: '4px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                        background: summaryLength === l ? 'var(--accent-color)' : 'transparent',
                                        color: summaryLength === l ? '#000' : 'var(--text-secondary)',
                                        fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s'
                                    }}>
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--glass-border)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>FORMAT</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setSummaryFormat('bullets')} title="Bullet Points" className={`control-knob ${summaryFormat === 'bullets' ? 'active' : ''}`} style={{ width: '32px', height: '32px' }}>
                                <LuLayoutDashboard size={14} />
                            </button>
                            <button onClick={() => setSummaryFormat('paragraph')} title="Paragraph" className={`control-knob ${summaryFormat === 'paragraph' ? 'active' : ''}`} style={{ width: '32px', height: '32px' }}>
                                <LuFileText size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stage */}
            <div className="distiller-grid" style={{ flex: 1, alignItems: 'center', position: 'relative' }}>

                {/* Left: Input Chamber */}
                <div className="glass-panel" style={{
                    height: '100%', padding: '24px', display: 'flex', flexDirection: 'column',
                    borderRadius: '24px', border: '1px solid var(--glass-border)',
                    position: 'relative', overflow: 'hidden', zIndex: 2
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LuFileText /> Raw Source</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inputText.length || defaultText.length} chars</span>
                    </div>
                    <textarea
                        placeholder="Paste your long text here..."
                        defaultValue={defaultText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="editor-min-height"
                        style={{
                            flex: 1, background: 'var(--input-bg)', border: 'none', borderRadius: '16px',
                            padding: '16px', color: 'var(--text-primary)', resize: 'none', outline: 'none',
                            fontSize: '1rem', lineHeight: '1.6', fontFamily: 'inherit'
                        }}
                    />

                    {/* Scanner Effect Overlay */}
                    {isProcessing && (
                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'rgba(0,0,0,0.2)' }}>
                            <div className="scanner-line" />
                        </div>
                    )}
                </div>

                {/* Center: The Core Engine */}
                <div style={{ width: '160px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>

                    {/* Pipe Connections */}
                    <div className="distiller-pipe hide-on-mobile" style={{ width: '50%', left: '0', top: '50%', transform: 'translateY(-50%)' }} />
                    <div className="distiller-pipe hide-on-mobile" style={{ width: '50%', right: '0', top: '50%', transform: 'translateY(-50%)' }} />

                    {/* The Core */}
                    <div
                        onClick={handleSummarize}
                        className={`distiller-core ${isProcessing ? 'high-speed' : ''}`}
                        style={{
                            width: '90px', height: '90px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '4px solid rgba(0,0,0,0.5)', zIndex: 10
                        }}
                    >
                        <LuZap size={40} color={isProcessing ? '#fff' : '#000'} style={{ zIndex: 11 }} />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleSummarize}
                        disabled={isProcessing}
                        className="btn-primary"
                        style={{
                            marginTop: '24px', padding: '10px 32px', fontSize: '1rem',
                            opacity: isProcessing ? 0.5 : 1, transform: isProcessing ? 'scale(0.9)' : 'scale(1)'
                        }}
                    >
                        {isProcessing ? 'PROCESSING' : 'DISTILL'}
                    </button>

                    {/* Particles */}
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="particle"
                            style={{
                                width: '6px', height: '6px', background: 'var(--accent-color)',
                                left: '50%', top: '50%',
                                animation: p.type === 'inbound'
                                    ? `flyToCenter 1s ease-in forwards ${p.delay}s`
                                    : `flyFromCenter 1s ease-out forwards ${p.delay}s`,
                                '--sx': '0px', '--sy': '0px',
                                '--tx': p.type === 'inbound' ? '-140px' : '140px', // Move from/to sides horizontally
                                '--ty': Math.random() * 40 - 20 + 'px' // Slight vertical scatter
                            }}
                        />
                    ))}
                </div>

                {/* Right: Output Chamber */}
                <div className="glass-panel" style={{
                    height: '100%', padding: '24px', display: 'flex', flexDirection: 'column',
                    borderRadius: '24px', border: '1px solid var(--glass-border)',
                    background: showOutput ? 'linear-gradient(135deg, rgba(0,255,157,0.05), var(--glass-bg))' : 'var(--glass-bg)',
                    transition: 'all 0.5s', zIndex: 2, position: 'relative'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: showOutput ? 'var(--accent-color)' : 'inherit' }}>
                            <LuSparkles /> Distilled Insight
                        </h3>
                        {showOutput && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button title="Copy" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><LuDownload /></button>
                            </div>
                        )}
                    </div>

                    {showOutput ? (
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {summaryFormat === 'bullets' ? (
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {summaryResult.split(/\n|•|- /).filter(item => item.trim().length > 0).map((item, i) => (
                                        <li key={i} style={{
                                            display: 'flex', gap: '12px', alignItems: 'flex-start',
                                            animation: `fadeIn 0.5s ease backwards ${i * 0.2}s`
                                        }}>
                                            <span style={{ marginTop: '6px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', flexShrink: 0 }} />
                                            <span style={{ lineHeight: '1.6' }}>{item.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ lineHeight: '1.8', animation: 'fadeIn 0.5s ease', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                                    {summaryResult}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', opacity: 0.5 }}>
                            <LuZap size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                            <p>Ready to distill.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PlagiarismTab = ({ addNotification }) => {
    // State for Input and Analysis
    const [step, setStep] = useState('input'); // 'input', 'scanning', 'results'
    const [activeConcept, setActiveConcept] = useState('isometric'); // 'isometric' | 'forensic'
    const [text1, setText1] = useState(''); // Original
    const [text2, setText2] = useState(''); // Suspect
    const [scanProgress, setScanProgress] = useState(0);
    const [analysisData, setAnalysisData] = useState([]);
    const [matchPercentage, setMatchPercentage] = useState(0);

    // --- 1. Comparison Logic ---
    const compareTexts = (original, suspect) => {
        if (!original || !suspect) return [];

        // Simple sentence tokenizer (splitting by period, question mark, exclamation)
        const suspectSentences = suspect.match(/[^.?!]+[.?!]+[\])'"]*|.+/g) || [suspect];

        let totalMatches = 0;
        let processedData = suspectSentences.map((sentence, index) => {
            const cleanSentence = sentence.trim();
            if (cleanSentence.length < 10) return { id: index, text: sentence, type: 'safe', score: 0 }; // Ignore very short fragments

            // Check if this sentence frame exists in original text
            const isMatch = original.toLowerCase().includes(cleanSentence.toLowerCase());

            if (isMatch) totalMatches++;

            return {
                id: index,
                text: sentence,
                type: isMatch ? 'danger' : 'safe',
                score: isMatch ? 100 : 0
            };
        });

        // Calculate %
        const percentage = Math.round((totalMatches / suspectSentences.length) * 100);
        setMatchPercentage(percentage);
        return processedData;
    };

    const handleAnalyze = () => {
        if (!text1 || !text2) return;
        setStep('scanning');
        setScanProgress(0);

        // Simulation of scanning delay
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Perform Actual Comparison
                    const data = compareTexts(text1, text2);
                    setAnalysisData(data);

                    setTimeout(() => {
                        setStep('results');
                        if (addNotification) addNotification('Plagiarism check completed', 'success');
                    }, 500);
                    return 100;
                }
                return prev + 4; // Faster scan
            });
        }, 50);
    };

    const resetAnalysis = () => {
        setStep('input');
        setScanProgress(0);
        setAnalysisData([]);
        setMatchPercentage(0);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

            {/* --- STEP 1: INPUT --- */}
            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', gap: '24px',
                position: 'absolute', inset: 0,
                transform: step === 'input' ? 'translateX(0)' : 'translateX(-100%)',
                opacity: step === 'input' ? 1 : 0, transition: 'all 0.5s ease',
                pointerEvents: step === 'input' ? 'all' : 'none'
            }}>
                <div style={{ textAlign: 'center', margin: '0 auto', maxWidth: '600px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Plagiarism Checker</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Compare your text against an original source to detect similarities relative to our 3D visualization engine.</p>
                </div>

                <div className="flex-stack-mobile" style={{ gap: '24px', flex: 1, minHeight: 0 }}>
                    {/* Source Text */}
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '12px' }}>ORIGINAL SOURCE</div>
                        <textarea
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            placeholder="Paste the original content here..."
                            style={{ flex: 1, background: 'transparent', border: 'none', resize: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6' }}
                        />
                    </div>
                    {/* Suspect Text */}
                    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '12px' }}>SUSPECT TEXT</div>
                        <textarea
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            placeholder="Paste the text you want to check..."
                            style={{ flex: 1, background: 'transparent', border: 'none', resize: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '24px' }}>
                    <button
                        onClick={handleAnalyze}
                        disabled={!text1 || !text2}
                        className="btn-primary"
                        style={{ padding: '16px 64px', fontSize: '1.1rem', opacity: (!text1 || !text2) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <LuScanSearch size={20} /> ANALYZE CONTENT
                    </button>
                    <button
                        onClick={() => {
                            setText1("Artificial Intelligence is the intelligence of machines or software, as opposed to the intelligence of living beings, primarily of humans. It is a field of study in computer science that develops and studies intelligent machines. Such machines may be called AIs.");
                            setText2("Artificial Intelligence is the intelligence of machines or software. It is unlike the natural intelligence displayed by humans and animals. It is a field of study in computer science that develops and studies intelligent machines.");
                        }}
                        style={{ marginTop: '16px', background: 'transparent', border: 'none', textDecoration: 'underline', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        Load Demo Data
                    </button>
                </div>
            </div>

            {/* --- STEP 2: SCANNING --- */}
            <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-primary)',
                opacity: step === 'scanning' ? 1 : 0, pointerEvents: 'none', transition: 'all 0.3s'
            }}>
                <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Pulsing Rings */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--accent-color)', opacity: 0.2, animation: 'pulse-glow 2s infinite' }} />
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px var(--accent-glow)' }}>
                        <LuSearch size={40} color="#000" />
                    </div>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginTop: '32px', fontWeight: 600 }}>Analyzing Patterns...</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '8px', fontVariantNumeric: 'tabular-nums' }}>{scanProgress}%</div>
            </div>

            {/* --- STEP 3: RESULTS (CONCEPTS) --- */}
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                transform: step === 'results' ? 'translateY(0)' : 'translateY(20px)',
                opacity: step === 'results' ? 1 : 0, pointerEvents: step === 'results' ? 'all' : 'none',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {/* Result Viz */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--glass-border)', background: '#050505' }}>
                    <PlagiarismResults data={analysisData} matchPercentage={matchPercentage} resetAnalysis={resetAnalysis} />
                </div>
            </div>

        </div>
    );
};

// --- New Concept: DNA Source Map ---
const PlagiarismResults = ({ data, matchPercentage, resetAnalysis }) => {
    // Calculate stats
    const totalSentences = data ? data.length : 0;
    const matches = data ? data.filter(d => d.type === 'danger').length : 0;
    const safe = totalSentences - matches;
    const safePercentage = totalSentences > 0 ? Math.round((safe / totalSentences) * 100) : 100;

    const bg = '#09090b';
    const text = '#fff';
    const border = 'rgba(255,255,255,0.1)';
    const subdued = '#888';

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: bg, color: text }}>
            {/* Header Stats */}
            <div className="plagiarism-stats-header">
                <Stat label="Total Segments" value={totalSentences} color={text} labelColor={subdued} />
                <div className="plagiarism-divider" />
                <Stat label="Matches Found" value={matches} color="#ff4d4d" labelColor={subdued} />
                <div className="plagiarism-divider" />
                <Stat label="Originality Score" value={`${safePercentage}%`} color="#4dffb8" labelColor={subdued} />

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px', gridColumn: 'span 2' }}>
                    <button
                        onClick={resetAnalysis}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: `1px solid ${border}`,
                            borderRadius: '8px',
                            padding: '10px 20px',
                            color: text,
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <LuRefreshCw size={16} /> New Analysis
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.8rem', color: subdued }}>OVERALL MATCH</span>
                        <span style={{ fontSize: '2rem', fontWeight: 800, color: matchPercentage > 0 ? '#ff4d4d' : '#4dffb8' }}>{matchPercentage}%</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Visual Map (Left Side) */}
                <div className="dna-sidebar">
                    <div className="hide-text-mobile" style={{ fontSize: '0.65rem', color: subdued, marginBottom: '10px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '2px' }}>DNA SEQUENCER</div>
                    <div style={{ width: '8px', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '10px', position: 'relative' }}>
                        {data && data.map((item, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                top: `${(i / totalSentences) * 100}%`,
                                left: 0, right: 0,
                                height: `${(1 / totalSentences) * 100}%`,
                                background: item.type === 'danger' ? '#ff4d4d' : 'transparent',
                                boxShadow: item.type === 'danger' ? '0 0 8px red' : 'none',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                    </div>
                </div>

                {/* Content Stream (Main Area) */}
                <div className="responsive-padding" style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data && data.map((item) => (
                            <div key={item.id} style={{
                                padding: '16px',
                                borderRadius: '12px',
                                background: item.type === 'danger'
                                    ? 'rgba(255, 77, 77, 0.05)'
                                    : 'rgba(255,255,255,0.02)',
                                border: 'none',
                                borderLeft: item.type === 'danger'
                                    ? '4px solid #ff4d4d'
                                    : '4px solid rgba(255,255,255,0.1)',
                                transition: 'all 0.2s',
                                animation: 'fadeIn 0.5s ease backwards',
                                animationDelay: `${item.id * 0.05}s`
                            }}>
                                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: subdued }}>
                                    <span>SEGMENT ID: {item.id.toString().padStart(4, '0')}</span>
                                    {item.type === 'danger' && <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>⚠️ MATCH DETECTED</span>}
                                </div>
                                <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: item.type === 'danger' ? '#ffcccc' : text, margin: 0 }}>
                                    {item.text}
                                </p>
                                {item.type === 'danger' && (
                                    <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.9rem', color: '#ff4d4d', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <LuScanSearch />
                                        <span><strong>Source Match:</strong> Database Record #{Math.floor(Math.random() * 9000) + 1000} (98% Confidence)</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {(!data || data.length === 0) && (
                            <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No analysis data available.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Stat = ({ label, value, color = '#fff', labelColor = '#888' }) => (
    <div>
        <div style={{ fontSize: '0.8rem', color: labelColor, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
);

const DocQATab = ({ addNotification }) => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = React.useRef(null);
    const messagesEndRef = React.useRef(null);

    useEffect(() => {
        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setIsProcessing(true);

            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Upload failed');
                }

                setFile(selectedFile);
                if (selectedFile.type === 'application/pdf') {
                    setFileUrl(URL.createObjectURL(selectedFile));
                } else {
                    setFileUrl(null);
                }

                setIsProcessing(false);
                setMessages([{
                    id: 1,
                    role: 'ai',
                    text: `Analysis complete. I've read "${selectedFile.name}" and I'm ready to answer your questions!`
                }]);
                if (addNotification) addNotification('File uploaded successfully', 'success');

            } catch (err) {
                console.error("Upload Error:", err);
                setIsProcessing(false);
                setMessages([{
                    id: 1,
                    role: 'ai',
                    text: `Error uploading file: ${err.message}. Please try again.`
                }]);
                if (addNotification) addNotification('File upload failed', 'error');
            }
        }
    };

    const handleSendMessage = async (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && inputValue.trim()) {
            const userText = inputValue.trim();
            const userMsg = { id: Date.now(), role: 'user', text: userText };
            setMessages(prev => [...prev, userMsg]);
            setInputValue('');
            setIsTyping(true);

            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: userText })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Query failed');
                }

                const data = await response.json();

                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    text: data.response
                }]);
                if (addNotification) addNotification('Query processed', 'success');

            } catch (err) {
                console.error("Query Error:", err);
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    text: `Error: ${err.message}. Please try again.`
                }]);
                if (addNotification) addNotification('Query failed', 'error');
            }
        }
    };

    return (
        <div className="doc-qa-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Styles for animations */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>

            {/* Document Viewer */}
            <div className="glass-panel doc-qa-panel" style={{
                borderRadius: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--input-bg)',
                display: 'flex',
                alignItems: fileUrl ? 'stretch' : 'center',
                justifyContent: fileUrl ? 'flex-start' : 'center',
                flexDirection: 'column',
                gap: '16px',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                />

                {isProcessing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'fadeIn 0.3s' }}>
                        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                            <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--glass-border)', borderRadius: '50%' }} />
                            <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--accent-color)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Analyzing Document...</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Extracting semantic vectors</div>
                    </div>
                ) : file ? (
                    fileUrl ? (
                        // PDF Preview Mode
                        <div style={{ flex: 1, height: '100%', position: 'relative', animation: 'slideUp 0.4s ease-out' }}>
                            <iframe
                                src={fileUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="PDF Preview"
                            />
                            <div style={{
                                position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                                padding: '8px 16px', borderRadius: '100px', border: '1px solid var(--glass-border)',
                                display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                                <button
                                    onClick={() => { setFile(null); setFileUrl(null); setMessages([]); }}
                                    style={{
                                        background: 'var(--bg-primary)', border: 'none', borderRadius: '50%',
                                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: 'var(--text-secondary)'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Non-PDF File Placeholder
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'slideUp 0.4s ease-out' }}>
                            <div style={{ padding: '20px', background: 'var(--accent-color)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                <LuFileText size={48} color="#000" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{file.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB • Processed & Ready</p>
                            <button
                                className="btn-primary"
                                onClick={() => { setFile(null); setFileUrl(null); setMessages([]); }}
                                style={{ background: 'var(--secondary-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                            >
                                Change Document
                            </button>
                        </div>
                    )
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.5s' }}>
                        <div
                            style={{
                                padding: '40px', borderRadius: '50%', background: 'var(--glass-bg)',
                                border: '1px dashed var(--glass-border)', marginBottom: '24px',
                                cursor: 'pointer', transition: 'all 0.3s'
                            }}
                            onClick={() => fileInputRef.current.click()}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                        >
                            <LuUpload size={48} color="var(--text-secondary)" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Upload Document</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>PDF, DOCX, or TXT (Max 10MB)</p>
                        <button
                            className="btn-primary"
                            onClick={() => fileInputRef.current.click()}
                        >
                            Select File
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Side */}
            <div className="glass-panel doc-qa-panel" style={{ borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LuBrainCircuit color="var(--accent-color)" /> Document Chat
                    </h3>
                </div>

                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Empty State */}
                    {!file && !isProcessing && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <LuSparkles size={40} style={{ marginBottom: '16px' }} />
                            <p style={{ textAlign: 'center', maxWidth: '80%' }}>Upload a document to unlock AI-powered insights.</p>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        >
                            <div style={{
                                padding: '12px 16px',
                                borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--chat-bubble-bg)',
                                color: msg.role === 'user' ? '#000' : 'var(--text-primary)',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.role === 'ai' ? (
                                    <span dangerouslySetInnerHTML={{
                                        __html: msg.text
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/- (.*?)(?=\n|$)/g, '<li>$1</li>')
                                    }} />
                                ) : (
                                    msg.text
                                )}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left', opacity: 0.7 }}>
                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div style={{ alignSelf: 'flex-start', padding: '12px 16px', background: 'var(--chat-bubble-bg)', borderRadius: '16px 16px 16px 0', animation: 'fadeIn 0.3s' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0s' }} />
                                <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.16s' }} />
                                <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.32s' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'var(--input-bg)' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleSendMessage}
                            placeholder={file ? "Ask a question..." : "Upload a document first..."}
                            disabled={!file || isProcessing}
                            style={{
                                width: '100%',
                                padding: '14px 48px 14px 16px',
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                transition: 'all 0.2s',
                                opacity: file && !isProcessing ? 1 : 0.5,
                                cursor: file && !isProcessing ? 'text' : 'not-allowed'
                            }}
                        />
                        <button
                            onClick={() => handleSendMessage({ key: 'Enter' })}
                            disabled={!inputValue.trim()}
                            style={{
                                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                background: inputValue.trim() ? 'var(--accent-color)' : 'transparent',
                                color: inputValue.trim() ? '#000' : 'var(--text-secondary)',
                                border: 'none', borderRadius: '8px', width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: inputValue.trim() ? 'pointer' : 'default',
                                transition: 'all 0.2s'
                            }}
                        >
                            <LuSend size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
