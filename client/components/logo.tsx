import Link from "next/link";
import Image from "next/image";
import LogoImg from "@/public/logo.png"; // Update this path to your actual image
import { cn } from "@/lib/utils"; // Assuming you have a clsx/tailwind-merge utility (standard in shadcn)
// If you don't have 'cn', just use template literals: `classA ${classB}`

type LogoSize = "small" | "medium" | "large";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  showText?: boolean;
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

export const Logo = ({ size = "medium", className, showText = true }: LogoProps) => {
  const config = sizeConfig[size];

  return (
    <Link 
      href="/" 
      className={cn("flex items-center transition-opacity hover:opacity-90", config.container, className)}
    >
      {/* Icon Container */}
      <div className={cn("bg-primary flex items-center justify-center shrink-0 overflow-hidden relative", config.iconBox)}>
        <Image 
          src={LogoImg} 
          alt="CognitoMD Logo" 
          fill
          className="object-cover p-1" // 'p-1' adds a little breathing room inside the colored box
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Text Brand */}
      {showText && (
        <span className={cn("font-bold text-foreground self-end hidden sm:inline", config.text)}>
          CognitoMD
        </span>
      )}
    </Link>
  );
};