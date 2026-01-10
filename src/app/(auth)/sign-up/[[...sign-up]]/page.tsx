import LoginRegister from "../../components/loginRegister/Index";

// 自定义登录页面必须得[[...sign-up]]，官方说的
const SignUp = () => {
  return <LoginRegister href="/sign-in" isShowPassword />;
};

export default SignUp;
