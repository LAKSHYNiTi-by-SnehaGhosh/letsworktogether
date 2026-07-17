"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2, CheckCircle2 } from "lucide-react"

export function WaitlistButton({ children, className, onClick, variant, size }: { children: React.ReactNode, className?: string, onClick?: () => void, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link", size?: "default" | "sm" | "lg" | "icon" }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    try {
      await addDoc(collection(db, "waitlist"), {
        email,
        createdAt: serverTimestamp(),
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to join waitlist. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
            setTimeout(() => {
                setSuccess(false)
                setEmail("")
                setError("")
            }, 300)
        }
    }}>
      {/* @ts-ignore */}
      <DialogTrigger asChild>
        <Button className={className} variant={variant} size={size} onClick={onClick}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Join the LWT Waiting List</DialogTitle>
          <DialogDescription>
            Enter your email to get early access when we launch.
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <div>
              <h3 className="font-bold text-xl">You're on the list!</h3>
              <p className="text-muted-foreground mt-2">We'll notify you at <span className="font-medium text-foreground">{email}</span> as soon as we open up early access.</p>
            </div>
            <Button className="w-full mt-4" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="h-12 w-full bg-[image:var(--brand-gradient)] border-0 text-white shadow-lg hover:shadow-primary/25" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Join Waiting List"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
