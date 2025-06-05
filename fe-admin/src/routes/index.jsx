import { hangBayRoutes } from "./hangBay.routes";
import { khachHangRoutes } from "./khachHang.routes";

export const allRoutes = [
  ...hangBayRoutes,
  ...khachHangRoutes,
  // thêm các routes khác ở đây
];
