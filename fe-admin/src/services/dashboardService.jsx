export const fetchRevenueData = async () => [
  { month: "T1", revenue: 20 },
  { month: "T2", revenue: 25 },
  { month: "T3", revenue: 22 },
  { month: "T4", revenue: 30 },
  { month: "T5", revenue: 28 },
  { month: "T6", revenue: 35 },
  { month: "T7", revenue: 40 },
];

export const fetchTopDestinations = async () => [
  { city: "Hà Nội", percent: 30 },
  { city: "TP.HCM", percent: 25 },
  { city: "Paris", percent: 20 },
  { city: "Tokyo", percent: 15 },
];

export const fetchBookings = async () => [
  {
    id: "BK001",
    name: "Nguyễn Văn A",
    flight: "VN123",
    Airport: "Hà Nội",
    destination: "TP.HCM",
    seat: "12A",
    time: "2025-07-10 08:00",
    price: 2200000,
  },
  {
    id: "BK002",
    name: "Trần Thị B",
    flight: "VJ456",
    Airport: "TP.HCM",
    destination: "Đà Nẵng",
    seat: "7C",
    time: "2025-07-12 15:30",
    price: 1800000,
  },
  {
    id: "BK003",
    name: "Lê Minh C",
    flight: "QH789",
    Airport: "Đà Nẵng",
    destination: "Hà Nội",
    seat: "3B",
    time: "2025-07-15 19:45",
    price: 2100000,
  },
];


// Example data for testing 
// Need to replace with actual API calls in production 