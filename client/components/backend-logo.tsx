import { cn } from "@/lib/utils";

type LogoSize = "small" | "medium" | "large";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  showText?: boolean;
  imageBuffer: ArrayBuffer;
}

const sizeConfig = {
  small: {
    container: "gap-1.5",
    iconBox: "w-10 h-10 rounded-md", // ~32px
    text: "text-lg mb-1",
  },
  medium: {
    container: "gap-1",
    iconBox: "w-15 h-15 rounded-lg", // ~48px
    text: "text-base",
  },
  large: {
    container: "gap-3",
    iconBox: "w-20 h-20 rounded-xl", // ~64px
    text: "text-3xl mb-2",
  },
};

export const Logo = ({
  size = "medium",
  className,
  showText = true,
  imageBuffer,
}: LogoProps) => {
  const config = sizeConfig[size];

  return (
    <div
      tw={cn(
        "flex items-center transition-opacity hover:opacity-90",
        config.container,
        className,
      )}
    >
      {/* Icon Container */}
      <div
        tw={cn(
          "bg-primary relative flex shrink-0 items-center justify-center m-1 gap-2 w-25 h-25",
          config.iconBox,
        )}
      >
        <img
          src={imageBuffer as any}
          alt="CognitoMD Logo"
          tw="object-cover p-1"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Text Brand */}
      {showText && (
        <span
          tw={cn(
            "text-foreground hidden self-end font-bold sm:inline",
            config.text,
          )}
        >
          CognitoMD
        </span>
      )}
    </div>
  );
};
