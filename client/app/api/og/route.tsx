import { Logo } from "@/components/backend-logo";
import { getCourseColor } from "@/lib/og-utils";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const question =
    searchParams.get("question_text") ||
    "Which nerve is responsible for the innervation of the diaphragm?";
  const optionA = searchParams.get("a") || "Phrenic nerve";
  const optionB = searchParams.get("b") || "Vagus nerve";
  const optionC = searchParams.get("c") || "Spinal nerve";
  const optionD = searchParams.get("d") || "Hypoglossal nerve ";
  const optionE = searchParams.get("e") || "Facial nerve";
  const difficulty = searchParams.get("difficulty") || "medium";
  const course = searchParams.get("specialty") || "anatomy";

  // const diffConfig = getDifficultyColor(difficulty);
  const courseConfig = getCourseColor(course);
  const imageBuffer = await fetch(
    new URL("../../../public/brain-white.png", import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
        border: "4px solid #000000",
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "120px",
          fontWeight: "bold",
          color: "rgba(0, 0, 0, 0.04)",
          zIndex: 0,
        }}
      >
        CognitoMD
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 48px",
          borderBottom: "4px solid #000000",
          background: "#fafafa",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0px',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                border: '2px solid #000000',
              }}
            >
              M
            </div> */}
          <Logo imageBuffer={imageBuffer} />
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#000000",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            CognitoMD
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "0px",
              background: "#fafafa",
              fontSize: "11px",
              color: "#000000",
              fontWeight: "700",
              border: "3px solid #000000",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Medical Quiz
          </div>
          {/* <div
            style={{
              padding: "6px 12px",
              borderRadius: "0px",
              background: "#fafafa",
              fontSize: "11px",
              color: diffConfig.color,
              fontWeight: "700",
              border: `3px solid ${diffConfig.color}`,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {diffConfig.label}
          </div> */}
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "0px",
              background: "#fafafa",
              fontSize: "11px",
              color: courseConfig.color,
              fontWeight: "700",
              border: `3px solid ${courseConfig.color}`,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {courseConfig.label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Left Side - Question */}
        <div
          style={{
            flex: "0 0 65%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px",
            borderRight: "4px solid #000000",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              lineHeight: "1.2",
              color: "#000000",
              textAlign: "left",
              padding: "32px",
              background: "#fafafa",
              border: "4px solid #000000",
            }}
          >
            {question}
          </div>
        </div>

        {/* Right Side - Options */}
        <div
          style={{
            flex: "0 0 35%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 32px",
            gap: "12px",
          }}
        >
          {[
            { letter: "A", text: optionA },
            { letter: "B", text: optionB },
            { letter: "C", text: optionC },
            { letter: "D", text: optionD },
            { letter: "E", text: optionE },
          ].map((option) => (
            <div
              key={option.letter}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "0px",
                background: "#fafafa",
                fontSize: "13px",
                color: "#000000",
                fontWeight: "600",
                border: "3px solid #000000",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "0px",
                  background: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "white",
                  flexShrink: 0,
                  border: "2px solid #000000",
                }}
              >
                {option.letter}
              </span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {option.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 48px",
          borderTop: "4px solid #000000",
          background: "#fafafa",
          fontSize: "13px",
          color: "#000000",
          fontWeight: "600",
          zIndex: 10,
        }}
      >
        cognitomd.vercel.app
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
