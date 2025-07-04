import { hangBayRoutes } from "./hangBay.routes";
import { khachHangRoutes } from "./khachHang.routes";
import { hangBanVeRoutes } from "./hangBanVe.routes"
import { sanBayRoutes } from "./sanBay.routes";
import { tuyenBayRoutes } from "./tuyenBay.routes"
import { chuyenBayRoutes } from "./chuyenBay.routes";
import { hangVeRoutes } from "./hangVe.routes";
import { loaiChuyenDiRoutes } from "./loaiChuyenDi.routes";
import { GiaVeRoutes } from "./giaVe.routes";
import { DatVeRoutes } from "./datVe.routes";
export const allRoutes = [
  ...hangBayRoutes,
  ...khachHangRoutes,
  ...hangBanVeRoutes,
  ...sanBayRoutes,
  ...tuyenBayRoutes,
  ...chuyenBayRoutes,
  ...hangVeRoutes,
  ...loaiChuyenDiRoutes,
  ...GiaVeRoutes,
  ...DatVeRoutes,
  // thêm các routes khác ở đây
];
