import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import qs from "qs";

const useLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        qs.stringify({
          username: form.username,
          password: form.password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data?.access_token) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/"); // đường dẫn sau đăng nhập
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      setError("Sai tài khoản hoặc mật khẩu.");
    }
  };

  console.log(form);

  return {
    form,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
