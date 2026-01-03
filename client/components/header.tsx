"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Logo from "@/public/brain-white.png"
import Image from "next/image"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 rounded-lg">
          <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
            {/* <span className="text-primary-foreground font-bold text-lg">C</span> */}
            <Image src={Logo} alt={"Brain Logo"} className="object-fit"/>
          </div>
          <span className="font-bold text-xl self-end text-foreground hidden sm:inline mb-2">CognitoMD</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="/faq" className="text-foreground hover:text-primary transition-colors">
            FAQ
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <Link href="#features" className="block text-foreground hover:text-primary">
              Features
            </Link>
            <Link href="/about" className="block text-foreground hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="block text-foreground hover:text-primary">
              Contact
            </Link>
            <Link href="/faq" className="block text-foreground hover:text-primary">
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
