import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  walletBalance: number;
  country: string;
  countryCode: string;
  phoneNumber: string;
  accountCreatedOn: string;
  banStatus: "Permit" | "Ban";
  profilePicture?: string;
  preferredCurrency: string;
}

interface UsersStore {
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
  toggleBanStatus: (id: number) => void;

  // Getters
  getPaginatedUsers: () => User[];
  getTotalPages: () => number;
  getFilteredUsers: () => User[];
  getAllUsers: () => User[];
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 1,
          firstName: "Ahmad",
          lastName: "Ahmadi",
          email: "s***********p@g*******m",
          walletBalance: 0,
          country: "United States",
          countryCode: "",
          phoneNumber: "+19*******8",
          accountCreatedOn: "08-06-2022 06:21:11",
          banStatus: "Permit",
          preferredCurrency: "USD",
        },

        {
          id: 2,
          firstName: "Ali",
          lastName: "Nexon",
          email: "r*g@*******m",
          walletBalance: 0,
          country: "Afghanistan",
          countryCode: "",

          phoneNumber: "+93******5",
          accountCreatedOn: "30-05-2022 13:35:48",
          banStatus: "Permit",
          preferredCurrency: "AF",
        },

        {
          id: 3,
          firstName: "John",
          lastName: "David",
          email: "j****v@g******m",
          walletBalance: 0,
          country: "India",
          countryCode: "",

          phoneNumber: "+912*******3",
          accountCreatedOn: "24-05-2022 11:57:11",
          banStatus: "Permit",
          preferredCurrency: "USD",
        },
        {
          id: 4,
          firstName: "Nazir",
          lastName: "Nasiry",
          email: "a*******8@g******m",
          walletBalance: 4144,
          country: "Afghanistan",
          countryCode: "",

          phoneNumber: "+93******7",
          accountCreatedOn: "23-05-2022 12:27:44",
          banStatus: "Permit",
          preferredCurrency: "AF",
        },
        {
          id: 5,
          firstName: "Bellal",
          lastName: "Bellaly",
          email: "r****h@r***********m",
          walletBalance: 0,
          country: "India",
          countryCode: "",

          phoneNumber: "+919*******7",
          accountCreatedOn: "19-05-2022 16:08:48",
          banStatus: "Permit",
          preferredCurrency: "USD",
        },
        {
          id: 6,
          firstName: "Marshal",
          lastName: "Ruban",
          email: "m***************l@g*",
          walletBalance: 87,
          country: "Pakistan",
          countryCode: "",

          phoneNumber: "+911*******0",
          accountCreatedOn: "19-05-2022 11:04:45",
          banStatus: "Permit",
          preferredCurrency: "USD",
        },
        {
          id: 7,
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice@example.com",
          walletBalance: 250,
          country: "Canada",
          countryCode: "",

          phoneNumber: "+1234567890",
          accountCreatedOn: "15-04-2022 09:30:22",
          banStatus: "Permit",
          preferredCurrency: "CAD",
        },
        {
          id: 8,
          firstName: "Lyla",
          lastName: "Khoramy",
          email: "bob@test.com",
          walletBalance: 1500,
          country: "Australia",
          countryCode: "",

          phoneNumber: "+61987654321",
          accountCreatedOn: "10-03-2022 14:15:33",
          banStatus: "Ban",
          preferredCurrency: "AUD",
        },
        {
          id: 9,
          firstName: "Yasir",
          lastName: "Amiri",
          email: "charlie@test.com",
          walletBalance: 750,
          country: "UK",
          countryCode: "",

          phoneNumber: "+44123456789",
          accountCreatedOn: "05-03-2022 10:20:15",
          banStatus: "Permit",
          preferredCurrency: "GBP",
        },
        {
          id: 10,
          firstName: "Diana",
          lastName: "Sarvary",
          email: "diana@example.com",
          walletBalance: 2000,
          country: "Germany",
          countryCode: "",

          phoneNumber: "+49123456789",
          accountCreatedOn: "01-03-2022 16:45:30",
          banStatus: "Permit",
          preferredCurrency: "EUR",
        },
        {
          id: 11,
          firstName: "Nowroz",
          lastName: "Biaty",
          email: "edward@test.com",
          walletBalance: 300,
          country: "France",
          countryCode: "",

          phoneNumber: "+33123456789",
          accountCreatedOn: "25-02-2022 09:15:45",
          banStatus: "Ban",
          preferredCurrency: "EUR",
        },
        {
          id: 12,
          firstName: "Bashir",
          lastName: "Iazdany",
          email: "fiona@example.com",
          walletBalance: 1200,
          country: "Italy",
          countryCode: "",

          phoneNumber: "+39123456789",
          accountCreatedOn: "20-02-2022 14:30:20",
          banStatus: "Permit",
          preferredCurrency: "EUR",
        },
        {
          id: 13,
          firstName: "Nasir",
          lastName: "Roshin",
          email: "george@test.com",
          walletBalance: 850,
          country: "Spain",
          countryCode: "",

          phoneNumber: "+34123456789",
          accountCreatedOn: "15-02-2022 11:25:10",
          banStatus: "Permit",
          preferredCurrency: "EUR",
        },
        {
          id: 14,
          firstName: "Helen",
          lastName: "Davis",
          email: "helen@example.com",
          walletBalance: 950,
          country: "Netherlands",
          countryCode: "",

          phoneNumber: "+31123456789",
          accountCreatedOn: "10-02-2022 13:40:55",
          banStatus: "Ban",
          preferredCurrency: "EUR",
        },
        {
          id: 15,
          firstName: "Pervis",
          lastName: "Servary",
          email: "ivan@test.com",
          walletBalance: 600,
          country: "Russia",
          countryCode: "",

          phoneNumber: "+7123456789",
          accountCreatedOn: "05-02-2022 08:50:35",
          banStatus: "Permit",
          preferredCurrency: "RUB",
        },
        {
          id: 16,
          firstName: "Julia",
          lastName: "Roberts",
          email: "julia@example.com",
          walletBalance: 1800,
          country: "Brazil",
          countryCode: "",

          phoneNumber: "+55123456789",
          accountCreatedOn: "01-02-2022 15:20:25",
          banStatus: "Permit",
          preferredCurrency: "BRL",
        },
        {
          id: 17,
          firstName: "Kamil",
          lastName: "Kamily",
          email: "kevin@test.com",
          walletBalance: 400,
          country: "Mexico",
          countryCode: "",

          phoneNumber: "+52123456789",
          accountCreatedOn: "28-01-2022 12:10:40",
          banStatus: "Ban",
          preferredCurrency: "MXN",
        },
        {
          id: 18,
          firstName: "Lara",
          lastName: "Wilson",
          email: "laura@example.com",
          walletBalance: 10,
          country: "Japan",
          countryCode: "",

          phoneNumber: "+81123456789",
          accountCreatedOn: "25-01-2022 17:35:15",
          banStatus: "Permit",
          preferredCurrency: "JPY",
        },
        {
          id: 19,
          firstName: "Naiem",
          lastName: "Ansary",
          email: "laura@example.com",
          walletBalance: 1100,
          country: "Afghanistan",
          countryCode: "",

          phoneNumber: "+93123456789",
          accountCreatedOn: "25-01-2022 17:35:15",
          banStatus: "Permit",
          preferredCurrency: "AF",
        },
        {
          id: 20,
          firstName: "Khalil",
          lastName: "Khalily",
          email: "kevin@test.com",
          walletBalance: 100,
          country: "Mexico",
          countryCode: "",

          phoneNumber: "+52123456789",
          accountCreatedOn: "28-01-2022 12:10:40",
          banStatus: "Ban",
          preferredCurrency: "MXN",
        },
        {
          id: 21,
          firstName: "Noor",
          lastName: "Noory",
          email: "kevin@test.com",
          walletBalance: 300,
          country: "Unites Stute",
          countryCode: "",

          phoneNumber: "+52123456789",
          accountCreatedOn: "28-01-2022 12:10:40",
          banStatus: "Ban",
          preferredCurrency: "USD",
        },
        {
          id: 22,
          firstName: "Yasa",
          lastName: "Insary",
          email: "kevin@test.com",
          walletBalance: 200,
          country: "Mexico",
          countryCode: "",

          phoneNumber: "+52123456789",
          accountCreatedOn: "28-01-2022 12:10:40",
          banStatus: "Ban",
          preferredCurrency: "MXN",
        },
        {
          id: 23,
          firstName: "Fatima",
          lastName: "Aliyar",
          email: "kevin@test.com",
          walletBalance: 40,
          country: "Egipt",
          countryCode: "",

          phoneNumber: "+52123456789",
          accountCreatedOn: "28-01-2022 12:10:40",
          banStatus: "Ban",
          preferredCurrency: "UR",
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
              user.walletBalance.toString().includes(searchLower)
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
            user.walletBalance.toString().includes(searchLower)
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
      name: "users-store",
      version: 2, // This will force a cache refresh
    }
  )
);
