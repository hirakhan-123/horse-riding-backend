const USER_ROLES = {
    ADMIN: 'admin',
    RIDER: 'rider',
  };
  
  const USER_VERIFIED_STATUS = {
    VERIFIED: true,
    UNVERIFIED: false,
  };
  
  const HORSE_AVAILABILITY = {
    AVAILABLE: true,
    UNAVAILABLE: false,
  };
  
  const TOKEN_EXPIRY_TIME = 3600;  // 1 hour
  
  const PASSWORD_MIN_LENGTH = 8;
  
  const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
  };
  
  const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
  };
  module.exports = {
    USER_ROLES,
    USER_VERIFIED_STATUS,
    HORSE_AVAILABILITY,
    TOKEN_EXPIRY_TIME,
    PASSWORD_MIN_LENGTH,
    BOOKING_STATUS,
    PAYMENT_STATUS
  };