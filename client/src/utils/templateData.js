export const WHATSAPP_TEMPLATES = [
  {
    id: "welcome",
    name: "Welcome Message",
    category: "Onboarding",
    content: `Hello *{name}*! 👋
  
  Welcome to our community. We're excited to have you on board.
  
  Here's what you can expect from us:
  • Regular updates about our products
  • Exclusive offers and discounts
  • Priority customer support
  
  Need help? Just reply to this message!
  
  Best regards,
  {company_name} Team`,
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    category: "E-commerce",
    content: `Thank you for your order, *{name}*! 🛍️
  
  Order Details:
  Order ID: #{order_id}
  Total Amount: {amount}
  
  Your order is being processed and will be shipped soon. We'll keep you updated on the status.
  
  Track your order here: {tracking_link}
  
  Questions? We're here to help!`,
    imageUrl:
      "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=800",
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminder",
    category: "Healthcare",
    content: `Hi *{name}*,
  
  This is a reminder for your appointment:
  📅 Date: {date}
  ⏰ Time: {time}
  📍 Location: {location}
  
  Please arrive 10 minutes early.
  
  Need to reschedule? Reply with "RESCHEDULE"
  
  See you soon!`,
    imageUrl:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
  },
  {
    id: "special-offer",
    name: "Special Offer",
    category: "Marketing",
    content: `🎉 Special Offer for *{name}*!
  
  Don't miss out on our exclusive deal:
  *{offer_description}*
  
  ✨ {discount}% OFF on all products
  ⏰ Valid until: {end_date}
  🎫 Use code: {promo_code}
  
  Shop now: {shop_link}
  
  Reply "INFO" for more details.`,
    imageUrl:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
  },
  {
    id: "feedback-request",
    name: "Feedback Request",
    category: "Customer Service",
    content: `Hello *{name}*,
  
  Thank you for choosing {company_name}! 
  
  We'd love to hear about your experience. Could you take a moment to share your feedback?
  
  Rate your experience (1-5):
  Simply reply with a number.
  
  Your feedback helps us serve you better!
  
  Best regards,
  {company_name} Team`,
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  },
  {
    id: "event-invitation",
    name: "Event Invitation",
    category: "Events",
    content: `🎈 You're Invited, *{name}*!
  
  Join us for: *{event_name}*
  
  📅 Date: {date}
  ⏰ Time: {time}
  📍 Venue: {location}
  
  What to expect:
  • {highlight_1}
  • {highlight_2}
  • {highlight_3}
  
  RSVP by replying "YES" or "NO"
  
  We hope to see you there!`,
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
  },
  {
    id: "payment-reminder",
    name: "Payment Reminder",
    category: "Finance",
    content: `Dear *{name}*,
  
  This is a friendly reminder that payment for invoice #{invoice_number} is due on {due_date}.
  
  Amount Due: {amount}
  
  Pay easily through our secure payment link:
  {payment_link}
  
  Questions about your invoice? We're here to help!
  
  Best regards,
  {company_name} Team`,
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
  },
  {
    id: "course-update",
    name: "Course Update",
    category: "Education",
    content: `Hello *{name}*! 📚
  
  New content is available in your course: *{course_name}*
  
  What's new:
  • {module_name}
  • Estimated time: {duration}
  • New resources available
  
  Access your course here:
  {course_link}
  
  Happy learning!
  {instructor_name}`,
    imageUrl:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
  },
  {
    id: "delivery-status",
    name: "Delivery Status",
    category: "Logistics",
    content: `Hi *{name}*,
  
  Your package is on its way! 📦
  
  Tracking Number: {tracking_number}
  Status: {status}
  Expected Delivery: {delivery_date}
  
  Track your package:
  {tracking_link}
  
  Questions about your delivery?
  Reply to this message for assistance.`,
    imageUrl:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800",
  },
  {
    id: "reservation-confirmation",
    name: "Reservation Confirmation",
    category: "Hospitality",
    content: `Thank you for choosing us, *{name}*!
  
  Your reservation is confirmed:
  🏨 {business_name}
  📅 Date: {date}
  ⏰ Time: {time}
  👥 Party size: {party_size}
  
  Special requests: {special_requests}
  
  Need to modify? Call us at {phone_number}
  
  We look forward to serving you!`,
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  },
];
