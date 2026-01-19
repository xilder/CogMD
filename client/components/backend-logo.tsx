import { cn } from "@/lib/utils";
import LogoImg from "@/public/brain-white.png";
import Image from "next/image";

type LogoSize = "small" | "medium" | "large";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  showText?: boolean;
  imageBuffer: ArrayBuffer 
}

const sizeConfig = {
  small: {
    container: "gap-1.5",
    iconBox: "w-8 h-8 rounded-md", // ~32px
    text: "text-lg mb-1",
  },
  medium: {
    container: "gap-2",
    iconBox: "w-12 h-12 rounded-lg", // ~48px
    text: "text-xl mb-1.5",
  },
  large: {
    container: "gap-3",
    iconBox: "w-16 h-16 rounded-xl", // ~64px
    text: "text-3xl mb-2",
  },
};

export const Logo = ({
  size = "medium",
  className,
  showText = true,
  imageBuffer
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
          "bg-primary relative flex shrink-0 items-center justify-center overflow-hidden",
          config.iconBox,
        )}
      >
        <img
          src={imageBuffer as any}
          alt="CognitoMD Logo"
          tw="object-cover p-1 w-32 h-32"  
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
