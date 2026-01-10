import LoginRegister from "../../components/loginRegister/Index";

// 自定义登录页面必须得[[...sign-in]]，官方说的
const SignIn = () => {
  return <LoginRegister href="/sign-up" isShowPassword={false} />;
};

export default SignIn;
