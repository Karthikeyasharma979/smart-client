import React, { useState, useRef } from 'react';
import {
    LuCheck,
    LuBold,
    LuItalic,
    LuUnderline,
    LuCode,
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuQuote,
    LuList,
    LuListOrdered,
    LuPenLine,
    LuSparkles,
    LuSearch,
    LuEye,
    LuChevronDown,
    LuMoveRight,
    LuGlobe,
    LuShieldCheck,
    LuTriangleAlert,
    LuZap,
    LuBookOpen,
    LuBriefcase,
    LuCoffee,
    LuSmile,
    LuGraduationCap,
    LuMaximize2,
    LuMinimize2,
    LuDownload,
    LuFileText,
    LuScissors,
    LuFeather
} from 'react-icons/lu';

const EditorTab = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState('grammar');
    const [isZenMode, setIsZenMode] = useState(false);
    const textareaRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [overallScore, setOverallScore] = useState(85);
    const [issueCounts, setIssueCounts] = useState({ correctness: 0, clarity: 0, engagement: 0, delivery: 0 });

    const handleAnalysis = () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        // MOCK BACKEND CALL - Replace this block with actual fetch request
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisResult({
                suggestions: [
                    { id: 1, type: 'grammar', message: 'Consider using "utilize" instead of "use" for formal tone.' },
                    { id: 2, type: 'style', message: 'Sentence is slightly too long, consider splitting.' }
                ]
            });
            setOverallScore(92);
            setIssueCounts({ correctness: 3, clarity: 1, engagement: 0, delivery: 2 });
            // Example Flask implementation:
            /*
            fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            })
            .then(res => res.json())
            .then(data => setAnalysisResult(data));
            */
        }, 2000);
    };

    // Basic word count
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    const chars = content.length;

    const applyFormat = (type) => {
        // WYSIWYG Formatting
        document.execCommand('styleWithCSS', false, true);
        switch (type) {
            case 'bold': document.execCommand('bold', false, null); break;
            case 'italic': document.execCommand('italic', false, null); break;
            case 'underline': document.execCommand('underline', false, null); break;
            case 'h1': document.execCommand('formatBlock', false, 'H1'); break;
            case 'h2': document.execCommand('formatBlock', false, 'H2'); break;
            case 'quote': document.execCommand('formatBlock', false, 'BLOCKQUOTE'); break;
            case 'list': document.execCommand('insertUnorderedList', false, null); break;
            case 'code': document.execCommand('formatBlock', false, 'PRE'); break;
        }
        if (textareaRef.current) setContent(textareaRef.current.innerText);


    };



    return (
        <div className="flex-stack-mobile" style={{
            height: '100%',
            gap: '24px',
            ...(isZenMode ? {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                background: 'var(--bg-primary)',
                padding: '24px'
            } : {})
        }}>
            {/* Main Writing Area */}

            {/* Main Content Area - Swaps between Editor and Plagiarism Dashboard */}
            <div className="glass-panel" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                border: isFocused ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                background: 'var(--editor-bg)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: isFocused ? '0 0 30px rgba(0, 255, 157, 0.1)' : 'none'
            }}>
                {/* Creative Header */}
                <div className="editor-header-padding" style={{ zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            className="responsive-title"
                            placeholder="Untitled Masterpiece"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                outline: 'none',
                                fontFamily: 'Outfit, sans-serif',
                                marginBottom: '16px'
                            }}
                        />

                        {/* Sleek Toolbar */}
                        <div className="responsive-toolbar" style={{
                            padding: '6px',
                            background: 'var(--toolbar-bg)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            marginBottom: '16px'
                        }}>
                            <ToolbarButton icon={<LuHeading1 />} label="H1" onClick={() => applyFormat('h1')} />
                            <ToolbarButton icon={<LuHeading2 />} label="H2" onClick={() => applyFormat('h2')} />
                            <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
                            <ToolbarButton icon={<LuBold />} label="Bold" onClick={() => applyFormat('bold')} />
                            <ToolbarButton icon={<LuItalic />} label="Italic" onClick={() => applyFormat('italic')} />
                            <ToolbarButton icon={<LuUnderline />} label="Underline" onClick={() => applyFormat('underline')} />
                            <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
                            <ToolbarButton icon={<LuQuote />} label="Quote" onClick={() => applyFormat('quote')} />
                            <ToolbarButton icon={<LuList />} label="List" onClick={() => applyFormat('list')} />
                            <ToolbarButton icon={<LuCode />} label="Code" onClick={() => applyFormat('code')} />
                            <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 4px' }} />
                            <ToolbarButton
                                icon={isAnalyzing ? <LuSparkles className="spin-slow" /> : <LuCheck />}
                                label={isAnalyzing ? "Scanning..." : "Check Grammar"}
                                onClick={handleAnalysis}
                            />
                        </div>
                    </div>



                    <button
                        className="hide-on-mobile"
                        onClick={() => setIsZenMode(!isZenMode)}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '12px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                            marginLeft: '24px'
                        }}
                        title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                    >
                        {isZenMode ? <LuMinimize2 size={20} /> : <LuMaximize2 size={20} />}
                    </button>
                </div>

                {/* Editor Surface - ContentEditable */}
                <div
                    ref={textareaRef}
                    contentEditable
                    className="editor-content-padding editor-min-height"
                    suppressContentEditableWarning
                    onInput={(e) => setContent(e.currentTarget.innerText)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={{
                        flex: 1,
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: isZenMode ? '1.3rem' : '1.15rem',
                        lineHeight: '1.8',
                        color: 'var(--text-secondary)',
                        fontFamily: 'Inter, sans-serif',
                        maxWidth: isZenMode ? '800px' : '100%',
                        margin: isZenMode ? '0 auto' : '0',
                        overflowY: 'auto'
                    }}
                />

                {/* Ambient Status Bar */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    right: '32px',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: words > 0 ? '#00FF9D' : 'var(--text-secondary)' }} />
                        {words} words
                    </div>
                    <span>|</span>
                    <div>{chars} chars</div>
                </div>
            </div>


            {/* Analysis Sidebar */}
            <div style={{ width: 'auto', minWidth: '340px', display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto' }}>

                {/* Sidebar Tabs */}
                <div className="glass-panel" style={{
                    padding: '8px',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '4px'
                }}>
                    <SidebarTab
                        icon={<LuPenLine size={20} />}
                        label="Grammar"
                        active={activeTab === 'grammar'}
                        onClick={() => setActiveTab('grammar')}
                    />
                    <SidebarTab
                        icon={<LuSparkles size={20} />}
                        label="Gen AI"
                        active={activeTab === 'genai'}
                        onClick={() => setActiveTab('genai')}
                    />

                </div>

                {/* Analysis Content Area */}
                <div className="glass-panel" style={{
                    flex: 1,
                    borderRadius: '24px',
                    border: '1px solid var(--glass-border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {activeTab === 'grammar' && <GrammarSection content={content} setContent={setContent} score={overallScore} issueCounts={issueCounts} />}
                    {activeTab === 'genai' && <GenAISection content={content} setContent={setContent} />}

                </div>
            </div>
        </div>
    );
};

// --- Sub-Sections ---

const GrammarSection = ({ content, setContent, score, issueCounts }) => (
    <>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--secondary-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Overall Score</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Advanced</span>
            </div>

            {/* Score Ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{
                    width: '120px', height: '120px',
                    borderRadius: '50%',
                    border: '10px solid var(--secondary-bg)',
                    position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        position: 'absolute', inset: -10,
                        borderRadius: '50%',
                        border: '10px solid transparent',
                        borderTopColor: '#00C2FF',
                        borderRightColor: '#00C2FF',
                        transform: 'rotate(45deg)'
                    }} />
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{score}</span>
                    </div>
                </div>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Good! A few tweaks needed.</p>
        </div>

        {/* Tone Section */}
        <div style={{ padding: '0 24px' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Tone</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <ToneButton
                    icon={<LuBriefcase size={16} />}
                    label="Professional"
                    onClick={() => {
                        // Mock tone change
                        setContent(prev => prev + " (Professional Tone Applied)");
                        // In a real app, this would call an AI endpoint
                    }}
                />
                <ToneButton
                    icon={<LuCoffee size={16} />}
                    label="Casual"
                    onClick={() => setContent(prev => prev.replace(/\./g, "!"))}
                />
                <ToneButton
                    icon={<LuGraduationCap size={16} />}
                    label="Academic"
                    onClick={() => setContent(prev => "Checking: " + prev)}
                />
                <ToneButton
                    icon={<LuSmile size={16} />}
                    label="Friendly"
                    onClick={() => setContent(prev => "Hey there! " + prev)}
                />
            </div>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Issue Types</h4>

            <CategoryCard
                label="Correctness"
                count={issueCounts.correctness}
                color="#FF5F56"
                icon={<LuTriangleAlert size={18} />}
                desc="Spelling & grammar errors"
            />
            <CategoryCard
                label="Clarity"
                count={issueCounts.clarity}
                color="#00C2FF"
                icon={<LuBookOpen size={18} />}
                desc="Hard to read sentences"
            />
            <CategoryCard
                label="Engagement"
                count={issueCounts.engagement}
                color="#00FF9D"
                icon={<LuZap size={18} />}
                desc="Bland vocabulary"
            />
            <CategoryCard
                label="Delivery"
                count={issueCounts.delivery}
                color="#A855F7"
                icon={<LuMoveRight size={18} />}
                desc="Wrong tone matches"
            />
        </div>

        <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
            <button
                onClick={(e) => {
                    const btn = e.currentTarget;
                    const originalText = btn.innerText;
                    btn.innerText = "Fixing...";
                    btn.disabled = true;
                    btn.style.opacity = "0.7";

                    setTimeout(() => {
                        setContent(prev => prev.replace(/use/g, "utilize").replace(/bad/g, "suboptimal"));
                        btn.innerText = "All Fixed!";
                        btn.style.background = "var(--glass-bg)";

                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.disabled = false;
                            btn.style.opacity = "1";
                            btn.style.background = "linear-gradient(90deg, #00C2FF, #00FF9D)";
                        }, 2000);
                    }, 1500);
                }}
                style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(90deg, #00C2FF, #00FF9D)',
                    color: '#000', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 194, 255, 0.2)',
                    transition: 'all 0.3s'
                }}>
                Fix All Issues (6)
            </button>
        </div>
    </>
);

const GenAISection = ({ content, setContent }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [instruction, setInstruction] = React.useState('');

    const handleAction = (action) => {
        setIsLoading(true);
        // Mock backend latency
        setTimeout(() => {
            setIsLoading(false);
            switch (action) {
                case 'Shorten':
                    setContent(prev => prev.split(' ').slice(0, Math.floor(prev.split(' ').length * 0.8)).join(' ') + "...");
                    break;
                case 'Expand':
                    setContent(prev => prev + " Furthermore, this topic warrants a deeper investigation into the underlying nuances that shape our understanding.");
                    break;
                case 'Formalize':
                    setContent(prev => prev.replace(/can't/g, "cannot").replace(/won't/g, "will not").replace(/stuff/g, "material"));
                    break;
                case 'Simplify':
                    setContent(prev => prev.replace(/utilize/g, "use").replace(/facilitate/g, "help"));
                    break;
                case 'Generate':
                    setContent(prev => prev + `\n\n[AI Generated based on "${instruction}"]: Here is a drafted paragraph that aligns with your request.`);
                    setInstruction('');
                    break;
                default:
                    break;
            }
        }, 1500);
    };

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
                borderRadius: '16px', padding: '20px', border: '1px solid rgba(168, 85, 247, 0.2)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #A855F7, #EC4899)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                }}>
                    <LuSparkles size={24} color="#fff" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>AI Magic Editor</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Transform your text instantly.</p>
            </div>

            {isLoading ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                    <div className="spin-slow" style={{ fontSize: '32px', marginBottom: '16px' }}>✨</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Working magic...</div>
                </div>
            ) : (
                <>
                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '12px' }}>Quick Actions</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <MagicCard icon={<LuScissors />} label="Shorten" onClick={() => handleAction('Shorten')} />
                            <MagicCard icon={<LuMaximize2 />} label="Expand" onClick={() => handleAction('Expand')} />
                            <MagicCard icon={<LuBriefcase />} label="Formalize" onClick={() => handleAction('Formalize')} />
                            <MagicCard icon={<LuFeather />} label="Simplify" onClick={() => handleAction('Simplify')} />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '12px' }}>Custom Instruction</label>
                        <div style={{ position: 'relative' }}>
                            <textarea
                                placeholder="E.g., Make it sound more enthusiastic..."
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                style={{
                                    width: '100%', height: '100px',
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '16px', color: 'var(--text-primary)',
                                    resize: 'none', outline: 'none',
                                    fontFamily: 'inherit', fontSize: '0.9rem'
                                }}
                            />
                            <button
                                onClick={() => handleAction('Generate')}
                                disabled={!instruction}
                                style={{
                                    position: 'absolute', bottom: '12px', right: '12px',
                                    padding: '8px 12px', borderRadius: '8px',
                                    background: instruction ? 'var(--accent-color)' : 'var(--glass-border)',
                                    color: instruction ? '#000' : 'var(--text-secondary)',
                                    border: 'none', cursor: instruction ? 'pointer' : 'default',
                                    fontWeight: 600, fontSize: '0.8rem',
                                    transition: 'all 0.2s'
                                }}>
                                Generate
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// --- Plagiarism Section removed --

// --- Helper Components ---

const CategoryCard = ({ label, count, color, icon, desc }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '12px', borderRadius: '12px',
        background: 'var(--toolbar-bg)',
        border: '1px solid transparent',
        cursor: 'pointer', transition: 'all 0.2s'
    }}
        onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--button-hover)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'transparent';
        }}
    >
        <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `${color}20`, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</span>
                {count > 0 ? (
                    <span style={{
                        background: color, color: '#000',
                        padding: '2px 8px', borderRadius: '100px',
                        fontSize: '0.75rem', fontWeight: 700
                    }}>{count}</span>
                ) : (
                    <LuCheck color={color} />
                )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</div>
        </div>
    </div>
);

const MagicCard = ({ icon, label, onClick }) => (
    <div style={{
        padding: '16px', borderRadius: '12px',
        background: 'var(--toolbar-bg)',
        border: '1px solid var(--glass-border)',
        cursor: 'pointer', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        transition: 'all 0.2s'
    }}
        onClick={onClick}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
            e.currentTarget.style.borderColor = '#A855F7';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.background = 'var(--toolbar-bg)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
    >
        <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
    </div>
);

const ToolbarButton = ({ icon, label, onClick }) => (
    <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            color: 'var(--text-secondary)',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--button-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
        }}
        title={label}
    >
        {icon || label}
    </button>
);

const SidebarTab = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 4px',
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'center',
            gap: '8px',
            background: active ? 'var(--glass-bg)' : 'transparent',
            border: active ? '1px solid var(--glass-border)' : '1px solid transparent',
            transition: 'all 0.2s',
            position: 'relative'
        }}
    >
        <div style={{
            color: active ? 'var(--text-primary)' : 'var(--text-secondary)'
        }}>
            {/* If active, we could use a gradient text effect but keeping simple for now */}
            {React.cloneElement(icon, { color: active ? 'var(--accent-color)' : 'currentColor' })}
        </div>
        <div style={{ fontSize: '0.75rem', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: active ? 600 : 400 }}>{label}</div>
    </div>
);


const ToneButton = ({ icon, label, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'var(--toolbar-bg)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        transition: 'all 0.2s',
        textAlign: 'left'
    }}
        onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--button-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--accent-color)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--toolbar-bg)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// --- Plagiarism Dashboard Component ---



export default EditorTab;
