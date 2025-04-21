import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";


export default function RequireAuth({ children }) {
  // Authenticator will render its own login/signup flow when unauthenticated,
  // then show {children} once the user is signed in.
  return <Authenticator>{() => children}</Authenticator>;
}