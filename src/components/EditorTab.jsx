import React, { useState, useRef, useEffect } from 'react';
import {
    LuCheck,
    LuX,
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
import html2pdf from 'html2pdf.js';

const API_URL = import.meta.env.VITE_API_URL || '';

const EditorTab = ({ addNotification }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [activeTab, setActiveTab] = useState('score');
    const [isZenMode, setIsZenMode] = useState(false);
    const textareaRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isApplyingTone, setIsApplyingTone] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [overallScore, setOverallScore] = useState(0);
    const [issueCounts, setIssueCounts] = useState({ correctness: 0, clarity: 0, engagement: 0, delivery: 0 });
    const abortControllerRef = useRef(null);

    const handleStopAnalysis = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const handleAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const textForAnalysis = textareaRef.current ? textareaRef.current.innerText : content.replace(/<[^>]+>/g, '');

        try {
            const response = await fetch(`${API_URL}/posttext`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textForAnalysis, user: 'demo-user' }),
                signal: signal
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            if (data.success && data.results && data.results.length > 0) {
                const result = data.results[0];

                const suggestions = result.errors.map((err, idx) => ({
                    id: idx,
                    type: err.type || 'grammar',
                    message: err.message,
                    errorContext: err.error,
                    replacements: err.suggestions
                }));

                setAnalysisResult({
                    suggestions: suggestions,
                    correctedText: result.corrected_text
                });

                setOverallScore(Math.round(result.correction_score));

                const counts = { correctness: 0, clarity: 0, engagement: 0, delivery: 0 };
                result.errors.forEach(err => {
                    const type = (err.type || '').toLowerCase();
                    if (type === 'grammar' || type === 'spelling' || type === 'punctuation' || type === 'capitalization') counts.correctness++;
                    else if (type === 'style' || type === 'readability') counts.clarity++;
                    else if (type === 'tone') counts.delivery++;
                    else counts.engagement++; // Fallback
                });
                setIssueCounts(counts);
            }
            if (addNotification) addNotification('Analysis completed successfully!', 'success');
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Analysis stopped by user.');
                if (addNotification) addNotification('Analysis stopped.', 'info');
                return;
            }
            console.error("Analysis failed:", error);
            if (addNotification) addNotification('Analysis failed. Please try again.', 'error');
        } finally {
            setIsAnalyzing(false);
            abortControllerRef.current = null;
        }
    };

    // Basic word count
    const rawContent = content.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
    const words = rawContent.trim() === '' ? 0 : rawContent.trim().split(/\s+/).length;
    const chars = rawContent.length;

    const applyFormat = (type) => {
        // WYSIWYG Formatting
        document.execCommand('styleWithCSS', false, true);

        const toggleBlock = (tag) => {
            let currentBlock = document.queryCommandValue('formatBlock');
            if (currentBlock) currentBlock = currentBlock.replace(/['"<>\/]/g, '').toLowerCase();

            if (currentBlock === tag.toLowerCase()) {
                document.execCommand('formatBlock', false, 'P');
            } else {
                document.execCommand('formatBlock', false, tag);
            }
        };

        switch (type) {
            case 'bold': document.execCommand('bold', false, null); break;
            case 'italic': document.execCommand('italic', false, null); break;
            case 'underline': document.execCommand('underline', false, null); break;
            case 'h1': toggleBlock('H1'); break;
            case 'h2': toggleBlock('H2'); break;
            case 'quote': toggleBlock('BLOCKQUOTE'); break;
            case 'list': document.execCommand('insertUnorderedList', false, null); break;
            case 'code': toggleBlock('PRE'); break;
        }
        if (textareaRef.current) setContent(textareaRef.current.innerHTML);


    };


    // Sync content changes to editable div (Critical for AI updates)
    useEffect(() => {
        if (textareaRef.current && content !== textareaRef.current.innerHTML) {
            textareaRef.current.innerHTML = content;
        }
    }, [content]);

    const handleDownloadPDF = () => {
        const element = textareaRef.current;
        const opt = {
            margin: 0.5,
            filename: `${title.trim() || 'SmartText_Doc'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        // Clone the element to style it for PDF if needed, but for now direct dump
        html2pdf().set(opt).from(element).save();
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
                minWidth: '0', // Allows flexbox children to shrink below their implied minimum
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '24px',
                border: isFocused ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
                background: 'var(--editor-bg)',
                position: 'relative',
                overflow: isZenMode ? 'visible' : 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: isFocused ? '0 0 30px rgba(0, 255, 157, 0.1)' : 'none'
            }}>
                {/* Creative Header */}
                <div className="editor-header-padding" style={{ zIndex: 5, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <input
                            type="text"
                            className="responsive-title"
                            placeholder="Untitled Masterpiece"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                background: 'transparent',
                                border: 'none',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                outline: 'none',
                                fontFamily: 'Outfit, sans-serif',
                                textOverflow: 'ellipsis'
                            }}
                        />

                        <div className="hide-on-mobile" style={{ display: 'flex', gap: '8px', marginLeft: '16px', flexShrink: 0 }}>
                            <button
                                onClick={handleDownloadPDF}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                title="Download as PDF"
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                <LuDownload size={20} />
                            </button>
                            <button
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
                                }}
                                title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                {isZenMode ? <LuMinimize2 size={20} /> : <LuMaximize2 size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Sleek Toolbar */}
                    <div className="responsive-toolbar" style={{
                        padding: '6px',
                        background: 'var(--toolbar-bg)',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        alignSelf: 'flex-start'
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
                            icon={isAnalyzing ? <LuX /> : <LuCheck />}
                            label={isAnalyzing ? "Stop Scanning" : "Check Grammar"}
                            onClick={isAnalyzing ? handleStopAnalysis : handleAnalysis}
                        />
                    </div>
                </div>

                {/* Editor Surface - ContentEditable */}
                <div
                    ref={textareaRef}
                    contentEditable={!isAnalyzing && !isApplyingTone}
                    className="editor-content-padding editor-min-height"
                    suppressContentEditableWarning
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
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
                        maxWidth: '100%',
                        margin: '0',
                        overflowY: 'auto',
                        borderRadius: '20px',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: (isAnalyzing || isApplyingTone) ? 'blur(3px)' : 'none',
                        opacity: (isAnalyzing || isApplyingTone) ? 0.6 : 1,
                        pointerEvents: (isAnalyzing || isApplyingTone) ? 'none' : 'auto'
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
            <div style={{ width: '340px', display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto' }}>

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
                        label="Overall Score"
                        active={activeTab === 'score'}
                        onClick={() => setActiveTab('score')}
                    />
                    <SidebarTab
                        icon={<LuTriangleAlert size={20} />}
                        label="Issues"
                        active={activeTab === 'issues'}
                        onClick={() => setActiveTab('issues')}
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
                    {activeTab === 'score' && <ScoreSection content={content} setContent={setContent} score={overallScore} issueCounts={issueCounts} isApplyingTone={isApplyingTone} setIsApplyingTone={setIsApplyingTone} />}
                    {activeTab === 'issues' && <IssuesSection content={content} setContent={setContent} issueCounts={issueCounts} analysisResult={analysisResult} onRescan={handleAnalysis} />}
                    {activeTab === 'genai' && <GenAISection content={content} setContent={setContent} />}

                </div>
            </div>
        </div>
    );
};

// --- Sub-Sections ---

const ScoreSection = ({ content, setContent, score, issueCounts, isApplyingTone, setIsApplyingTone }) => {
    const [activeTone, setActiveTone] = React.useState(null);

    const applyTone = async (tone) => {
        setIsApplyingTone(true);
        setActiveTone(tone);
        try {
            const response = await fetch(`${API_URL}/generative`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content, user: 'demo-user', tone: tone })
            });
            const data = await response.json();
            if (data.output) setContent(data.output);
        } catch (error) {
            console.error("Tone application failed:", error);
            setActiveTone(null);
        } finally {
            setIsApplyingTone(false);
        }
    };

    return (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Overall Score</h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Advanced</span>
                </div>

                {/* Score Ring - SVG based, dynamic fill */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    {(() => {
                        const radius = 48;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference * (1 - score / 100);
                        const ringColor = score >= 80 ? '#00FF9D' : score >= 50 ? '#00C2FF' : score >= 30 ? '#FFB300' : '#FF5F56';
                        return (
                            <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="130" height="130" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                                    {/* Background track */}
                                    <circle
                                        cx="65" cy="65" r={radius}
                                        fill="none"
                                        stroke="var(--secondary-bg)"
                                        strokeWidth="10"
                                    />
                                    {/* Progress arc */}
                                    <circle
                                        cx="65" cy="65" r={radius}
                                        fill="none"
                                        stroke={ringColor}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease', filter: `drop-shadow(0 0 6px ${ringColor}88)` }}
                                    />
                                </svg>
                                <div style={{ textAlign: 'center', zIndex: 1 }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1, color: ringColor }}>{score}</span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Good! A few tweaks needed.</p>
            </div>

            {/* Tone Section */}
            <div style={{ padding: '24px', flexShrink: 0 }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Tone</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                    <ToneButton icon={<LuBriefcase size={16} />} label="Professional" active={activeTone === 'professional'} onClick={() => applyTone('professional')} />
                    <ToneButton icon={<LuCoffee size={16} />} label="Casual" active={activeTone === 'casual'} onClick={() => applyTone('casual')} />
                    <ToneButton icon={<LuGraduationCap size={16} />} label="Academic" active={activeTone === 'academic'} onClick={() => applyTone('academic')} />
                    <ToneButton icon={<LuSmile size={16} />} label="Friendly" active={activeTone === 'friendly'} onClick={() => applyTone('friendly')} />
                </div>
            </div>

            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, paddingBottom: '32px' }}>
                <CategoryCard
                    icon={<LuPenLine size={20} />}
                    color="#00C2FF"
                    label="Correctness"
                    desc="Grammar, spelling"
                    count={issueCounts.correctness}
                />
                <CategoryCard
                    icon={<LuSparkles size={20} />}
                    color="#00FF9D"
                    label="Clarity"
                    desc="Conciseness, reading time"
                    count={issueCounts.clarity}
                />
            </div>
        </div>
    );
};

const IssuesSection = ({ content, setContent, issueCounts, analysisResult, onRescan }) => {

    const applyCorrection = (original, replacement) => {
        setContent(prev => prev.replace(original, replacement));
        if (onRescan) {
            setTimeout(() => onRescan(), 100);
        }
    };

    return (
        <>
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Issues ({issueCounts.correctness + issueCounts.clarity + issueCounts.engagement + issueCounts.delivery})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Detailed Suggestions List */}
                    {analysisResult?.suggestions?.length > 0 ? (
                        analysisResult.suggestions.map((issue, idx) => (
                            <div key={idx} style={{
                                padding: '16px', borderRadius: '12px',
                                background: 'var(--input-bg)',
                                borderLeft: '4px solid #FF5F56'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#FF5F56' }}>{issue.type}</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{issue.message}</p>

                                {issue.replacements?.length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {issue.replacements.slice(0, 3).map((rep, i) => (
                                            <button
                                                key={i}
                                                onClick={() => applyCorrection(issue.errorContext || issue.message /* fallback logic needed */, rep)}
                                                /* Note: Simple text replacement is brittle without offsetting. 
                                                   For now, displaying is the goal. Interaction is bonus. */
                                                className="suggestion-chip"
                                                style={{
                                                    padding: '4px 12px', borderRadius: '100px',
                                                    background: 'rgba(0, 194, 255, 0.1)', color: '#00C2FF',
                                                    border: 'none', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500
                                                }}
                                            >
                                                {rep}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>
                            <LuCheck size={32} style={{ marginBottom: '8px' }} />
                            <p>No issues found!</p>
                        </div>
                    )}
                </div>
            </div>

            {analysisResult?.correctedText && (
                <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
                    <button
                        onClick={() => {
                            let newContent = content;
                            if (analysisResult?.suggestions) {
                                analysisResult.suggestions.forEach(issue => {
                                    if (issue.errorContext && issue.replacements?.length > 0) {
                                        // Optional: add basic word boundary if needed, but for now simple replace
                                        newContent = newContent.replace(issue.errorContext, issue.replacements[0]);
                                    }
                                });
                            }
                            setContent(newContent);
                            if (onRescan) {
                                setTimeout(() => onRescan(), 100); // 100ms let's React flush the setContent State to the DOM
                            }
                        }}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(90deg, #00C2FF, #00FF9D)',
                            color: '#000', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 194, 255, 0.2)',
                            transition: 'all 0.3s'
                        }}>
                        Fix All Issues
                    </button>
                </div>
            )}
        </>
    );
};

const GenAISection = ({ content, setContent }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [instruction, setInstruction] = React.useState('');

    const handleAction = async (action) => {
        setIsLoading(true);
        try {
            let tone = 'neutral';
            if (action === 'Shorten') tone = 'concise';
            else if (action === 'Expand') tone = 'detailed';
            else if (action === 'Formalize') tone = 'formal';
            else if (action === 'Simplify') tone = 'simple';
            else if (action === 'Generate') tone = instruction;

            const response = await fetch(`${API_URL}/generative`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: content.replace(/<[^>]+>/g, ''),
                    user: 'demo-user',
                    tone: tone,
                    model: 'z-ai/glm-4.5-air:free' // Explicitly set reliable model
                })
            });
            const data = await response.json();

            if (data.output) {
                // If it's a generation action, we might want to append or replace. 
                // The prompt says "based on the following prompt", so it rewrites.
                // For consistency with the UI actions which imply rewriting, we replace.
                const formattedOutput = data.output.replace(/\n/g, '<br>');
                setContent(formattedOutput);
                setInstruction('');
            }
        } catch (error) {
            console.error("GenAI Action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
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


const ToneButton = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: active ? 'rgba(0, 194, 255, 0.15)' : 'var(--toolbar-bg)',
        border: active ? '1px solid var(--accent-color)' : '1px solid var(--glass-border)',
        color: active ? 'var(--accent-color)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s',
        textAlign: 'left',
        boxShadow: active ? '0 0 10px rgba(0, 194, 255, 0.2)' : 'none'
    }}
        onMouseEnter={e => {
            if (!active) {
                e.currentTarget.style.background = 'var(--button-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--accent-color)';
            }
        }}
        onMouseLeave={e => {
            if (!active) {
                e.currentTarget.style.background = 'var(--toolbar-bg)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
            }
        }}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// --- Plagiarism Dashboard Component ---



export default EditorTab;
