import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  accountCreatedOn: string;
  userStatus: "Active" | "Pending" | "Inactive";
  banStatus: "Permit" | "Ban";
  profilePicture?: string;
  preferredCurrency: string;
  userIdentity?: string;
  userExperience?: string;
}

interface ServiceProviderStore {
  users: User[];
  currentPage: number;
  usersPerPage: number;
  searchTerm: string;

  // Actions
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  getUser: (id: number) => User | undefined;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  toggleUserStatus: (id: number) => void;
  toggleBanStatus: (id: number) => void;

  // Getters
  getPaginatedUsers: () => User[];
  getTotalPages: () => number;
  getFilteredUsers: () => User[];
  getAllUsers: () => User[];
}

export const useServiceProviderStore = create<ServiceProviderStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 1,
          firstName: "Mohammad",
          lastName: "Khan",
          email: "m*****d@e*****e.com",
          country: "Afghanistan",
          countryCode: "",
          phoneNumber: "+93******1234",
          accountCreatedOn: "15-01-2023 09:12:33",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "AFN",
        },
        {
          id: 2,
          firstName: "Sarah",
          lastName: "Williams",
          email: "s****h@m*****k.com",
          country: "United States",
          countryCode: "",
          phoneNumber: "+1*******5678",
          accountCreatedOn: "22-02-2023 14:25:10",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "USD",
        },
        {
          id: 3,
          firstName: "Raj",
          lastName: "Patel",
          email: "r****l@g***l.com",
          country: "India",
          countryCode: "",
          phoneNumber: "+91******8910",
          accountCreatedOn: "05-03-2023 11:45:22",
          userStatus: "Pending",
          banStatus: "Permit",
          preferredCurrency: "INR",
        },
        {
          id: 4,
          firstName: "Amina",
          lastName: "Ali",
          email: "a****a@y***o.com",
          country: "Somalia",
          countryCode: "",
          phoneNumber: "+252******3456",
          accountCreatedOn: "18-03-2023 16:30:45",
          userStatus: "Active",
          banStatus: "Ban",
          preferredCurrency: "USD",
        },
        {
          id: 5,
          firstName: "James",
          lastName: "Smith",
          email: "j****s@h*****l.com",
          country: "United Kingdom",
          countryCode: "",
          phoneNumber: "+44******7890",
          accountCreatedOn: "30-03-2023 10:15:12",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "GBP",
        },
        {
          id: 6,
          firstName: "Fatima",
          lastName: "Mohammed",
          email: "f****a@o*****k.com",
          country: "Pakistan",
          countryCode: "",
          phoneNumber: "+92******2345",
          accountCreatedOn: "12-04-2023 13:20:30",
          userStatus: "Inactive",
          banStatus: "Permit",
          preferredCurrency: "PKR",
        },
        {
          id: 7,
          firstName: "Carlos",
          lastName: "Garcia",
          email: "c****s@y***o.com",
          country: "Mexico",
          countryCode: "",
          phoneNumber: "+52******6789",
          accountCreatedOn: "25-04-2023 08:45:55",
          userStatus: "Active",
          banStatus: "Ban",
          preferredCurrency: "MXN",
        },
        {
          id: 8,
          firstName: "Yuki",
          lastName: "Tanaka",
          email: "y****i@h*****u.com",
          country: "Japan",
          countryCode: "",
          phoneNumber: "+81******0123",
          accountCreatedOn: "03-05-2023 17:10:40",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "JPY",
        },
        {
          id: 9,
          firstName: "Olga",
          lastName: "Ivanova",
          email: "o****a@m***r.com",
          country: "Russia",
          countryCode: "",
          phoneNumber: "+7*******4567",
          accountCreatedOn: "15-05-2023 12:35:18",
          userStatus: "Pending",
          banStatus: "Permit",
          preferredCurrency: "RUB",
        },
        {
          id: 10,
          firstName: "Kwame",
          lastName: "Nkrumah",
          email: "k****e@g***l.com",
          country: "Ghana",
          countryCode: "",
          phoneNumber: "+233******8901",
          accountCreatedOn: "27-05-2023 09:50:27",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "GHS",
        },
        {
          id: 11,
          firstName: "Emma",
          lastName: "Müller",
          email: "e****a@w**e.com",
          country: "Germany",
          countryCode: "",
          phoneNumber: "+49******2345",
          accountCreatedOn: "08-06-2023 14:15:33",
          userStatus: "Active",
          banStatus: "Ban",
          preferredCurrency: "EUR",
        },
        {
          id: 12,
          firstName: "Luca",
          lastName: "Rossi",
          email: "l****a@l***o.com",
          country: "Italy",
          countryCode: "",
          phoneNumber: "+39******6789",
          accountCreatedOn: "20-06-2023 11:30:44",
          userStatus: "Inactive",
          banStatus: "Permit",
          preferredCurrency: "EUR",
        },
        // Continue with 12 more users...
        {
          id: 13,
          firstName: "Hassan",
          lastName: "Abdullah",
          email: "h****n@y***o.com",
          country: "Egypt",
          countryCode: "",
          phoneNumber: "+20******0123",
          accountCreatedOn: "02-07-2023 16:45:12",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "EGP",
        },
        {
          id: 14,
          firstName: "Sophie",
          lastName: "Martin",
          email: "s****e@o*****k.com",
          country: "France",
          countryCode: "",
          phoneNumber: "+33******4567",
          accountCreatedOn: "14-07-2023 10:20:30",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "EUR",
        },
        {
          id: 15,
          firstName: "Diego",
          lastName: "Silva",
          email: "d****o@h*****l.com",
          country: "Brazil",
          countryCode: "",
          phoneNumber: "+55******8901",
          accountCreatedOn: "26-07-2023 13:35:45",
          userStatus: "Pending",
          banStatus: "Permit",
          preferredCurrency: "BRL",
        },
        {
          id: 16,
          firstName: "Aisha",
          lastName: "Juma",
          email: "a****a@m***r.com",
          country: "Kenya",
          countryCode: "",
          phoneNumber: "+254******2345",
          accountCreatedOn: "07-08-2023 08:50:18",
          userStatus: "Active",
          banStatus: "Ban",
          preferredCurrency: "KES",
        },
        {
          id: 17,
          firstName: "Thomas",
          lastName: "Anderson",
          email: "t****s@e*****e.com",
          country: "Canada",
          countryCode: "",
          phoneNumber: "+1*******6789",
          accountCreatedOn: "19-08-2023 17:05:22",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "CAD",
        },
        {
          id: 18,
          firstName: "Mei",
          lastName: "Chen",
          email: "m****i@y***o.com",
          country: "China",
          countryCode: "",
          phoneNumber: "+86******0123",
          accountCreatedOn: "31-08-2023 12:30:40",
          userStatus: "Inactive",
          banStatus: "Permit",
          preferredCurrency: "CNY",
        },
        {
          id: 19,
          firstName: "Alejandro",
          lastName: "Gonzalez",
          email: "a****o@g***l.com",
          country: "Argentina",
          countryCode: "",
          phoneNumber: "+54******4567",
          accountCreatedOn: "12-09-2023 09:45:15",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "ARS",
        },
        {
          id: 20,
          firstName: "Nadia",
          lastName: "Kamal",
          email: "n****a@o*****k.com",
          country: "Jordan",
          countryCode: "",
          phoneNumber: "+962******8901",
          accountCreatedOn: "24-09-2023 15:00:33",
          userStatus: "Active",
          banStatus: "Ban",
          preferredCurrency: "JOD",
        },
        {
          id: 21,
          firstName: "Ethan",
          lastName: "Wilson",
          email: "e****n@h*****l.com",
          country: "Australia",
          countryCode: "",
          phoneNumber: "+61******2345",
          accountCreatedOn: "06-10-2023 10:15:48",
          userStatus: "Pending",
          banStatus: "Permit",
          preferredCurrency: "AUD",
        },
        {
          id: 22,
          firstName: "Zara",
          lastName: "Malik",
          email: "z****a@y***o.com",
          country: "United Arab Emirates",
          countryCode: "",
          phoneNumber: "+971******6789",
          accountCreatedOn: "18-10-2023 13:30:05",
          userStatus: "Active",
          banStatus: "Permit",
          preferredCurrency: "AED",
        },
        {
          id: 23,
          firstName: "Jakub",
          lastName: "Nowak",
          email: "j****b@m***r.com",
          country: "Poland",
          countryCode: "",
          phoneNumber: "+48******0123",
          accountCreatedOn: "30-10-2023 08:45:27",
          userStatus: "Active",
          banStatus: "Ban",
          preferredCurrency: "PLN",
        },
        {
          id: 24,
          firstName: "Lila",
          lastName: "Fernandez",
          email: "l****a@w**e.com",
          country: "Spain",
          countryCode: "",
          phoneNumber: "+34******4567",
          accountCreatedOn: "11-11-2023 16:00:50",
          userStatus: "Inactive",
          banStatus: "Permit",
          preferredCurrency: "EUR",
        },
      ],

      currentPage: 1,
      usersPerPage: 10,
      searchTerm: "",

      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: Math.max(...get().users.map((u) => u.id), 0) + 1,
        };
        set((state) => ({
          users: [...state.users, newUser],
        }));
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => {
          const newUsers = state.users.filter((user) => user.id !== id);
          const filteredUsers = newUsers.filter((user) => {
            if (!state.searchTerm) return true;
            const searchLower = state.searchTerm.toLowerCase();
            return (
              user.id.toString().includes(searchLower) ||
              user.firstName.toLowerCase().includes(searchLower) ||
              user.lastName.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower) ||
              user.country.toLowerCase().includes(searchLower) ||
              user.phoneNumber.toLowerCase().includes(searchLower) ||
              user.accountCreatedOn.toLowerCase().includes(searchLower) ||
              user.banStatus.toLowerCase().includes(searchLower) ||
              user.userStatus.toString().includes(searchLower)
            );
          });

          const totalPages = Math.ceil(
            filteredUsers.length / state.usersPerPage
          );
          const newCurrentPage =
            state.currentPage > totalPages
              ? Math.max(1, totalPages)
              : state.currentPage;

          return {
            users: newUsers,
            currentPage: newCurrentPage,
          };
        });
      },

      getUser: (id) => {
        return get().users.find((user) => user.id === id);
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 });
      },

      toggleUserStatus: (id) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  userStatus:
                    user.userStatus === "Active"
                      ? "Pending"
                      : user.userStatus === "Pending"
                      ? "Inactive"
                      : "Active",
                }
              : user
          ),
        }));
      },

      toggleBanStatus: (id) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  banStatus: user.banStatus === "Permit" ? "Ban" : "Permit",
                }
              : user
          ),
        }));
      },

      getAllUsers: () => {
        return get().users;
      },

      getFilteredUsers: () => {
        const { users, searchTerm } = get();
        if (!searchTerm) return users;

        return users.filter((user) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            user.id.toString().includes(searchLower) ||
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.country.toLowerCase().includes(searchLower) ||
            user.phoneNumber.toLowerCase().includes(searchLower) ||
            user.accountCreatedOn.toLowerCase().includes(searchLower) ||
            user.banStatus.toLowerCase().includes(searchLower) ||
            user.userStatus.toString().includes(searchLower)
          );
        });
      },

      getPaginatedUsers: () => {
        const { currentPage, usersPerPage } = get();
        const filteredUsers = get().getFilteredUsers();

        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        return filteredUsers.slice(startIndex, endIndex);
      },

      getTotalPages: () => {
        const { usersPerPage } = get();
        const filteredUsers = get().getFilteredUsers();
        return Math.ceil(filteredUsers.length / usersPerPage);
      },
    }),
    {
      name: "service-providers-store",
      version: 2, // This will force a cache refresh
    }
  )
);
