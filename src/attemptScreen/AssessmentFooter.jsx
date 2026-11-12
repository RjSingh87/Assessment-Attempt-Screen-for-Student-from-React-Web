import React, { useState } from 'react';

export default function AssessmentFooter({
  totalQuest = 0,
  currentIndex = 0,
  questions = [],
  attemptedIds = new Set(),
  markedForReview = new Set(),
  onToggleMarkForReview,
  onJumpToQuestion,
  onPrev,
  onNext,
  onSubmit,
  allNonDescriptiveAttempted = false
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCurrentMarked = markedForReview.has(currentIndex);

  const handleSelectQuestion = (index) => {
    if (onJumpToQuestion) {
      onJumpToQuestion(index);
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop overlay when Palette is expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1050,
            backdropFilter: 'blur(2px)',
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Main Footer Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          borderTopLeftRadius: isExpanded ? '18px' : '14px',
          borderTopRightRadius: isExpanded ? '18px' : '14px',
          boxShadow: '0 -3px 18px rgba(0, 0, 0, 0.08)',
          zIndex: 1100,
          padding: '8px 12px 10px 12px',
          boxSizing: 'border-box',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: isExpanded ? '78vh' : 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* EXPANDED VIEW: Header, Legend & Vertical-Scroll Question Numbers Grid */}
        {isExpanded ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: '1px solid #f1f5f9'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                  <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                  <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                  Question Palette
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  (Tap to jump)
                </span>
              </div>

              {/* Close / Collapse button */}
              <button
                onClick={() => setIsExpanded(false)}
                type="button"
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#475569',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <span>Close</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            {/* Status Legend Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                padding: '4px 0',
                fontSize: '10px',
                color: '#475569',
                fontWeight: '600',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span>Answered</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '1.5px solid #94a3b8',
                    backgroundColor: '#ffffff',
                    display: 'inline-block'
                  }}
                ></span>
                <span>Not Answered</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Marked for Review</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: '#1d4ed8',
                    display: 'inline-block'
                  }}
                ></span>
                <span>Current</span>
              </div>
            </div>

            {/* Vertical-Scroll Question Numbers Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))',
                gap: '8px',
                maxHeight: '230px',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: '4px 2px 10px 2px'
              }}
            >
              {Array.from({ length: totalQuest }, (_, i) => {
                const qId = questions[i]?.questionID;
                const isAnswered = attemptedIds.has(qId);
                const isCurrent = i === currentIndex;
                const isMarked = markedForReview.has(i);

                let bg = '#ffffff';
                let border = '1.5px solid #cbd5e1';
                let color = '#334155';

                if (isCurrent) {
                  bg = '#1d4ed8';
                  border = '1.5px solid #1d4ed8';
                  color = '#ffffff';
                } else if (isAnswered) {
                  bg = '#dcfce7';
                  border = '1.5px solid #16a34a';
                  color = '#15803d';
                } else if (isMarked) {
                  bg = '#fef3c7';
                  border = '1.5px solid #f59e0b';
                  color = '#b45309';
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectQuestion(i)}
                    type="button"
                    style={{
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: bg,
                      border: border,
                      color: color,
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      padding: 0,
                      boxShadow: isCurrent ? '0 2px 6px rgba(29, 78, 216, 0.3)' : 'none',
                      transition: 'transform 0.1s ease'
                    }}
                  >
                    <span>{i + 1}</span>

                    {/* Answered checkmark indicator */}
                    {isAnswered && !isCurrent && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '1px',
                          right: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </span>
                    )}

                    {/* Marked for Review yellow badge */}
                    {isMarked && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-3px',
                          right: '-2px',
                          lineHeight: 1
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* COLLAPSED VIEW: Ultra-compact (Only Header Row: Question X/Y + Mark for Review + Palette Trigger) */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '6px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                Q. {currentIndex + 1}/{totalQuest}
              </span>
              <span style={{ color: '#cbd5e1' }}>|</span>

              {/* Mark for Review Toggle Button */}
              <button
                onClick={() => onToggleMarkForReview && onToggleMarkForReview(currentIndex)}
                type="button"
                style={{
                  background: isCurrentMarked ? '#fef3c7' : '#f8fafc',
                  border: isCurrentMarked ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                  color: isCurrentMarked ? '#b45309' : '#64748b',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={isCurrentMarked ? '#f59e0b' : 'none'}
                  stroke={isCurrentMarked ? '#f59e0b' : 'currentColor'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{isCurrentMarked ? 'Marked' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Collapsible Palette Trigger (Opens vertical scroll sheet) */}
            <button
              onClick={() => setIsExpanded(true)}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#1e3a8a',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '2px 4px'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
              </svg>
              <span>Question Palette</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* Navigation Buttons Row (Always compact & accessible) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingTop: '6px'
          }}
        >
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            type="button"
            style={{
              flex: 1,
              height: '36px',
              backgroundColor: '#ffffff',
              border: currentIndex === 0 ? '1.5px solid #cbd5e1' : '1.5px solid #1d4ed8',
              color: currentIndex === 0 ? '#94a3b8' : '#1d4ed8',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Previous</span>
          </button>

          {allNonDescriptiveAttempted ? (
            <button
              onClick={onSubmit}
              type="button"
              style={{
                flex: 1,
                height: '36px',
                backgroundColor: '#16a34a',
                border: '1.5px solid #16a34a',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(22, 163, 74, 0.25)'
              }}
            >
              <span>Submit</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={currentIndex === totalQuest - 1}
              type="button"
              style={{
                flex: 1,
                height: '36px',
                backgroundColor: currentIndex === totalQuest - 1 ? '#cbd5e1' : '#1d4ed8',
                border: currentIndex === totalQuest - 1 ? '1.5px solid #cbd5e1' : '1.5px solid #1d4ed8',
                color: '#ffffff',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: currentIndex === totalQuest - 1 ? 'not-allowed' : 'pointer',
                boxShadow: currentIndex === totalQuest - 1 ? 'none' : '0 2px 5px rgba(29, 78, 216, 0.25)'
              }}
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
