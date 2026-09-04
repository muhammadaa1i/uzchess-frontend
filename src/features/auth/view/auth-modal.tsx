"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignInForm } from "@/features/auth/view/sign-in-form"
import { SignUpForm } from "@/features/auth/view/sign-up-form"
import { VerifyEmailPrompt } from "@/features/auth/view/verify-email-prompt"
import { useAuthModal } from "@/features/auth/viewmodel/use-auth-modal"

// Single overlay rendered once from SiteShell, switching between sign-in,
// sign-up, and the post-signup email-verification prompt based on Redux's
// `modalView` — see CLAUDE.md's Auth section ("modal/overlay flow over
// dimmed home background, not standalone routes").
function AuthModal() {
  const { view, isOpen, close } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        {view === "sign-in" && <SignInForm />}
        {view === "sign-up" && <SignUpForm />}
        {view === "verify-email" && <VerifyEmailPrompt />}
      </DialogContent>
    </Dialog>
  )
}

export { AuthModal }
