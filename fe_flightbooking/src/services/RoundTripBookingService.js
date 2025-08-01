import { createBooking } from './TicketOptionalsPanelService';

export const createRoundTripBooking = async (outboundData, returnData) => {
  try {
    // Tạo đơn đặt vé cho chuyến đi
    const outboundBooking = await createBooking(outboundData);
    
    if (!outboundBooking?.ma_dat_ve) {
      throw new Error('Không thể tạo đơn đặt vé chuyến đi');
    }

    // Tạo đơn đặt vé cho chuyến về
    const returnBooking = await createBooking(returnData);
    
    if (!returnBooking?.ma_dat_ve) {
      throw new Error('Không thể tạo đơn đặt vé chuyến về');
    }

    return {
      outboundBooking,
      returnBooking
    };
  } catch (error) {
    console.error('❌ Lỗi khi tạo đặt vé khứ hồi:', error);
    throw error;
  }
};