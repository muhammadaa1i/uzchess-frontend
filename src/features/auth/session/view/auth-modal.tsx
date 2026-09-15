"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { SignInForm } from "@/features/auth/login/view/sign-in-form"
import { SignUpForm } from "@/features/auth/register/view/sign-up-form"
import { useAuthModal } from "@/features/auth/session/viewmodel/use-auth-modal"
import { VerifyEmailPrompt } from "@/features/auth/verify-email/view/verify-email-prompt"

// Single overlay rendered once from SiteShell, switching between sign-in,
// sign-up, and the post-signup email-verification prompt based on Redux's
// `modalView` — see CLAUDE.md's Auth section ("modal/overlay flow over
// dimmed home background, not standalone routes"). Lives in `session` since
// it spans the login/register/verify-email sibling slices rather than
// belonging to any single one of them.
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
