import React from 'react';
import AssessmentTimer from '../AssessmentTimer';
import Instruction from '../Instruction';

export default function AssessmentHeader({
  assessmentName = "N/A",
  subjectName = "N/A",
  attemptedCount = 0,
  totalQuest = 0,
  totalMks = 0,
  totalTime,
  unattemptedQuestions,
  currentIndex = 0
}) {
  const progressPercent = totalQuest > 0 ? Math.min(100, Math.round(((currentIndex + 1) / totalQuest) * 100)) : 0;

  return (
    <div style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
      {/* 1. Assessment Summary Card (Expanded Assessment Name + Fixed Attempted & Marks + Absolute Instruction Icon) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          margin: '6px 8px 4px 8px',
          padding: '8px 10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          gap: '8px'
        }}
      >
        {/* Instruction button positioned absolute on the top-right */}
        {/* <div style={{ position: 'absolute', top: '6px', right: '8px', zIndex: 5 }}>
          <Instruction />
        </div> */}

        {/* Column 1: Assessment Name (Bigger & Flexible to show full name) + Subject */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="4" width="14" height="17" rx="2" stroke="#2563eb" strokeWidth="2" fill="#ffffff" />
              <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" fill="#2563eb" />
              <line x1="8" y1="9" x2="16" y2="9" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="8" y1="13" x2="13" y2="13" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="16" cy="16" r="4.5" fill="#2563eb" />
              <polyline points="16 13.5 16 16 17.5 17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg> */}
            <Instruction />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1 }}>
              Assessment
            </div>
            <div
              style={{
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: '700',
                lineHeight: 1.25,
                wordBreak: 'break-word',
                marginTop: '2px'
              }}
            >
              {assessmentName}
            </div>
            <div style={{ color: '#475569', fontSize: '11px', lineHeight: 1.2, marginTop: '2px' }}>
              Subject: <strong style={{ color: '#2563eb', fontWeight: '700' }}>{subjectName}</strong>
            </div>
          </div>
        </div>

        {/* Column 2: Attempted (Fixed compact width) */}
        <div
          style={{
            width: '74px',
            flexShrink: 0,
            borderLeft: '1px solid #e2e8f0',
            borderRight: '1px solid #e2e8f0',
            padding: '0 4px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1 }}>
            Attempted
          </div>
          <div style={{ color: '#1e3a8a', fontSize: '15px', fontWeight: '800', lineHeight: 1.2, marginTop: '3px' }}>
            {attemptedCount} / {totalQuest}
          </div>
        </div>

        {/* Column 3: Total Marks (2 lines like Attempted) & Remaining Time */}
        <div
          style={{
            width: '84px',
            flexShrink: 0,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: '10px'
          }}
        >
          <div style={{ color: '#64748b', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1 }}>
            Total Marks
          </div>
          <div style={{ color: '#1e3a8a', fontSize: '15px', fontWeight: '800', lineHeight: 1.2, marginTop: '2px' }}>
            {totalMks}
          </div>

          <div style={{ marginTop: '3px' }}>
            <AssessmentTimer
              totalTime={totalTime || "01:00:00"}
              unattemptedQuesCount={unattemptedQuestions}
              renderCustom={(formattedTime, secLeft) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', fontSize: '9px', fontWeight: '600', textTransform: 'uppercase' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Time Left</span>
                  </div>
                  <span style={{ color: secLeft === 0 ? '#dc2626' : '#059669', fontWeight: '700', fontSize: '11px', lineHeight: 1.2, marginTop: '1px' }}>
                    {formattedTime}
                  </span>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* 2. Sleek Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '3px 10px 5px 10px', gap: '8px' }}>
        <div
          style={{
            backgroundColor: '#204b8e',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '12px',
            whiteSpace: 'nowrap'
          }}
        >
          Q {currentIndex + 1} of {totalQuest}
        </div>
        <div
          style={{
            flex: 1,
            height: '5px',
            backgroundColor: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#2563eb',
              borderRadius: '999px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
}
