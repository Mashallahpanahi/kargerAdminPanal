import { create } from "zustand";
import { persist } from "zustand/middleware";

type MessageSender = "user" | "provider";
interface ChatMessage {
  id: number;
  sender: MessageSender;
  text: string;
}

export interface Booking {
  id: number;
  customerId: number;
  providerId: number;
  username: string;
  providerName: string;
  uservatar?: string;
  providerAvatar?: string;
  userRating?: number;
  providerRating?: number;

  status:
    | "Requested"
    | "Approved"
    | "Accepted"
    | "Started"
    | "Completed"
    | "Cancelled"
    | "Expired"
    | "Cancelled by user"
    | "Cancelled by service provider";
  isScheduled?: boolean;
  scheduledFrom: string;
  scheduledTo: string;
  actualStart?: string;
  actualEnd?: string;
  location: string;
  paymentStatus?: "Paid" | "Unpaid";
  holdStatus?: "Yes" | "No";
  paymentMethod: "Cash" | "Credit Card" | "Online Payment";
  totalAmount: number;
  visitFee?: number;
  userServiceFee?: number;
  providerServiceFee?: number;
  userPayable?: number;
  providerEarnings: number;
  platformEarnings: number;
  cancellationReason?: string;
  failedPayoutReason?: string;
  cancelledBy?: "user" | "provider";
  createdAt: string;
  updatedAt: string;
  category: string;
  progressTimestamps?: {
    requested?: string;
    accepted?: string;
    arrived?: string;
    reviewed?: string;
    started?: string;
    completed?: string;
    cancelled?: string;
  };
  jobDetails?: {
    subCategory?: string;
    fieldSubCategory?: string;
    quantity?: number;
    fieldQuantity?: number;
    amount?: number;
  };
  userPhoneNumber: string;
  providerPhoneNumber: string;
  countryCode: string;
  countryName: string;
  lastName: string;
  userEmail: string;
  providerEmail: string;
  chatMessages?: ChatMessage[];
}

interface BookingStore {
  bookings: Booking[];
  currentPage: number;
  bookingsPerPage: number;
  searchTerm: string;
  statusFilter: string | null;

  // CRUD Operations
  createBooking: (
    booking: Omit<
      Booking,
      "id" | "createdAt" | "updatedAt" | "status" | "progressTimestamps"
    >
  ) => void;
  updateBooking: (id: number, updates: Partial<Booking>) => void;
  deleteBooking: (id: number) => void;
  cancelBooking: (
    id: number,
    reason: string,
    initiator: "user" | "provider"
  ) => void;
  completeBooking: (id: number) => void;

  // Status transitions
  acceptBooking: (id: number) => void;
  startBooking: (id: number) => void;

  // Getters
  getBooking: (id: number) => Booking | undefined;

  getFilteredBookings: () => Booking[];
  getPaginatedBookings: () => Booking[];
  getAllBooking: () => Booking[];
  getTotalPages: () => number;

  // Filters
  setStatusFilter: (status: string | null) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [
        {
          id: 1,
          customerId: 1,
          username: "Ali",
          providerId: 1,
          providerName: "Lyla",
          uservatar: "/images/userphoto1.png",
          providerAvatar: "/images/providerphoto1.png",
          userRating: 3,
          providerRating: 4,
          status: "Completed",
          paymentStatus: "Paid",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          holdStatus: "Yes",
          isScheduled: false,
          scheduledFrom: "01-06-2025 09:00:00",
          scheduledTo: "01-06-2025 10:00:00",
          actualStart: "01-06-2025 09:05:00",
          actualEnd: "01-06-2025 09:55:00",
          location: "New York, USA",
          paymentMethod: "Cash",
          visitFee: 2,
          userServiceFee: 6,
          providerServiceFee: 8,
          userPayable: 40,
          totalAmount: 100,
          providerEarnings: 80,
          platformEarnings: 20,
          createdAt: "31-05-2025 14:30:00",
          updatedAt: "01-06-2025 09:55:00",
          countryCode: "+1",
          countryName: "United States",
          lastName: "Doe",
          userEmail: "john.doe@example.com",
          userPhoneNumber: "+1 (555) 123-4567",
          providerPhoneNumber: "+1 (555) 987-6543",
          providerEmail: "handyman.services@example.com",
          category: "Electricians",

          progressTimestamps: {
            requested: "31-05-2025 14:30:00",
            accepted: "31-05-2025 16:45:00",
            arrived: "01-06-2025 09:00:00",
            started: "01-06-2025 09:05:00",
            completed: "01-06-2025 09:55:00",
          },
          jobDetails: {
            subCategory: "Wiring Repair",
            quantity: 1,
            amount: 100,
          },
          chatMessages: [
            {
              id: 1,
              sender: "user",
              text: "Hi there, I need help with my electrical wiring",
            },
            {
              id: 2,
              sender: "provider",
              text: "Hello! I can help with that. What exactly is the issue?",
            },
            {
              id: 3,
              sender: "user",
              text: "The lights in my living room keep flickering",
            },
            {
              id: 4,
              sender: "provider",
              text: "OK Can you explian it well",
            },
            {
              id: 5,
              sender: "user",
              text: "Would tomorrow at 2pm work for you?",
            },
            {
              id: 6,
              sender: "provider",
              text: "Yes, that works for me. I'll see you then.",
            },
            {
              id: 7,
              sender: "user",
              text: "Great, thanks! The address is 123 Main St.",
            },
            {
              id: 8,
              sender: "provider",
              text: "Got it. I'll bring all the necessary tools.",
            },
            {
              id: 9,
              sender: "user",
              text: "Perfect. Do I need to prepare anything?",
            },
            {
              id: 10,
              sender: "provider",
              text: "Just make sure the circuit breaker is accessible.",
            },
            {
              id: 11,
              sender: "user",
              text: "Will do. See you tomorrow!",
            },
            {
              id: 12,
              sender: "provider",
              text: "Looking forward to it. Have a good day!",
            },
          ],
        },
        {
          id: 11,
          customerId: 11,
          username: "priya_sharma",
          providerId: 11,
          providerName: "PlumbPro Mumbai",
          userRating: 4,
          providerRating: 5,
          status: "Completed",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          paymentStatus: "Unpaid",
          holdStatus: "No",
          isScheduled: true,
          scheduledFrom: "11-06-2025 08:30:00",
          scheduledTo: "11-06-2025 10:30:00",
          actualStart: "11-06-2025 08:40:00",
          actualEnd: "11-06-2025 10:15:00",
          location: "Mumbai, India",
          paymentMethod: "Cash",
          visitFee: 5,
          userServiceFee: 7,
          providerServiceFee: 456,
          userPayable: 34,
          totalAmount: 120,
          providerEarnings: 96,
          platformEarnings: 24,
          createdAt: "10-06-2025 14:20:00",
          updatedAt: "11-06-2025 10:15:00",
          userPhoneNumber: "+1 (212) 555-7890",
          providerPhoneNumber: "+1 (212) 555-4321",
          providerEmail: "electrician.nyc@example.com",
          countryCode: "+91",
          countryName: "India",
          lastName: "Sharma",
          userEmail: "priya.sharma@example.com",
          category: "Plumbing",
          progressTimestamps: {
            requested: "10-06-2025 14:20:00",
            accepted: "10-06-2025 16:05:00",
            arrived: "11-06-2025 08:25:00",
            started: "11-06-2025 08:40:00",
            completed: "11-06-2025 10:15:00",
          },
          jobDetails: {
            subCategory: "Bathroom Fixtures",
            quantity: 2,
            amount: 1000,
          },
        },
        {
          id: 12,
          customerId: 12,
          username: "carlos_garcia",
          providerId: 12,
          uservatar: "/images/userphoto1.png",
          providerAvatar: "/images/providerphoto1.png",
          providerName: "CleanBarcelona",
          userRating: 5,
          providerRating: 2,
          status: "Cancelled by user",
          isScheduled: true,
          scheduledFrom: "12-06-2025 11:00:00",
          scheduledTo: "12-06-2025 13:00:00",
          location: "Barcelona, Spain",
          paymentMethod: "Online Payment",
          visitFee: 3,
          userServiceFee: 9,
          providerServiceFee: 324,
          userPayable: 234,
          totalAmount: 180,
          providerEarnings: 144,
          platformEarnings: 36,
          createdAt: "11-06-2025 09:15:00",
          updatedAt: "11-06-2025 18:30:00",
          cancellationReason: "Changed my mind",
          cancelledBy: "user",
          userPhoneNumber: "+44 7911 123456",
          providerPhoneNumber: "+44 7911 654321",
          providerEmail: "plumbing.london@example.co.uk",
          countryCode: "+34",
          countryName: "Spain",
          lastName: "Garcia",
          userEmail: "carlos.garcia@example.com",
          category: "Cleaning",
          progressTimestamps: {
            requested: "11-06-2025 09:15:00",
            cancelled: "11-06-2025 18:30:00",
          },
          jobDetails: {
            subCategory: "Office Cleaning",
          },
          chatMessages: [
            {
              id: 1,
              sender: "user",
              text: "Hi there, I need help with my electrical wiring",
            },
            {
              id: 2,
              sender: "provider",
              text: "Hello! I can help with that. What exactly is the issue?",
            },
            {
              id: 3,
              sender: "user",
              text: "The lights in my living room keep flickering",
            },
            {
              id: 4,
              sender: "provider",
              text: "OK Can you explian it well",
            },
            {
              id: 5,
              sender: "user",
              text: "Would tomorrow at 2pm work for you?",
            },
            {
              id: 6,
              sender: "provider",
              text: "Yes, that works for me. I'll see you then.",
            },
            {
              id: 7,
              sender: "user",
              text: "Great, thanks! The address is 123 Main St.",
            },
            {
              id: 8,
              sender: "provider",
              text: "Got it. I'll bring all the necessary tools.",
            },
            {
              id: 9,
              sender: "user",
              text: "Perfect. Do I need to prepare anything?",
            },
            {
              id: 10,
              sender: "provider",
              text: "Just make sure the circuit breaker is accessible.",
            },
            {
              id: 11,
              sender: "user",
              text: "Will do. See you tomorrow!",
            },
            {
              id: 12,
              sender: "provider",
              text: "Looking forward to it. Have a good day!",
            },
          ],
        },
        {
          id: 13,
          customerId: 13,
          username: "maria_rossi",
          lastName: "Rossi",
          providerId: 13,
          providerName: "Rome Electric Services",
          userRating: 4,
          providerRating: 2,
          status: "Approved",
          isScheduled: true,
          scheduledFrom: "13-06-2025 14:00:00",
          scheduledTo: "13-06-2025 16:00:00",
          actualStart: "13-06-2025 14:10:00",
          actualEnd: "13-06-2025 15:50:00",
          location: "Rome, Italy",
          paymentMethod: "Credit Card",
          visitFee: 3,
          userServiceFee: 2,
          providerServiceFee: 45,
          userPayable: 234,
          totalAmount: 160,
          providerEarnings: 128,
          platformEarnings: 32,
          createdAt: "12-06-2025 10:45:00",
          updatedAt: "13-06-2025 15:50:00",
          userPhoneNumber: "+61 412 345 678",
          providerPhoneNumber: "+61 412 987 654",
          providerEmail: "cleaning.sydney@example.com.au",
          countryCode: "+39",
          countryName: "Italy",
          userEmail: "maria.rossi@example.com",
          category: "Electrical",
          progressTimestamps: {
            requested: "12-06-2025 10:45:00",
            accepted: "12-06-2025 12:30:00",
            arrived: "13-06-2025 13:55:00",
            started: "13-06-2025 14:10:00",
            completed: "13-06-2025 15:50:00",
          },
          jobDetails: {
            subCategory: "Appliance Installation",
            quantity: 1,
            amount: 10,
          },
        },
        {
          id: 50,
          customerId: 50,
          username: "min_jung",
          providerId: 50,
          providerName: "Seoul Electric Co.",
          userRating: 3,
          providerRating: 1,
          status: "Completed",
          paymentStatus: "Paid",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          holdStatus: "Yes",
          isScheduled: false,
          scheduledFrom: "30-06-2025 14:00:00",
          scheduledTo: "30-06-2025 16:00:00",
          actualStart: "30-06-2025 14:10:00",
          actualEnd: "30-06-2025 15:50:00",
          location: "Seoul, South Korea",
          paymentMethod: "Online Payment",
          category: "Electrical",
          visitFee: 1,
          userServiceFee: 6,
          providerServiceFee: 3,
          userPayable: 234,
          totalAmount: 210,
          providerEarnings: 168,
          platformEarnings: 42,
          createdAt: "29-06-2025 11:45:00",
          updatedAt: "30-06-2025 15:50:00",
          userPhoneNumber: "+49 151 12345678",
          providerPhoneNumber: "+49 151 87654321",
          providerEmail: "carpentry.berlin@example.de",
          countryCode: "+82",
          countryName: "South Korea",
          lastName: "Jung",
          userEmail: "min.jung@example.com",
          progressTimestamps: {
            requested: "29-06-2025 11:45:00",
            accepted: "29-06-2025 13:30:00",
            arrived: "30-06-2025 13:55:00",
            started: "30-06-2025 14:10:00",
            completed: "30-06-2025 15:50:00",
          },
          jobDetails: {
            subCategory: "Outlet Installation",
            quantity: 5,
            amount: 200,
          },
        },
        {
          id: 51,
          customerId: 51,
          username: "alex_smith",
          providerId: 51,
          providerName: "Berlin Tech Solutions",
          userRating: 0,
          providerRating: 5,
          status: "Completed",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          paymentStatus: "Unpaid",
          holdStatus: "No",
          isScheduled: false,
          scheduledFrom: "01-07-2025 10:00:00",
          scheduledTo: "01-07-2025 12:00:00",
          actualStart: "01-07-2025 10:05:00",
          actualEnd: "01-07-2025 11:45:00",
          location: "Berlin, Germany",
          paymentMethod: "Credit Card",
          visitFee: 34,
          userServiceFee: 24,
          providerServiceFee: 23,
          userPayable: 234,
          totalAmount: 230,
          providerEarnings: 184,
          platformEarnings: 46,
          createdAt: "30-06-2025 09:30:00",
          updatedAt: "01-07-2025 11:45:00",
          userPhoneNumber: "+33 6 12 34 56 78",
          providerPhoneNumber: "+33 6 87 65 43 21",
          providerEmail: "painting.paris@example.fr",
          countryCode: "+49",
          countryName: "Germany",
          lastName: "Smith",
          userEmail: "alex.smith@example.com",
          category: "IT Services",
          progressTimestamps: {
            requested: "30-06-2025 09:30:00",
            accepted: "30-06-2025 11:15:00",
            arrived: "01-07-2025 09:55:00",
            started: "01-07-2025 10:05:00",
            completed: "01-07-2025 11:45:00",
          },
          jobDetails: {
            subCategory: "Home Network Setup",
            fieldSubCategory: "Field Network Setup",
            quantity: 1,
            amount: 100,
            fieldQuantity: 300,
          },
        },
        {
          id: 52,
          customerId: 52,
          username: "maria_garcia",
          providerId: 52,
          providerName: "Madrid Cleaning Pros",
          userRating: 3,
          providerRating: 5,
          status: "Cancelled by user",
          isScheduled: true,
          scheduledFrom: "02-07-2025 13:00:00",
          scheduledTo: "02-07-2025 15:00:00",
          location: "Madrid, Spain",
          paymentMethod: "Online Payment",
          visitFee: 12,
          userServiceFee: 2,
          providerServiceFee: 123,
          userPayable: 213,
          totalAmount: 160,
          providerEarnings: 128,
          platformEarnings: 32,
          createdAt: "01-07-2025 10:20:00",
          updatedAt: "01-07-2025 18:45:00",
          userPhoneNumber: "+81 90-1234-5678",
          providerPhoneNumber: "+81 90-9876-5432",
          providerEmail: "appliance.tokyo@example.jp",
          countryCode: "+34",
          countryName: "Spain",
          lastName: "Garcia",
          category: "Cleaning",
          userEmail: "maria.garcia@example.com",
          cancellationReason: "Customer is not at the location",
          cancelledBy: "user",
          progressTimestamps: {
            requested: "01-07-2025 10:20:00",
            cancelled: "01-07-2025 18:45:00",
          },
          jobDetails: {
            subCategory: "Deep Cleaning",
            quantity: 1,
            amount: 500,
          },
        },
        {
          id: 53,
          customerId: 53,
          username: "john_doe",
          providerId: 53,
          providerName: "London Handyman",
          userRating: 2,
          providerRating: 4,
          status: "Completed",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          paymentStatus: "Unpaid",
          holdStatus: "Yes",
          scheduledFrom: "03-07-2025 09:00:00",
          scheduledTo: "03-07-2025 11:00:00",
          actualStart: "03-07-2025 09:10:00",
          actualEnd: "03-07-2025 10:40:00",
          location: "London, UK",
          paymentMethod: "Cash",
          isScheduled: true,
          visitFee: 3,
          userServiceFee: 2,
          providerServiceFee: 234,
          userPayable: 32,
          totalAmount: 180,
          providerEarnings: 144,
          platformEarnings: 36,
          createdAt: "02-07-2025 08:15:00",
          updatedAt: "03-07-2025 10:40:00",
          userPhoneNumber: "+91 98765 43210",
          providerPhoneNumber: "+91 98765 12345",
          providerEmail: "ac.repair.mumbai@example.in",
          countryCode: "+44",
          countryName: "United Kingdom",
          lastName: "Doe",
          userEmail: "john.doe@example.com",
          category: "Handyman",
          progressTimestamps: {
            requested: "02-07-2025 08:15:00",
            accepted: "02-07-2025 10:00:00",
            arrived: "03-07-2025 08:55:00",
            started: "03-07-2025 09:10:00",
            completed: "03-07-2025 10:40:00",
          },
          jobDetails: {
            subCategory: "Furniture Assembly",
            quantity: 3,
            amount: 400,
          },
        },
        {
          id: 54,
          customerId: 54,
          username: "lucia_rossi",
          providerId: 54,
          providerName: "Rome Plumbing",
          userRating: 2,
          providerRating: 4,
          status: "Expired",
          isScheduled: true,
          scheduledFrom: "04-07-2025 14:30:00",
          scheduledTo: "04-07-2025 16:30:00",
          location: "Rome, Italy",
          paymentMethod: "Credit Card",
          visitFee: 2,
          userServiceFee: 23,
          providerServiceFee: 23,
          userPayable: 234,
          totalAmount: 190,
          providerEarnings: 152,
          platformEarnings: 38,
          createdAt: "03-07-2025 12:45:00",
          updatedAt: "04-07-2025 17:00:00",
          userPhoneNumber: "+1 (416) 555-1234",
          providerPhoneNumber: "+1 (416) 555-5678",
          providerEmail: "moving.toronto@example.ca",
          countryCode: "+39",
          countryName: "Italy",
          lastName: "Rossi",
          category: "Plumbing",
          userEmail: "lucia.rossi@example.com",
          jobDetails: {
            subCategory: "Pipe Repair",
            quantity: 1,
            amount: 300,
          },
        },
        {
          id: 55,
          customerId: 55,
          username: "pierre_dupont",
          providerId: 55,
          providerName: "Paris Electricians",
          userRating: 3,
          providerRating: 5,
          status: "Completed",
          paymentStatus: "Paid",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          holdStatus: "Yes",
          isScheduled: false,
          scheduledFrom: "05-07-2025 08:30:00",
          scheduledTo: "05-07-2025 10:30:00",
          actualStart: "05-07-2025 08:35:00",
          actualEnd: "05-07-2025 10:15:00",
          location: "Paris, France",
          paymentMethod: "Online Payment",
          visitFee: 2,
          userServiceFee: 4,
          providerServiceFee: 6,
          userPayable: 654,
          totalAmount: 220,
          providerEarnings: 176,
          platformEarnings: 44,
          createdAt: "04-07-2025 10:10:00",
          updatedAt: "05-07-2025 10:15:00",
          userPhoneNumber: "+34 612 34 56 78",
          providerPhoneNumber: "+34 612 98 76 54",
          providerEmail: "gardening.madrid@example.es",
          countryCode: "+33",
          countryName: "France",
          lastName: "Dupont",
          userEmail: "pierre.dupont@example.com",
          category: "Electrical",
          progressTimestamps: {
            requested: "04-07-2025 10:10:00",
            accepted: "04-07-2025 11:55:00",
            arrived: "05-07-2025 08:25:00",
            started: "05-07-2025 08:35:00",
            completed: "05-07-2025 10:15:00",
          },
          jobDetails: {
            subCategory: "Light Fixture Installation",
            quantity: 4,
            amount: 800,
          },
        },
        {
          id: 56,
          customerId: 56,
          username: "olga_ivanova",
          providerId: 56,
          providerName: "Moscow HVAC Specialists",
          userRating: 3,
          providerRating: 5,
          status: "Completed",
          paymentStatus: "Paid",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          holdStatus: "Yes",
          isScheduled: false,
          scheduledFrom: "06-07-2025 11:00:00",
          scheduledTo: "06-07-2025 13:00:00",
          actualStart: "06-07-2025 11:05:00",
          actualEnd: "06-07-2025 12:40:00",
          location: "Moscow, Russia",
          paymentMethod: "Cash",
          visitFee: 8,
          userServiceFee: 7,
          providerServiceFee: 76,
          userPayable: 534,
          totalAmount: 240,
          providerEarnings: 192,
          platformEarnings: 48,
          createdAt: "05-07-2025 09:20:00",
          updatedAt: "06-07-2025 12:40:00",
          userPhoneNumber: "+39 345 678 9012",
          providerPhoneNumber: "+39 345 123 4567",
          providerEmail: "cleaning.rome@example.it",
          countryCode: "+7",
          countryName: "Russia",
          lastName: "Ivanova",
          userEmail: "olga.ivanova@example.com",
          category: "HVAC",
          progressTimestamps: {
            requested: "05-07-2025 09:20:00",
            accepted: "05-07-2025 11:05:00",
            arrived: "06-07-2025 10:55:00",
            started: "06-07-2025 11:05:00",
            completed: "06-07-2025 12:40:00",
          },
          jobDetails: {
            subCategory: "AC Unit Repair",
            quantity: 1,
            amount: 1000,
          },
        },
        {
          id: 57,
          customerId: 57,
          username: "ahmed_khalid",
          providerId: 57,
          providerName: "Dubai Smart Home Tech",
          status: "Cancelled by service provider",
          isScheduled: true,
          scheduledFrom: "07-07-2025 15:30:00",
          scheduledTo: "07-07-2025 17:30:00",
          location: "Dubai, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "06-07-2025 13:45:00",
          updatedAt: "06-07-2025 20:10:00",
          userPhoneNumber: "+55 11 98765-4321",
          providerPhoneNumber: "+55 11 98765-1234",
          providerEmail: "electrician.sao.paulo@example.com.br",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Khalid",
          userEmail: "ahmed.khalid@example.com",
          cancellationReason: "user is not it the location",
          cancelledBy: "provider",
          category: "Smart Home",
          progressTimestamps: {
            requested: "06-07-2025 13:45:00",
            cancelled: "06-07-2025 20:10:00",
          },
          jobDetails: {
            subCategory: "Security System Installation",
            quantity: 1,
            amount: 70,
          },
        },
        {
          id: 58,
          customerId: 58,
          username: "sarah_johnson",
          providerId: 58,
          providerName: "New York Paint Pros",
          userRating: 3,
          providerRating: 2,
          status: "Expired",
          isScheduled: false,
          scheduledFrom: "08-07-2025 09:00:00",
          scheduledTo: "08-07-2025 11:00:00",
          actualStart: "08-07-2025 09:10:00",
          actualEnd: "08-07-2025 10:30:00",
          location: "New York, USA",
          paymentMethod: "Credit Card",
          visitFee: 6,
          userServiceFee: 8,
          providerServiceFee: 56,
          userPayable: 567,
          totalAmount: 250,
          providerEarnings: 200,
          platformEarnings: 50,
          createdAt: "07-07-2025 08:30:00",
          updatedAt: "08-07-2025 10:30:00",
          userPhoneNumber: "+31 6 12345678",
          providerPhoneNumber: "+31 6 98765432",
          providerEmail: "plumbing.amsterdam@example.nl",
          countryCode: "+1",
          countryName: "USA",
          lastName: "Johnson",
          userEmail: "sarah.johnson@example.com",
          category: "Painting",
          progressTimestamps: {
            requested: "07-07-2025 08:30:00",
            accepted: "07-07-2025 10:15:00",
            arrived: "08-07-2025 08:55:00",
            started: "08-07-2025 09:10:00",
            completed: "08-07-2025 10:30:00",
          },
          jobDetails: {
            subCategory: "Interior Walls",
            quantity: 2,
            amount: 50,
          },
        },
        {
          id: 59,
          customerId: 59,
          username: "li_wei",
          providerId: 59,
          providerName: "Beijing Appliance Repair",
          status: "Completed",
          paymentStatus: "Unpaid",
          failedPayoutReason:
            "Funds can't be sent to accounts located in GB when the account is under the `full` service agreement. To learn more, see https://stripe.com/docs/connect/service-agreement-types.",
          holdStatus: "Yes",
          isScheduled: false,
          scheduledFrom: "09-07-2025 13:00:00",
          scheduledTo: "09-07-2025 15:00:00",
          actualStart: "09-07-2025 13:05:00",
          actualEnd: "09-07-2025 14:20:00",
          location: "Beijing, China",
          paymentMethod: "Cash",
          visitFee: 34,
          userServiceFee: 3,
          providerServiceFee: 34,
          userPayable: 345,
          totalAmount: 150,
          providerEarnings: 120,
          platformEarnings: 30,
          createdAt: "08-07-2025 11:10:00",
          updatedAt: "09-07-2025 14:20:00",
          userPhoneNumber: "+46 70 123 45 67",
          providerPhoneNumber: "+46 70 987 65 43",
          providerEmail: "furniture.assembly@example.se",
          countryCode: "+86",
          countryName: "China",
          lastName: "Wei",
          userEmail: "li.wei@example.com",
          category: "Appliance Repair",
          progressTimestamps: {
            requested: "08-07-2025 11:10:00",
            accepted: "08-07-2025 12:55:00",
            arrived: "09-07-2025 12:55:00",
            started: "09-07-2025 13:05:00",
            completed: "09-07-2025 14:20:00",
          },
          jobDetails: {
            subCategory: "Refrigerator",
            quantity: 1,
            amount: 100,
          },
        },
        {
          id: 60,
          customerId: 60,
          username: "yuki_tanaka",
          providerId: 60,
          providerName: "Tokyo Cleaning Services",
          userRating: 2,
          providerRating: 4,
          status: "Expired",
          isScheduled: false,
          scheduledFrom: "10-07-2025 10:30:00",
          scheduledTo: "10-07-2025 12:30:00",
          location: "Tokyo, Japan",
          paymentMethod: "Online Payment",
          visitFee: 4,
          userServiceFee: 7,
          providerServiceFee: 3,
          userPayable: 345,
          totalAmount: 200,
          providerEarnings: 160,
          platformEarnings: 40,
          progressTimestamps: {
            requested: "09-07-2025 09:40:00",
          },
          createdAt: "09-07-2025 09:40:00",
          updatedAt: "10-07-2025 13:00:00",
          userPhoneNumber: "+852 5123 4567",
          providerPhoneNumber: "+852 5987 6543",
          providerEmail: "computer.repair@example.hk",
          countryCode: "+81",
          countryName: "Japan",
          lastName: "Tanaka",
          userEmail: "yuki.tanaka@example.com",
          category: "Cleaning",
          jobDetails: {
            subCategory: "Office Cleaning",
            quantity: 1,
            amount: 900,
          },
        },
        {
          id: 61,
          customerId: 61,
          username: "Mohammed",
          providerId: 61,
          providerName: "Ali",
          userRating: 2,
          providerRating: 3,
          status: "Cancelled by user",
          isScheduled: false,
          scheduledFrom: "08-07-2025 10:00:00",
          scheduledTo: "08-07-2025 12:00:00",
          location: "Dubai Marina, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "07-07-2025 09:30:00",
          updatedAt: "07-07-2025 14:45:00",
          userPhoneNumber: "+971 50 123 4567",
          providerPhoneNumber: "+971 50 987 6543",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Ali",
          userEmail: "mohammed.ali@example.com",
          cancellationReason: "Found a cheaper service provider",
          cancelledBy: "user",
          category: "Smart Home",
          progressTimestamps: {
            requested: "07-07-2025 09:30:00",
            cancelled: "07-07-2025 14:45:00",
          },
          jobDetails: {
            subCategory: "Home Lighting Installation",
            fieldSubCategory: "Field Lighting Installation",
            quantity: 1,
            amount: 100,
            fieldQuantity: 300,
          },
        },
        {
          id: 62,
          customerId: 62,
          username: "fatima",
          providerId: 62,
          providerName: "Yellda",
          status: "Cancelled by service provider",
          isScheduled: false,
          scheduledFrom: "08-07-2025 14:00:00",
          scheduledTo: "08-07-2025 16:00:00",
          location: "Downtown Dubai, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "07-07-2025 11:15:00",
          updatedAt: "07-07-2025 18:30:00",
          userPhoneNumber: "+971 55 111 2222",
          providerPhoneNumber: "+971 55 999 8888",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Ahmed",
          userEmail: "fatima.ahmed@example.com",
          cancellationReason: "customer is not at the location",
          cancelledBy: "provider",
          category: "Smart Home",
          progressTimestamps: {
            requested: "07-07-2025 11:15:00",
            cancelled: "07-07-2025 18:30:00",
          },
          jobDetails: {
            subCategory: "Smart Lock Installation",
            quantity: 1,
            amount: 70,
          },
        },
        {
          id: 63,
          customerId: 63,
          username: "Omir",
          providerId: 63,
          providerName: "Ahmad",
          uservatar: "/images/userphoto1.png",
          providerAvatar: "/images/providerphoto1.png",
          userRating: 4,
          providerRating: 1,
          status: "Cancelled by service provider",
          isScheduled: false,
          scheduledFrom: "09-07-2025 09:00:00",
          scheduledTo: "09-07-2025 11:00:00",
          location: "Jumeirah, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "08-07-2025 10:45:00",
          updatedAt: "08-07-2025 17:20:00",
          userPhoneNumber: "+971 52 333 4444",
          providerPhoneNumber: "+971 52 777 6666",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Omar",
          userEmail: "ali.omar@example.com",
          cancellationReason: "customer ask to cancel",
          cancelledBy: "provider",
          category: "Smart Home",
          progressTimestamps: {
            requested: "08-07-2025 10:45:00",
            cancelled: "08-07-2025 17:20:00",
          },
          jobDetails: {
            subCategory: "Home Automation Setup",
            quantity: 1,
            amount: 70,
          },
          chatMessages: [
            {
              id: 1,
              sender: "user",
              text: "Hi there, I need help with my electrical wiring",
            },
            {
              id: 2,
              sender: "provider",
              text: "Hello! I can help with that. What exactly is the issue?",
            },
            {
              id: 3,
              sender: "user",
              text: "The lights in my living room keep flickering",
            },
            {
              id: 4,
              sender: "provider",
              text: "OK Can you explian it well",
            },
            {
              id: 5,
              sender: "user",
              text: "Would tomorrow at 2pm work for you?",
            },
            {
              id: 6,
              sender: "provider",
              text: "Yes, that works for me. I'll see you then.",
            },
            {
              id: 7,
              sender: "user",
              text: "Great, thanks! The address is 123 Main St.",
            },
            {
              id: 8,
              sender: "provider",
              text: "Got it. I'll bring all the necessary tools.",
            },
            {
              id: 9,
              sender: "user",
              text: "Perfect. Do I need to prepare anything?",
            },
            {
              id: 10,
              sender: "provider",
              text: "Just make sure the circuit breaker is accessible.",
            },
            {
              id: 11,
              sender: "user",
              text: "Will do. See you tomorrow!",
            },
            {
              id: 12,
              sender: "provider",
              text: "Looking forward to it. Have a good day!",
            },
          ],
        },
        {
          id: 64,
          customerId: 64,
          username: "khalid",
          providerId: 64,
          providerName: "Nasir",
          status: "Cancelled by user",
          isScheduled: false,
          scheduledFrom: "09-07-2025 14:00:00",
          scheduledTo: "09-07-2025 16:00:00",
          location: "Al Barsha, UAE",
          paymentMethod: "Cash",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "08-07-2025 13:20:00",
          updatedAt: "08-07-2025 19:45:00",
          userPhoneNumber: "+971 56 555 6666",
          providerPhoneNumber: "+971 56 444 3333",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Khalid",
          userEmail: "sara.khalid@example.com",
          cancellationReason: "Moving to a new apartment",
          cancelledBy: "user",
          category: "Smart Home",
          progressTimestamps: {
            requested: "08-07-2025 13:20:00",
            cancelled: "08-07-2025 19:45:00",
          },
          jobDetails: {
            subCategory: "Security Camera Installation",
            quantity: 2,
            amount: 140,
          },
        },
        {
          id: 65,
          customerId: 65,
          username: "Youssef",
          providerId: 65,
          providerName: "Bellal",
          userRating: 5,
          providerRating: 1,
          status: "Cancelled by service provider",
          isScheduled: false,
          scheduledFrom: "10-07-2025 10:30:00",
          scheduledTo: "10-07-2025 12:30:00",
          location: "Business Bay, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "09-07-2025 09:15:00",
          updatedAt: "09-07-2025 16:40:00",
          userPhoneNumber: "+971 58 777 8888",
          providerPhoneNumber: "+971 58 222 1111",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Youssef",
          userEmail: "omar.youssef@example.com",
          cancellationReason: "customer is not at the location",
          cancelledBy: "provider",
          category: "Smart Home",
          progressTimestamps: {
            requested: "09-07-2025 09:15:00",
            cancelled: "09-07-2025 16:40:00",
          },
          jobDetails: {
            subCategory: "Voice Control Setup",
            quantity: 1,
            amount: 70,
          },
        },
        {
          id: 66,
          customerId: 66,
          username: "Laila",
          providerId: 66,
          providerName: "Bahar",
          userRating: 2,
          providerRating: 4,
          status: "Cancelled by user",
          isScheduled: false,
          scheduledFrom: "10-07-2025 15:00:00",
          scheduledTo: "10-07-2025 17:00:00",
          location: "Deira, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "09-07-2025 11:30:00",
          updatedAt: "09-07-2025 20:15:00",
          userPhoneNumber: "+971 54 999 0000",
          providerPhoneNumber: "+971 54 111 2222",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Mahmoud",
          userEmail: "laila.mahmoud@example.com",
          cancellationReason: "Service no longer needed",
          cancelledBy: "user",
          category: "Smart Home",
          progressTimestamps: {
            requested: "09-07-2025 11:30:00",
            cancelled: "09-07-2025 20:15:00",
          },
          jobDetails: {
            subCategory: "Smart Thermostat Installation",
            quantity: 1,
            amount: 70,
          },
        },
        {
          id: 67,
          customerId: 67,
          username: "Abrahim",
          providerId: 67,
          providerName: "Mahdi",
          userRating: 2,
          providerRating: 5,
          status: "Cancelled by service provider",
          isScheduled: false,
          scheduledFrom: "11-07-2025 09:30:00",
          scheduledTo: "11-07-2025 11:30:00",
          location: "Al Quoz, UAE",
          paymentMethod: "Cash",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "10-07-2025 08:45:00",
          updatedAt: "10-07-2025 15:10:00",
          userPhoneNumber: "+971 50 444 5555",
          providerPhoneNumber: "+971 50 666 7777",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Ibrahim",
          userEmail: "youssef.ibrahim@example.com",
          cancellationReason: "customer ask to cancel",
          cancelledBy: "provider",
          category: "Smart Home",
          progressTimestamps: {
            requested: "10-07-2025 08:45:00",
            cancelled: "10-07-2025 15:10:00",
          },
          jobDetails: {
            subCategory: "Smart Blinds Installation",
            quantity: 3,
            amount: 210,
          },
        },
        {
          id: 68,
          customerId: 68,
          username: "Noor",
          providerId: 68,
          providerName: "Hasoin",
          userRating: 2,
          providerRating: 4,
          status: "Cancelled by user",
          isScheduled: false,
          uservatar: "/images/userphoto1.png",
          providerAvatar: "/images/providerphoto1.png",
          scheduledFrom: "11-07-2025 14:00:00",
          scheduledTo: "11-07-2025 16:00:00",
          location: "Jebel Ali, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "10-07-2025 10:20:00",
          updatedAt: "10-07-2025 18:35:00",
          userPhoneNumber: "+971 55 888 9999",
          providerPhoneNumber: "+971 55 000 1111",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Hassan",
          userEmail: "noor.hassan@example.com",
          cancellationReason: "Going on vacation",
          cancelledBy: "user",
          category: "Smart Home",
          progressTimestamps: {
            requested: "10-07-2025 10:20:00",
            cancelled: "10-07-2025 18:35:00",
          },
          jobDetails: {
            subCategory: "Smart Doorbell Installation",
            quantity: 1,
            amount: 70,
          },
          chatMessages: [
            {
              id: 1,
              sender: "user",
              text: "Hi there, I need help with my electrical wiring",
            },
            {
              id: 2,
              sender: "provider",
              text: "Hello! I can help with that. What exactly is the issue?",
            },
            {
              id: 3,
              sender: "user",
              text: "The lights in my living room keep flickering",
            },
            {
              id: 4,
              sender: "provider",
              text: "OK Can you explian it well",
            },
            {
              id: 5,
              sender: "user",
              text: "Would tomorrow at 2pm work for you?",
            },
            {
              id: 6,
              sender: "provider",
              text: "Yes, that works for me. I'll see you then.",
            },
            {
              id: 7,
              sender: "user",
              text: "Great, thanks! The address is 123 Main St.",
            },
            {
              id: 8,
              sender: "provider",
              text: "Got it. I'll bring all the necessary tools.",
            },
            {
              id: 9,
              sender: "user",
              text: "Perfect. Do I need to prepare anything?",
            },
            {
              id: 10,
              sender: "provider",
              text: "Just make sure the circuit breaker is accessible.",
            },
            {
              id: 11,
              sender: "user",
              text: "Will do. See you tomorrow!",
            },
            {
              id: 12,
              sender: "provider",
              text: "Looking forward to it. Have a good day!",
            },
          ],
        },
        {
          id: 69,
          customerId: 69,
          username: "Farid",
          providerId: 69,
          providerName: "Darya",
          uservatar: "/images/userphoto1.png",
          providerAvatar: "/images/providerphoto1.png",
          userRating: 4,
          providerRating: 5,
          status: "Cancelled by service provider",
          isScheduled: false,
          scheduledFrom: "12-07-2025 10:00:00",
          scheduledTo: "12-07-2025 12:00:00",
          location: "Al Nahda, UAE",
          paymentMethod: "Online Payment",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "11-07-2025 09:10:00",
          updatedAt: "11-07-2025 14:25:00",
          userPhoneNumber: "+971 52 222 3333",
          providerPhoneNumber: "+971 52 444 5555",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Farid",
          userEmail: "karim.farid@example.com",
          cancellationReason: "customer is not at the location",
          cancelledBy: "provider",
          category: "Smart Home",
          progressTimestamps: {
            requested: "11-07-2025 09:10:00",
            cancelled: "11-07-2025 14:25:00",
          },
          jobDetails: {
            subCategory: "Smart Hub Installation",
            quantity: 1,
            amount: 70,
          },
        },
        {
          id: 70,
          customerId: 70,
          username: "Saeed",
          providerId: 70,
          providerName: "Yassa",
          userRating: 3,
          providerRating: 1,
          status: "Cancelled by user",
          uservatar: "/images/userphoto1.png",
          providerAvatar: "/images/providerphoto1.png",
          scheduledFrom: "12-07-2025 15:00:00",
          scheduledTo: "12-07-2025 17:00:00",
          location: "Mirdif, UAE",
          paymentMethod: "Cash",
          visitFee: 7,
          userServiceFee: 4,
          providerServiceFee: 4,
          userPayable: 456,
          totalAmount: 280,
          providerEarnings: 224,
          platformEarnings: 56,
          createdAt: "11-07-2025 11:40:00",
          updatedAt: "11-07-2025 19:55:00",
          userPhoneNumber: "+971 56 666 7777",
          providerPhoneNumber: "+971 56 888 9999",
          providerEmail: "smarthome.dubai@example.com",
          countryCode: "+971",
          countryName: "UAE",
          lastName: "Saeed",
          userEmail: "amira.saeed@example.com",
          cancellationReason: "Decided to do it myself",
          cancelledBy: "user",
          category: "Smart Home",
          progressTimestamps: {
            requested: "11-07-2025 11:40:00",
            cancelled: "11-07-2025 19:55:00",
          },
          jobDetails: {
            subCategory: "Smart Plug Installation",
            quantity: 4,
            amount: 280,
          },
          chatMessages: [
            {
              id: 1,
              sender: "user",
              text: "Hi there, I need help with my electrical wiring",
            },
            {
              id: 2,
              sender: "provider",
              text: "Hello! I can help with that. What exactly is the issue?",
            },
            {
              id: 3,
              sender: "user",
              text: "The lights in my living room keep flickering",
            },
            {
              id: 4,
              sender: "provider",
              text: "OK Can you explian it well",
            },
            {
              id: 5,
              sender: "user",
              text: "Would tomorrow at 2pm work for you?",
            },
            {
              id: 6,
              sender: "provider",
              text: "Yes, that works for me. I'll see you then.",
            },
            {
              id: 7,
              sender: "user",
              text: "Great, thanks! The address is 123 Main St.",
            },
            {
              id: 8,
              sender: "provider",
              text: "Got it. I'll bring all the necessary tools.",
            },
            {
              id: 9,
              sender: "user",
              text: "Perfect. Do I need to prepare anything?",
            },
            {
              id: 10,
              sender: "provider",
              text: "Just make sure the circuit breaker is accessible.",
            },
            {
              id: 11,
              sender: "user",
              text: "Will do. See you tomorrow!",
            },
            {
              id: 12,
              sender: "provider",
              text: "Looking forward to it. Have a good day!",
            },
          ],
        },
      ],
      currentPage: 1,
      bookingsPerPage: 10,
      searchTerm: "",
      statusFilter: null,

      createBooking: (booking) => {
        const now = new Date().toISOString();
        const newBooking: Booking = {
          ...booking,
          id: Math.max(0, ...get().bookings.map((b) => b.id)) + 1,
          createdAt: now,
          updatedAt: now,
          status: "Requested",
          progressTimestamps: {
            requested: now,
          },
        };
        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));
      },

      updateBooking: (id, updates) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id
              ? {
                  ...booking,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : booking
          ),
        }));
      },

      deleteBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id),
        }));
      },

      cancelBooking: (id, reason, initiator) => {
        const now = new Date().toISOString();
        const status =
          initiator === "user"
            ? "Cancelled by user"
            : "Cancelled by service provider";

        const booking = get().getBooking(id);
        get().updateBooking(id, {
          status,
          cancellationReason: reason,
          cancelledBy: initiator,
          progressTimestamps: {
            ...booking?.progressTimestamps,
            cancelled: now,
          },
        });
      },

      completeBooking: (id) => {
        const now = new Date().toISOString();
        const booking = get().getBooking(id);
        get().updateBooking(id, {
          status: "Completed",
          actualEnd: now,
          progressTimestamps: {
            ...booking?.progressTimestamps,
            completed: now,
          },
        });
      },

      acceptBooking: (id) => {
        const now = new Date().toISOString();
        const booking = get().getBooking(id);
        get().updateBooking(id, {
          status: "Accepted",
          progressTimestamps: {
            ...booking?.progressTimestamps,
            accepted: now,
          },
        });
      },

      startBooking: (id) => {
        const now = new Date().toISOString();
        const booking = get().getBooking(id);
        get().updateBooking(id, {
          status: "Started",
          actualStart: now,
          progressTimestamps: {
            ...booking?.progressTimestamps,
            started: now,
          },
        });
      },

      getBooking: (id) => {
        return get().bookings.find((booking) => booking.id === id);
      },

      getFilteredBookings: () => {
        const { bookings, searchTerm, statusFilter } = get();
        return bookings.filter((booking) => {
          const matchesSearch =
            !searchTerm ||
            booking.id.toString().includes(searchTerm) ||
            booking.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.providerName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.jobDetails?.subCategory || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.userEmail
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.userPhoneNumber.includes(searchTerm) ||
            booking.providerPhoneNumber.includes(searchTerm) ||
            booking.countryCode.includes(searchTerm) ||
            booking.countryName
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

          const matchesStatus =
            !statusFilter ||
            booking.status === statusFilter ||
            (statusFilter === "Cancelled" &&
              (booking.status === "Cancelled by user" ||
                booking.status === "Cancelled by service provider"));

          return matchesSearch && matchesStatus;
        });
      },

      getPaginatedBookings: () => {
        const { currentPage, bookingsPerPage } = get();
        const filteredBookings = get().getFilteredBookings();
        const startIndex = (currentPage - 1) * bookingsPerPage;
        return filteredBookings.slice(startIndex, startIndex + bookingsPerPage);
      },

      getTotalPages: () => {
        const { bookingsPerPage } = get();
        const filteredBookings = get().getFilteredBookings();
        return Math.ceil(filteredBookings.length / bookingsPerPage);
      },

      getAllBooking: () => {
        return get().bookings;
      },

      setStatusFilter: (status) => {
        set({ statusFilter: status, currentPage: 1 });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 });
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },
    }),
    {
      name: "booking-store",
      version: 2,
    }
  )
);
