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
          background:
            'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mesh Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(79, 172, 254, 0.4) 0%, transparent 50%)',
            zIndex: 1,
          }}
        />

        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '120px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.08)',
            zIndex: 2,
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
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
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              Medical Quiz
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {diffConfig.label}
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                fontSize: '12px',
                color: 'white',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
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
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: '600',
                lineHeight: '1.3',
                color: 'white',
                textAlign: 'left',
                padding: '32px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
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
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  fontSize: '14px',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                    flexShrink: 0,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)',
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
