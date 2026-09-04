import {
  authModalClosed,
  authModalOpened,
  type AuthModalView,
} from "@/features/auth/model/auth-slice"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"

function useAuthModal() {
  const dispatch = useAppDispatch()
  const view = useAppSelector((state) => state.auth.modalView)

  return {
    view,
    isOpen: view !== "closed",
    open: (view: Exclude<AuthModalView, "closed">) => dispatch(authModalOpened(view)),
    close: () => dispatch(authModalClosed()),
  }
}

export { useAuthModal }
