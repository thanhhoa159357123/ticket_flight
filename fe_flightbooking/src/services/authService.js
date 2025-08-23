const BASE_URL = "http://localhost:8000";

export const loginUser = async (email, matkhau) => {
  const res = await fetch(
    `${BASE_URL}/auth/login?email=${encodeURIComponent(email)}&matkhau=${encodeURIComponent(matkhau)}`,
    {
      method: "POST",
    }
  );

  const data = await res.json();

  // ✅ Trường hợp backend trả 200 nhưng login sai
  if (!res.ok || data.success === false || data.status === "error") {
    throw new Error(data.message || data.detail || "Đăng nhập thất bại");
  }

  return data;
};

export const registerUser = async (payload) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Đăng ký thất bại");
  return data;
};
