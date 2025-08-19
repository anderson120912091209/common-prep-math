import LandingPage from "./components/LandingPage";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <ClerkProvider>
      <LandingPage />
    </ClerkProvider>
  );
}
