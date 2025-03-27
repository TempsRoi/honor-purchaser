import axios from "axios";

export const processCharge = async (amount: number): Promise<void> => {
  const response = await axios.post("/api/charge/", { amount }); // 🔹 末尾の `/` を追加
  window.location.href = response.data.url;
};
