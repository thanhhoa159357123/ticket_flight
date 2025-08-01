// ✅ Utility functions để xử lý variants
export const getBaseCode = (maGiaVe) => {
  return maGiaVe.split('+')[0];
};

export const getVariantType = (maGiaVe) => {
  const parts = maGiaVe.split('+');
  return parts.length > 1 ? `+${parts[1]}` : '';
};

export const groupFlightsByBase = (flights) => {
  const grouped = {};
  
  flights.forEach(flight => {
    const baseCode = getBaseCode(flight.ma_gia_ve);
    
    if (!grouped[baseCode]) {
      grouped[baseCode] = {
        base: null,
        variants: []
      };
    }
    
    // Tìm base flight (không có +HL, +AT)
    if (getVariantType(flight.ma_gia_ve) === '') {
      grouped[baseCode].base = flight;
    }
    
    grouped[baseCode].variants.push(flight);
  });
  
  return grouped;
};

export const getDisplayFlights = (flights) => {
  const grouped = groupFlightsByBase(flights);
  return Object.values(grouped)
    .map(group => ({
      ...group.base,
      variantCount: group.variants.length,
      allVariants: group.variants
    }))
    .filter(flight => flight.ma_gia_ve); // Loại bỏ null
};