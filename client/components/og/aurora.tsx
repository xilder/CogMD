import { ImageResponse } from 'next/og';
import { getDifficultyColor, getCourseColor } from '@/lib/og-utils';

export const runtime = 'edge';

export async function GET(request: Request) {
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
            'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Aurora Lights */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 1,
            animation: 'float 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
            filter: 'blur(80px)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '50%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
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
            color: 'rgba(255, 255, 255, 0.05)',
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
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
                background: 'rgba(16, 185, 129, 0.15)',
                fontSize: '12px',
                color: '#6ee7b7',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)',
              }}
            >
              Medical Quiz
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: `rgba(${parseInt(diffConfig.color.slice(1, 3), 16)}, ${parseInt(diffConfig.color.slice(3, 5), 16)}, ${parseInt(diffConfig.color.slice(5, 7), 16)}, 0.15)`,
                fontSize: '12px',
                color: diffConfig.color,
                fontWeight: '600',
                border: `1px solid rgba(${parseInt(diffConfig.color.slice(1, 3), 16)}, ${parseInt(diffConfig.color.slice(3, 5), 16)}, ${parseInt(diffConfig.color.slice(5, 7), 16)}, 0.3)`,
              }}
            >
              {diffConfig.label}
            </div>
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: `rgba(${parseInt(courseConfig.color.slice(1, 3), 16)}, ${parseInt(courseConfig.color.slice(3, 5), 16)}, ${parseInt(courseConfig.color.slice(5, 7), 16)}, 0.15)`,
                fontSize: '12px',
                color: courseConfig.color,
                fontWeight: '600',
                border: `1px solid rgba(${parseInt(courseConfig.color.slice(1, 3), 16)}, ${parseInt(courseConfig.color.slice(3, 5), 16)}, ${parseInt(courseConfig.color.slice(5, 7), 16)}, 0.3)`,
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
              borderRight: '1px solid rgba(16, 185, 129, 0.2)',
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
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
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
                  background: 'rgba(16, 185, 129, 0.08)',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#6ee7b7',
                    flexShrink: 0,
                    border: '1px solid rgba(16, 185, 129, 0.3)',
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
            borderTop: '1px solid rgba(16, 185, 129, 0.2)',
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
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
