import * as Yup from "yup";

const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

// 로그인 전용 검증
export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .email("이메일 형식이 올바르지 않습니다.")
    .required("이메일은 필수 입력 항목입니다."),
  password: Yup.string()
    .required("비밀번호는 필수 입력 항목입니다."),
});

// 회원가입 전용 검증
export const authValidation = Yup.object().shape({
  email: Yup.string()
    .email("이메일 형식이 올바르지 않습니다.")
    .required("이메일은 필수 입력 항목입니다."),
  authCode: Yup.string()
    .matches(/^\d{6}$/, "인증번호는 숫자 6자리여야 합니다.")
    .required("인증번호를 입력해주세요."),
  password: Yup.string()
    .matches(passwordRegExp, "영문, 숫자, 특수문자를 포함하여 8~15자로 입력해주세요.")
    .required("비밀번호는 필수 입력 항목입니다.")
    .min(8, "비밀번호는 8자 이상이어야 합니다."),
  confirmPw: Yup.string()
    .oneOf([Yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수입니다."),
  nickname: Yup.string()
    .trim()
    .min(2, "닉네임은 2자 이상이어야 합니다.")
    .max(10, "닉네임은 10자 이하여야 합니다.")
    .required("닉네임은 필수 입력 항목입니다."),
});

export default authValidation;