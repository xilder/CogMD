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
          backgroundColor: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
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
            color: 'rgba(255, 255, 255, 0.05)',
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              M
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
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
                borderRadius: '16px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                fontSize: '12px',
                color: '#93c5fd',
                fontWeight: '600',
              }}
            >
              Medical Quiz
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: `rgba(${parseInt(diffConfig.color.slice(1, 3), 16)}, ${parseInt(diffConfig.color.slice(3, 5), 16)}, ${parseInt(diffConfig.color.slice(5, 7), 16)}, 0.15)`,
                border: `1px solid rgba(${parseInt(diffConfig.color.slice(1, 3), 16)}, ${parseInt(diffConfig.color.slice(3, 5), 16)}, ${parseInt(diffConfig.color.slice(5, 7), 16)}, 0.3)`,
                fontSize: '12px',
                color: diffConfig.color,
                fontWeight: '600',
              }}
            >
              {diffConfig.label}
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                backgroundColor: `rgba(${parseInt(courseConfig.color.slice(1, 3), 16)}, ${parseInt(courseConfig.color.slice(3, 5), 16)}, ${parseInt(courseConfig.color.slice(5, 7), 16)}, 0.15)`,
                border: `1px solid rgba(${parseInt(courseConfig.color.slice(1, 3), 16)}, ${parseInt(courseConfig.color.slice(3, 5), 16)}, ${parseInt(courseConfig.color.slice(5, 7), 16)}, 0.3)`,
                fontSize: '12px',
                color: courseConfig.color,
                fontWeight: '600',
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
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: '600',
                lineHeight: '1.3',
                color: 'white',
                textAlign: 'left',
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
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#93c5fd',
                    flexShrink: 0,
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
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
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
