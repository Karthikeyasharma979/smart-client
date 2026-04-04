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
    LuFeather,
    LuRefreshCw
} from 'react-icons/lu';
import html2pdf from 'html2pdf.js';
import { useShortcuts } from '../contexts/ShortcutContext';

const baseApiUrl = import.meta.env.VITE_API_URL || '';
const API_URL = baseApiUrl.endsWith('/') ? baseApiUrl.slice(0, -1) : baseApiUrl;

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
    const { registerAction, shortcuts } = useShortcuts();

    const [inlinePrompt, setInlinePrompt] = useState({
        isOpen: false,
        x: 0,
        y: 0,
        query: '',
        loading: false,
        savedRange: null,
        isDragging: false,
        dragStart: { x: 0, y: 0 }
    });

    const getShortcutLabel = (id) => {
        const config = shortcuts[id];
        if (!config) return '';
        const parts = [];
        if (config.ctrl) parts.push('Ctrl');
        if (config.shift) parts.push('Shift');
        if (config.alt) parts.push('Alt');
        parts.push(config.key.toUpperCase());
        return parts.join('+');
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (inlinePrompt.isDragging) {
                setInlinePrompt(prev => ({
                    ...prev,
                    x: e.clientX - prev.dragStart.x,
                    y: e.clientY - prev.dragStart.y
                }));
            }
        };

        const handleMouseUp = () => {
            if (inlinePrompt.isDragging) {
                setInlinePrompt(prev => ({ ...prev, isDragging: false }));
            }
        };

        if (inlinePrompt.isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [inlinePrompt.isDragging]);

    useEffect(() => {
        const unregisterAnalysis = registerAction('run-analysis', () => {
            if (!isAnalyzing) handleAnalysis();
        });
        const unregisterZen = registerAction('toggle-zen', () => setIsZenMode(prev => !prev));
        const unregisterPDF = registerAction('download-pdf', () => handleDownloadPDF());

        return () => {
            unregisterAnalysis();
            unregisterZen();
            unregisterPDF();
        };
    }, [isAnalyzing, registerAction]);

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

    // --- Simple Readability Score (Flesch-Kincaid basic) ---
    const calculateReadability = () => {
        if (words < 5) return 'N/A';
        const sentences = rawContent.split(/[.!?]+/).length - 1 || 1;
        const avgSentenceLength = words / sentences;
        if (avgSentenceLength > 25) return 'Complex';
        if (avgSentenceLength > 15) return 'Medium';
        return 'Simple';
    };
    const readability = calculateReadability();

    const applyFormat = (type) => {
        // WYSIWYG Formatting
        document.execCommand('styleWithCSS', false, true);

        const toggleBlock = (tag) => {
            let currentBlock = document.queryCommandValue('formatBlock');
            if (currentBlock) currentBlock = currentBlock.replace(/['"<>\/]/g, '').toLowerCase();

            if (currentBlock === tag.toLowerCase()) {
                document.execCommand('formatBlock', false, 'P');
            } else {
                document.execCommand('formatBlock', false, tag.toUpperCase());
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
        // Parse content and force INLINE styles directly onto the elements.
        // This is bulletproof: html2canvas/Tailwind cannot override inline styles.
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        const elements = tempDiv.querySelectorAll('*');
        elements.forEach(el => {
            if (el.tagName === 'H1') {
                el.setAttribute('style', 'display: block !important; font-size: 32px !important; font-weight: bold !important; margin: 24px 0 12px 0 !important; color: #000000 !important; line-height: 1.2 !important;');
            } else if (el.tagName === 'H2') {
                el.setAttribute('style', 'display: block !important; font-size: 24px !important; font-weight: bold !important; margin: 20px 0 10px 0 !important; color: #000000 !important; line-height: 1.3 !important;');
            } else if (el.tagName === 'H3') {
                el.setAttribute('style', 'display: block !important; font-size: 18px !important; font-weight: bold !important; margin: 16px 0 8px 0 !important; color: #000000 !important; line-height: 1.4 !important;');
            } else if (el.tagName === 'P') {
                el.setAttribute('style', 'display: block !important; margin-bottom: 12px !important; color: #000000 !important; font-size: 16px !important;');
            } else if (el.tagName === 'UL') {
                el.setAttribute('style', 'display: block !important; padding-left: 24px !important; list-style-type: disc !important; margin-bottom: 12px !important; color: #000000 !important;');
            } else if (el.tagName === 'OL') {
                el.setAttribute('style', 'display: block !important; padding-left: 24px !important; list-style-type: decimal !important; margin-bottom: 12px !important; color: #000000 !important;');
            } else if (el.tagName === 'LI') {
                el.setAttribute('style', 'display: list-item !important; margin-bottom: 6px !important; color: #000000 !important; font-size: 16px !important;');
            } else if (el.tagName === 'PRE') {
                el.setAttribute('style', 'display: block !important; background: #f5f5f5 !important; padding: 12px !important; border-radius: 6px !important; border: 1px solid #e0e0e0 !important; font-family: monospace !important; white-space: pre-wrap !important; margin-bottom: 16px !important; color: #000000 !important;');
            } else if (el.tagName === 'BLOCKQUOTE') {
                el.setAttribute('style', 'display: block !important; border-left: 4px solid #000000 !important; padding-left: 16px !important; color: #333333 !important; font-style: italic !important; margin-bottom: 16px !important;');
            } else {
                el.style.color = '#000000'; // Default everything else to black text
            }
        });

        const styledContent = tempDiv.innerHTML;

        // Construct a clean HTML string mapping the content
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body {
                            background-color: #ffffff !important;
                            color: #000000 !important;
                            font-family: 'Inter', Arial, sans-serif !important;
                            line-height: 1.6 !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        .pdf-container {
                            padding: 40px !important;
                        }
                        .pdf-title {
                            margin-bottom: 24px !important;
                            font-size: 36px !important;
                            font-weight: bold !important;
                            border-bottom: 2px solid #eeeeee !important;
                            padding-bottom: 12px !important;
                            color: #000000 !important;
                        }
                    </style>
                </head>
                <body>
                    <div class="pdf-container">
                        ${title.trim() ? `<div class="pdf-title">${title.trim()}</div>` : ''}
                        <div style="color: #000000;">${styledContent}</div>
                    </div>
                </body>
            </html>
        `;

        const opt = {
            margin: 0.5,
            filename: `${title.trim() || 'SmartText_Doc'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(htmlContent).save().then(() => {
            if (addNotification) addNotification('PDF downloaded successfully!', 'success');
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const selection = window.getSelection();
            if (!selection || !selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            const tabNode = document.createTextNode('\u00a0\u00a0\u00a0\u00a0');
            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
            setContent(textareaRef.current.innerHTML);
        }
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
                                title={`Download as PDF (${getShortcutLabel('download-pdf')})`}
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
                                title={`${isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"} (${getShortcutLabel('toggle-zen')})`}
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
                        <button
                            onClick={isAnalyzing ? handleStopAnalysis : handleAnalysis}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: isAnalyzing ? 'rgba(255, 95, 86, 0.1)' : 'var(--accent-color)',
                                color: isAnalyzing ? '#FF5F56' : '#000',
                                border: 'none',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                marginLeft: '8px',
                                boxShadow: isAnalyzing ? 'none' : '0 4px 12px rgba(0, 255, 157, 0.2)'
                            }}
                            onMouseEnter={e => {
                                if (!isAnalyzing) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 255, 157, 0.4)';
                                } else {
                                    e.currentTarget.style.background = 'rgba(255, 95, 86, 0.15)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isAnalyzing) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 255, 157, 0.2)';
                                } else {
                                    e.currentTarget.style.background = 'rgba(255, 95, 86, 0.1)';
                                }
                            }}
                            title={isAnalyzing ? "Stop Scanning" : `Check Grammar (${getShortcutLabel('run-analysis')})`}
                        >
                            {isAnalyzing ? <LuX size={15} /> : <LuSparkles size={16} strokeWidth={2.5} />}
                            {isAnalyzing ? "Stop Scanning" : "Check Grammar"}
                        </button>

                        <button
                            onClick={() => {
                                // Direct Simplify call
                                setIsApplyingTone(true);
                                fetch(`${API_URL}/generative`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: content.replace(/<[^>]+>/g, ''), user: 'demo-user', tone: 'simple' })
                                }).then(res => res.json())
                                  .then(data => {
                                      if (data.output) setContent(data.output.replace(/\n/g, '<br>'));
                                      setIsApplyingTone(false);
                                      if (addNotification) addNotification('Text simplified!', 'success');
                                  }).catch(() => setIsApplyingTone(false));
                            }}
                            disabled={isApplyingTone || !content}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(168, 85, 247, 0.15)',
                                color: '#A855F7',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                marginLeft: '8px',
                                opacity: (isApplyingTone || !content) ? 0.5 : 1
                            }}
                            onMouseEnter={e => {
                                if (!isApplyingTone && content) {
                                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.25)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isApplyingTone && content) {
                                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                                }
                            }}
                            title="Make this text simpler and easier to read"
                        >
                            <LuFeather size={16} />
                            Simplify
                        </button>
                    </div>
                </div>

                {/* Editor Surface - ContentEditable */}
                <div
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    contentEditable={!isAnalyzing && !isApplyingTone}
                    className="editor-content-padding editor-min-height"
                    suppressContentEditableWarning
                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                    onKeyUp={(e) => {
                        if (isAnalyzing || isApplyingTone || inlinePrompt.isOpen) return;
                        
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            const node = range.startContainer;
                            if (node.nodeType === Node.TEXT_NODE) {
                                const textBeforeCursor = node.textContent.slice(0, range.startOffset);
                                if (/@AI$/.test(textBeforeCursor)) {
                                    const rect = range.getBoundingClientRect();
                                    setInlinePrompt({
                                        isOpen: true,
                                        x: rect.right + 5,
                                        y: rect.top,
                                        query: '',
                                        loading: false,
                                        savedRange: range.cloneRange(),
                                        isDragging: false,
                                        dragStart: { x: 0, y: 0 }
                                    });
                                }
                            }
                        }
                    }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: readability === 'Simple' ? '#00FF9D' : readability === 'Medium' ? '#FFD700' : '#FF5F56', fontWeight: 600 }}>
                            {readability} Reading
                        </span>
                    </div>
                    <span>|</span>
                    <div>{chars} chars</div>
                </div>

                {/* Inline AI Prompt UI */}
                {inlinePrompt.isOpen && (
                    <div 
                        style={{
                            position: 'fixed',
                            left: `${inlinePrompt.x}px`,
                            top: `${inlinePrompt.y}px`,
                            zIndex: 9999,
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--accent-color)',
                            borderRadius: '16px',
                            padding: '12px',
                            width: '320px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 255, 157, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            animation: 'fadeIn 0.2s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div 
                            onMouseDown={(e) => {
                                setInlinePrompt(prev => ({
                                    ...prev,
                                    isDragging: true,
                                    dragStart: { x: e.clientX - prev.x, y: e.clientY - prev.y }
                                }));
                            }}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                color: 'var(--accent-color)', 
                                fontSize: '0.85rem', 
                                fontWeight: 600,
                                cursor: 'move',
                                userSelect: 'none',
                                paddingBottom: '4px'
                            }}
                        >
                            {inlinePrompt.loading ? <LuRefreshCw size={16} className="spin-slow" /> : <LuSparkles size={16} />}
                            <span>{inlinePrompt.loading ? 'Generating...' : 'AI Command (Drag to move)'}</span>
                        </div>
                        <textarea 
                            autoFocus
                            placeholder="e.g., continue this sentence..."
                            value={inlinePrompt.query}
                            onChange={(e) => setInlinePrompt(prev => ({...prev, query: e.target.value}))}
                            onKeyDown={async (e) => {
                                if (e.key === 'Escape') {
                                    setInlinePrompt(prev => ({ ...prev, isOpen: false }));
                                    e.preventDefault();
                                } else if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!inlinePrompt.query.trim() || inlinePrompt.loading) return;
                                    
                                    setInlinePrompt(prev => ({...prev, loading: true}));
                                    try {
                                        const response = await fetch(`${API_URL}/generative`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                text: textareaRef.current.innerText || " ",
                                                user: 'demo-user',
                                                tone: inlinePrompt.query,
                                                model: 'z-ai/glm-4.5-air:free'
                                            })
                                        });
                                        const data = await response.json();
                                        if (data.output) {
                                            const selection = window.getSelection();
                                            selection.removeAllRanges();
                                            selection.addRange(inlinePrompt.savedRange);
                                            
                                            const node = inlinePrompt.savedRange.startContainer;
                                            const offset = inlinePrompt.savedRange.startOffset;
                                            if (node.nodeType === Node.TEXT_NODE && offset >= 3) {
                                                const text = node.textContent;
                                                if (text.slice(offset - 3, offset) === '@AI') {
                                                    node.textContent = text.slice(0, offset - 3) + text.slice(offset);
                                                    inlinePrompt.savedRange.setStart(node, offset - 3);
                                                    inlinePrompt.savedRange.collapse(true);
                                                    selection.removeAllRanges();
                                                    selection.addRange(inlinePrompt.savedRange);
                                                }
                                            }
                                            
                                            const formatted = `<span style="color: var(--accent-color); font-weight: 500;">${data.output.replace(/\n/g, '<br>')}</span>&nbsp;`;
                                            document.execCommand('insertHTML', false, formatted);
                                            if (textareaRef.current) setContent(textareaRef.current.innerHTML);
                                        }
                                    } catch (error) {
                                        console.error("Inline AI failed:", error);
                                    } finally {
                                        setInlinePrompt({ isOpen: false, x: 0, y: 0, query: '', loading: false, savedRange: null });
                                    }
                                }
                            }}
                            style={{
                                width: '100%',
                                minHeight: '60px',
                                background: 'var(--input-bg)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem',
                                resize: 'none',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            disabled={inlinePrompt.loading}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span>Press <kbd style={{background:'var(--glass-bg)', padding:'2px 4px', borderRadius:'4px', border:'1px solid var(--glass-border)'}}>Esc</kbd> to cancel</span>
                            <span>Press <kbd style={{background:'var(--glass-bg)', padding:'2px 4px', borderRadius:'4px', border:'1px solid var(--glass-border)'}}>Enter</kbd> to apply</span>
                        </div>
                    </div>
                )}
            </div>


            {/* Analysis Sidebar */}
            <div className="analysis-sidebar-compact" style={{ width: '310px', display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto' }}>

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
                    <SidebarTab
                        icon={<LuGlobe size={20} />}
                        label="Web Search"
                        active={activeTab === 'search'}
                        onClick={() => setActiveTab('search')}
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
                    {activeTab === 'search' && <WebSearchSection content={content} setContent={setContent} />}

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
            <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--glass-border)', background: 'var(--secondary-bg)', flexShrink: 0 }}>
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
            <div style={{ padding: '16px', flexShrink: 0 }}>
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
    const [ignoredIds, setIgnoredIds] = React.useState([]);

    const applyCorrection = (original, replacement) => {
        setContent(prev => prev.replace(original, replacement));
        if (onRescan) {
            setTimeout(() => onRescan(), 100);
        }
    };

    const handleIgnore = (id) => {
        setIgnoredIds(prev => [...prev, id]);
    };

    const activeSuggestions = analysisResult?.suggestions?.filter(i => !ignoredIds.includes(i.id)) || [];
    const totalIssues = activeSuggestions.length;

    return (
        <>
            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Issues ({totalIssues})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Detailed Suggestions List */}
                    {activeSuggestions.length > 0 ? (
                        activeSuggestions.map((issue, idx) => (
                            <div key={issue.id || idx} style={{
                                padding: '16px', borderRadius: '12px',
                                background: 'var(--input-bg)',
                                borderLeft: '4px solid #FF5F56',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#FF5F56' }}>{issue.type}</span>
                                    <button 
                                        onClick={() => handleIgnore(issue.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                                        title="Ignore"
                                    >
                                        <LuX size={14} />
                                    </button>
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
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 20px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(0, 255, 157, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '20px',
                                border: '1px solid rgba(0, 255, 157, 0.2)',
                                boxShadow: '0 0 20px rgba(0, 255, 157, 0.1)'
                            }}>
                                <LuCheck size={32} color="var(--accent-color)" strokeWidth={3} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>All Clear!</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '200px', lineHeight: '1.5' }}>
                                No issues found in your text. Your writing is looking sharp!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {analysisResult?.correctedText && (
                <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid var(--glass-border)' }}>
                    <button
                        onClick={() => {
                            let newContent = content;
                            if (activeSuggestions.length > 0) {
                                activeSuggestions.forEach(issue => {
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
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
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

const SearchResultItem = ({ res, onInsert }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const TRUNCATE_LIMIT = 180;
    const bodyText = res.body || "";
    const needsTruncation = bodyText.length > TRUNCATE_LIMIT;

    return (
        <div style={{
            padding: '16px',
            background: 'var(--toolbar-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        }}>
            <a href={res.href} target="_blank" rel="noopener noreferrer" style={{ color: '#00C2FF', fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {res.title}
            </a>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {isExpanded ? bodyText : bodyText.slice(0, TRUNCATE_LIMIT)}
                {needsTruncation && !isExpanded && "..."}
                {needsTruncation && (
                    <span 
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{ 
                            color: 'var(--accent-color)', 
                            cursor: 'pointer', 
                            marginLeft: '4px', 
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            textDecoration: 'none'
                        }}
                    >
                        {isExpanded ? " show less" : " +more"}
                    </span>
                )}
            </p>
            <button
                onClick={() => onInsert(res.href)}
                style={{
                    alignSelf: 'flex-start',
                    padding: '4px 12px',
                    background: 'rgba(0, 255, 157, 0.1)',
                    color: '#00FF9D',
                    border: '1px solid rgba(0, 255, 157, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginTop: '4px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 255, 157, 0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 255, 157, 0.1)'}
            >
                Insert Link
            </button>
        </div>
    );
};

const WebSearchSection = ({ content, setContent }) => {
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [maxResults, setMaxResults] = React.useState(5);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);
        setResults([]); // Clear previous results
        setError(null);
        try {
            const response = await fetch(`${API_URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query, max_results: maxResults })
            });
            const data = await response.json();
            if (data.success) {
                setResults(data.results || []);
            } else {
                setError(data.error || 'Failed to fetch results');
            }
        } catch (err) {
            console.error("Search failed:", err);
            setError("Network error. Could not connect to search.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleInsert = (href) => {
        const linkHTML = `<a href="${href}" target="_blank" style="color: var(--accent-color); text-decoration: underline;">${href}</a>&nbsp;`;
        document.execCommand('insertHTML', false, linkHTML);
    };

    return (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search the web..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            width: '100%',
                            padding: '12px 40px 12px 16px',
                            background: 'var(--input-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontSize: '0.9rem'
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            color: isSearching ? 'var(--text-secondary)' : 'var(--accent-color)',
                            cursor: isSearching ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isSearching ? <LuRefreshCw className="spin-slow" size={18} /> : <LuSearch size={18} />}
                    </button>
                </div>

                {/* Results Filter Control */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '10px',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Results Filter:
                        </span>
                        <span style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--accent-color)', 
                            fontWeight: 700,
                            background: 'rgba(0, 255, 157, 0.1)',
                            padding: '2px 8px',
                            borderRadius: '6px'
                        }}>
                            {maxResults}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={maxResults}
                        onChange={(e) => setMaxResults(parseInt(e.target.value))}
                        style={{
                            flex: 0.6,
                            height: '4px',
                            borderRadius: '2px',
                            accentColor: 'var(--accent-color)',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            {error && <div style={{ color: '#FF5F56', fontSize: '0.85rem' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.map((res, idx) => (
                    <SearchResultItem key={idx} res={res} onInsert={handleInsert} />
                ))}
            </div>
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
