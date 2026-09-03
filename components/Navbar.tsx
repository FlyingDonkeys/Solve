// components/Navbar.tsx
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {ArrowUpRight} from "lucide-react";

interface NavItem {
  href: string
  text: string
  external?: boolean
}

const navigationMenuInfo: NavItem[] = [
  { href: "/", text: "Home" },
  { href: "/questions", text: "Problems" },
  { href: "https://t.me/FlyingDonkey1", text: "Contact Us", external: true },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/75 backdrop-blur-md">
      {/* Aligns with your page content width */}
      <div className="w-3/4 mx-auto flex h-14 items-center justify-between">

        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-white hover:text-neutral-300 transition-colors"
        >
          Solve
        </Link>

        {/* Navigation Items */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-2">
            {
              navigationMenuInfo.map((item, index) => {
                const isExternal = item.external || item.href.startsWith("http");

                return (
                  <NavigationMenuItem
                    key={index}
                  >
                    <NavigationMenuLink
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      aria-label={isExternal ? `${item.text} (opens in a new tab)` : undefined}
                      className={`${navigationMenuTriggerStyle()} text-base bg-transparent text-neutral-400 hover:bg-neutral-800 hover:text-white focus:bg-neutral-900 focus:text-white data-[active]:text-white`}
                    >
                      {item.text}
                      {isExternal && <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-500" />}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
          </NavigationMenuList>
        </NavigationMenu>

      </div>
    </header>
  )
}