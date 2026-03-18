"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { SidebarNav } from "./SidebarNav"

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r bg-background lg:flex">
      {/* LOGO */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">GreenMind</span>
        </Link>
      </div>

      <SidebarNav />
    </aside>
  )
}
