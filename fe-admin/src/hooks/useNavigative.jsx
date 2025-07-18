import { useNavigate } from "react-router-dom";

/**
 * Custom hook để chuyển hướng trang một cách tiện lợi.
 * @returns {function} navigateTo - Hàm chuyển hướng, nhận vào đường dẫn và tuỳ chọn.
 */
const useNavigative = () => {
  const navigate = useNavigate();

  /**
   * Chuyển hướng đến đường dẫn chỉ định.
   * @param {string} path - Đường dẫn muốn chuyển hướng tới.
   * @param {object} options - Tuỳ chọn (state, replace, ...).
   */
  const navigateTo = (path, options = {}) => {
    navigate(path, options);
  };

  return navigateTo;
};

export default useNavigative;
