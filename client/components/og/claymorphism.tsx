import { ImageResponse } from 'next/og';
import { getDifficultyColor, getCourseColor } from '@/lib/og-utils';

export const runtime = 'edge';

export default async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const question =
    searchParams.get('question') ||
    'Which nerve is responsible for the innervation of the diaphragm?';
  const optionA = searchParams.get('optionA') || 'Phrenic nerve';
  const optionB = searchParams.get('optionB') || 'Vagus nerve';
  const optionC = searchParams.get('optionC') || 'Spinal nerve';
  const optionD = searchParams.get('optionD') || 'Hypoglossal nerve';
  const optionE = searchParams.get('optionE') || 'Facial nerve';
  const difficulty = searchParams.get('difficulty') || 'medium';
  const course = searchParams.get('course') || 'anatomy';

  const diffConfig = getDifficultyColor(difficulty);
  const courseConfig = getCourseColor(course);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#faf8f3',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '120px',
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.05)',
            zIndex: 0,
          }}
        >
          CognitoMD
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px 48px',
            borderBottom: '2px solid #f0ebe2',
            background: '#faf8f3',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 8px 16px rgba(217, 119, 6, 0.3)',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2d2416',
              }}
            >
              CognitoMD
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                background: '#f5f1ea',
                fontSize: '12px',
                color: '#d97706',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              }}
            >
              Medical Quiz
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                background: '#f5f1ea',
                fontSize: '12px',
                color: diffConfig.color,
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              }}
            >
              {diffConfig.label}
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                background: '#f5f1ea',
                fontSize: '12px',
                color: courseConfig.color,
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
              }}
            >
              {courseConfig.label}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            position: 'relative',
            zIndex: 5,
          }}
        >
          {/* Left Side - Question */}
          <div
            style={{
              flex: '0 0 65%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              borderRight: '2px solid #f0ebe2',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: '600',
                lineHeight: '1.3',
                color: '#2d2416',
                textAlign: 'left',
                padding: '32px',
                borderRadius: '20px',
                background: '#f5f1ea',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {question}
            </div>
          </div>

          {/* Right Side - Options */}
          <div
            style={{
              flex: '0 0 35%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '48px 32px',
              gap: '12px',
            }}
          >
            {[
              { letter: 'A', text: optionA },
              { letter: 'B', text: optionB },
              { letter: 'C', text: optionC },
              { letter: 'D', text: optionD },
              { letter: 'E', text: optionE },
            ].map((option) => (
              <div
                key={option.letter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: '#f5f1ea',
                  fontSize: '14px',
                  color: '#2d2416',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                    flexShrink: 0,
                    boxShadow: '0 4px 8px rgba(217, 119, 6, 0.2)',
                  }}
                >
                  {option.letter}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {option.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 48px',
            borderTop: '2px solid #f0ebe2',
            background: '#faf8f3',
            boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
            color: '#6b5e52',
            zIndex: 10,
          }}
        >
          cognito-md.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
