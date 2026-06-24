'use client';

import { useFamilyData } from '@/lib/context';
import { formatWeekRange, isWeekSetUp } from '@/lib/storage';
import {
  getTermForDate, getTermWeekNumber, getSchoolHolidayLabel,
} from '@/data/schoolTerms';

interface WeekNavigatorProps {
  onSetUpWeek?: () => void;
  compact?: boolean;
}

export default function WeekNavigator({ onSetUpWeek, compact }: WeekNavigatorProps) {
  const {
    data, selectedWeekStart, isCurrentWeek,
    goToNextWeek, goToPrevWeek, goToCurrentWeek,
  } = useFamilyData();

  const state = data.state ?? 'QLD';
  const term = getTermForDate(selectedWeekStart, state);
  const holidayLabel = !term ? getSchoolHolidayLabel(selectedWeekStart, state) : null;
  const weekNum = term ? getTermWeekNumber(selectedWeekStart, term) : null;
  const weekIsSetUp = isWeekSetUp(data, selectedWeekStart);

  const termColors: Record<number, { bg: string; text: string }> = {
    1: { bg: '#E06010', text: '#fff' },
    2: { bg: '#C49A1E', text: '#fff' },
    3: { bg: '#6B7A36', text: '#fff' },
    4: { bg: '#5D4033', text: '#fff' },
  };
  const termColor = term ? (termColors[term.term] ?? termColors[1]) : null;

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        background: '#F9F0DC',
        borderBottom: '1px solid #E8D4A8',
      }}>
        <button
          onClick={goToPrevWeek}
          aria-label="Previous week"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#8B6B55',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: '4px 6px',
            borderRadius: 6,
          }}
        >
          ‹
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#3D2B1F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            {isCurrentWeek ? 'This week' : formatWeekRange(selectedWeekStart)}
            {onSetUpWeek && (
              <button
                onClick={onSetUpWeek}
                aria-label="Edit week"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 1, color: '#B09070' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
          </div>
          {(term || holidayLabel) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              marginTop: 2,
            }}>
              {term && termColor && (
                <span style={{
                  background: termColor.bg,
                  color: termColor.text,
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  padding: '2px 7px',
                  borderRadius: 9999,
                  letterSpacing: '0.04em',
                }}>
                  Term {term.term}{weekNum ? ` · Wk ${weekNum}` : ''}
                </span>
              )}
              {holidayLabel && (
                <span style={{
                  background: '#E8D4A8',
                  color: '#5D4033',
                  fontFamily: 'Nunito, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  padding: '2px 7px',
                  borderRadius: 9999,
                }}>
                  {holidayLabel}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          aria-label="Next week"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#8B6B55',
            fontSize: '1.2rem',
            lineHeight: 1,
            padding: '4px 6px',
            borderRadius: 6,
          }}
        >
          ›
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#F9F0DC',
      borderBottom: '1px solid #E8D4A8',
    }}>
      {/* Week row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px 8px',
        gap: 8,
      }}>
        <button
          onClick={goToPrevWeek}
          aria-label="Previous week"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#E8D4A8',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            color: '#5D4033',
            flexShrink: 0,
          }}
        >
          ‹
        </button>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: '#3D2B1F',
          }}>
            {isCurrentWeek
              ? 'This week'
              : `Week of ${new Date(selectedWeekStart + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long' })}`}
          </div>
          <div style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: '0.78rem',
            color: '#8B6B55',
            marginTop: 1,
          }}>
            {formatWeekRange(selectedWeekStart)}
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          aria-label="Next week"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#E8D4A8',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            color: '#5D4033',
            flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      {/* Term badge row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px 10px',
        gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {term && termColor && (
            <span style={{
              background: termColor.bg,
              color: termColor.text,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              padding: '3px 10px',
              borderRadius: 9999,
              letterSpacing: '0.04em',
            }}>
              Term {term.term}{weekNum ? `, Week ${weekNum}` : ''}
            </span>
          )}
          {holidayLabel && (
            <span style={{
              background: '#E8D4A8',
              color: '#5D4033',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              padding: '3px 10px',
              borderRadius: 9999,
            }}>
              {holidayLabel}
            </span>
          )}
          {!isCurrentWeek && (
            <button
              onClick={goToCurrentWeek}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Nunito, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#E06010',
                padding: '3px 0',
              }}
            >
              Back to today
            </button>
          )}
        </div>

        {/* Set up / Edit week CTA — always tappable if onSetUpWeek is provided */}
        {onSetUpWeek && (
          <button
            onClick={onSetUpWeek}
            style={{
              background: weekIsSetUp ? 'transparent' : '#E06010',
              color: weekIsSetUp ? '#6B7A36' : '#fff',
              border: weekIsSetUp ? '1.5px solid #C8D8A8' : 'none',
              borderRadius: 9999,
              padding: '5px 12px',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 800,
              fontSize: '0.72rem',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: weekIsSetUp ? 'none' : '0 2px 0 #904008',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {weekIsSetUp ? 'Edit week' : 'Set up this week'}
          </button>
        )}
      </div>
    </div>
  );
}
