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
          backgroundColor: '#000000',
          fontFamily: '"Courier New", monospace',
          position: 'relative',
          color: '#00ff00',
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
            color: 'rgba(0, 255, 0, 0.08)',
            zIndex: 0,
            textShadow: '0 0 10px rgba(0, 255, 0, 0.1)',
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
            borderBottom: '2px solid #00ff00',
            background: '#000000',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0px',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ff00',
                fontWeight: 'bold',
                fontSize: '18px',
                border: '2px solid #00ff00',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#00ff00',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                letterSpacing: '2px',
              }}
            >
              COGNITOMD
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
                borderRadius: '0px',
                background: '#000000',
                fontSize: '11px',
                color: '#00ff00',
                fontWeight: '700',
                border: '2px solid #00ff00',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
              }}
            >
              Quiz
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '0px',
                background: '#000000',
                fontSize: '11px',
                color: diffConfig.color,
                fontWeight: '700',
                border: `2px solid ${diffConfig.color}`,
                textShadow: `0 0 10px ${diffConfig.color}`,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {diffConfig.label}
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '0px',
                background: '#000000',
                fontSize: '11px',
                color: courseConfig.color,
                fontWeight: '700',
                border: `2px solid ${courseConfig.color}`,
                textShadow: `0 0 10px ${courseConfig.color}`,
                textTransform: 'uppercase',
                letterSpacing: '1px',
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
              borderRight: '2px solid #00ff00',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: '700',
                lineHeight: '1.2',
                color: '#00ff00',
                textAlign: 'left',
                padding: '32px',
                background: '#000000',
                border: '2px solid #00ff00',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.05)',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
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
                  borderRadius: '0px',
                  background: '#000000',
                  fontSize: '13px',
                  color: '#00ff00',
                  fontWeight: '600',
                  border: '2px solid #00ff00',
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.2)',
                  textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '0px',
                    background: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#00ff00',
                    flexShrink: 0,
                    border: '2px solid #00ff00',
                    boxShadow: '0 0 8px rgba(0, 255, 0, 0.5)',
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
            borderTop: '2px solid #00ff00',
            background: '#000000',
            fontSize: '13px',
            color: '#00ff00',
            fontWeight: '600',
            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
            zIndex: 10,
          }}
        >
          $ cognito-md.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
