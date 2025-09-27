"use client"

import { palette } from "./palette"
import { cn } from "@/lib/utils"
import { MoreVertical, Plus, Timer } from "lucide-react"
import type * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function BadgePill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs"
      style={{ backgroundColor: "#f6f6f6", color: palette.text }}
    >
      {children}
    </span>
  )
}

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <Button
      {...props}
      className={cn("rounded-full px-5", className)}
      style={{ backgroundColor: palette.brand, color: "#ffffff" }}
    >
      {children}
    </Button>
  )
}

export function SubtleButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return (
    <Button
      variant="outline"
      {...props}
      className={cn("rounded-full px-5", className)}
      style={{
        borderColor: palette.border,
        color: palette.text,
        backgroundColor: "#f6f6f6",
      }}
    >
      {children}
    </Button>
  )
}

export function CenterCard({
  title,
  children,
  footer,
  className,
}: {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <div className="w-full flex items-center justify-center py-10">
      <Card
        className={cn("w-full max-w-md shadow-sm", className)}
        style={{ backgroundColor: palette.surface, borderColor: palette.border }}
      >
        <CardHeader className="text-center">
          <div className="mx-auto">
            <BadgePill>LIVE POLL</BadgePill>
          </div>
          {title ? (
            <CardTitle className="mt-2 text-balance text-lg font-semibold" style={{ color: palette.text }}>
              {title}
            </CardTitle>
          ) : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer}
      </Card>
    </div>
  )
}

export function KebabMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Reset</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function FabAdd() {
  return (
    <button
      aria-label="Add"
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-md grid place-items-center"
      style={{ backgroundColor: palette.brand, color: "#ffffff" }}
    >
      <Plus className="h-5 w-5" />
    </button>
  )
}

export function TinyTimer({ text = "01:00" }: { text?: string }) {
  return (
    <div className="flex items-center gap-1 text-xs font-medium" style={{ color: palette.danger }}>
      <Timer className="h-3.5 w-3.5" />
      <span>{text}</span>
    </div>
  )
}

export function ThinProgress({ value }: { value: number }) {
  return (
    <div className="w-full overflow-hidden rounded-md" style={{ backgroundColor: "#f1f1f1" }}>
      <div className="h-2" style={{ width: `${value}%`, backgroundColor: palette.brand }} />
    </div>
  )
}

export function Field({ id, label, placeholder }: { id: string; label: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs" style={{ color: "#454545" }}>
        {label}
      </Label>
      <Input id={id} placeholder={placeholder} className="h-9" style={{ borderColor: palette.border }} />
    </div>
  )
}

export function RadioOptions({
  options,
  name,
}: {
  options: { id: string; label: string }[]
  name: string
}) {
  return (
    <RadioGroup className="space-y-2" name={name}>
      {options.map((opt) => (
        <div key={opt.id} className="flex items-center gap-2">
          <RadioGroupItem id={opt.id} value={opt.id} />
          <Label htmlFor={opt.id} className="text-sm" style={{ color: palette.text }}>
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
