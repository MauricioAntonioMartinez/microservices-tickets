import UserForm from "../../components/UserForm";

export default function SignIn() {
  return <UserForm endPoint="signin" title="Sign In" push="/" />;
}
