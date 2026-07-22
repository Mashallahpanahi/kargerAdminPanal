import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SubCategory {
  id: number;
  subCategoryName: string;
  categoryName: string;
  status: "Active" | "Inactive";
  accountCreatedOn: string;
  description: string;
  image: string;
}

interface SubCategoryStore {
  subCategories: SubCategory[];
  currentPage: number;
  subCategoriesPerPage: number;
  searchTerm: string;

  // Actions
  addSubCategory: (subCategory: Omit<SubCategory, "id">) => void;
  updateSubCategory: (id: number, subCategory: Partial<SubCategory>) => void;
  deleteSubCategory: (id: number) => void;
  getSubCategory: (id: number) => SubCategory | undefined;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  toggleSubCategoryStatus: (id: number) => void;

  // Getters
  getPaginatedSubCategories: () => SubCategory[];
  getTotalPages: () => number;
  getFilteredSubCategories: () => SubCategory[];
}

export const useSubCategoryStore = create<SubCategoryStore>()(
  persist(
    (set, get) => ({
      subCategories: [
        {
          id: 133,
          subCategoryName: "Wedding Catering",
          categoryName: "Wedding planner",
          status: "Active",
          accountCreatedOn: "15-01-2024",
          description:
            "Professional catering services for weddings and special events",
          image: "/images/loginlogo.png",
        },
        {
          id: 132,
          subCategoryName: "Wedding Photography",
          categoryName: "Wedding planner",
          status: "Active",
          accountCreatedOn: "18-02-2024",
          description:
            "Professional catering services for weddings and special events",
          image: "/images/loginlogo.png",
        },
        {
          id: 131,
          subCategoryName: "Water Damage Repair",
          categoryName: "Water Mitigation",
          status: "Active",
          accountCreatedOn: "22-03-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 130,
          subCategoryName: "Water Inspection",
          categoryName: "Water Mitigation",
          status: "Inactive",
          accountCreatedOn: "05-04-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 129,
          subCategoryName: "Symbility Estimators",
          categoryName: "Estimators",
          status: "Active",
          accountCreatedOn: "10-05-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 128,
          subCategoryName: "Xactimate Estimators",
          categoryName: "Estimators",
          status: "Active",
          accountCreatedOn: "12-06-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 127,
          subCategoryName: "Emergency Medical",
          categoryName: "Emergency",
          status: "Active",
          accountCreatedOn: "20-07-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 126,
          subCategoryName: "Fire Department",
          categoryName: "Emergency",
          status: "Active",
          accountCreatedOn: "25-08-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 125,
          subCategoryName: "Home Cleaning",
          categoryName: "Home Services",
          status: "Active",
          accountCreatedOn: "03-09-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 124,
          subCategoryName: "Home Maintenance",
          categoryName: "Home Services",
          status: "Inactive",
          accountCreatedOn: "08-10-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 123,
          subCategoryName: "Construction Framing",
          categoryName: "Construction",
          status: "Active",
          accountCreatedOn: "14-11-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 122,
          subCategoryName: "Construction Roofing",
          categoryName: "Construction",
          status: "Active",
          accountCreatedOn: "19-12-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 121,
          subCategoryName: "Health Nutrition",
          categoryName: "Health Care",
          status: "Active",
          accountCreatedOn: "22-01-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 120,
          subCategoryName: "Health Therapy",
          categoryName: "Health Care",
          status: "Inactive",
          accountCreatedOn: "27-02-2024",
          description: "Professional catering",
          image: "/images/loginlogo.png",
        },
        {
          id: 119,
          subCategoryName: "Auto Repair",
          categoryName: "Automotive",
          status: "Active",
          accountCreatedOn: "03-03-2024",
          description: "Professional catering",
          image: "/images/loginlogo.png",
        },
        {
          id: 118,
          subCategoryName: "Auto Detailing",
          categoryName: "Automotive",
          status: "Active",
          accountCreatedOn: "09-04-2024",
          description: "Professional catering",
          image: "/images/loginlogo.png",
        },
        {
          id: 117,
          subCategoryName: "Education Tutoring",
          categoryName: "Education",
          status: "Active",
          accountCreatedOn: "15-05-2024",
          description: "Professional catering",
          image: "/images/loginlogo.png",
        },
        {
          id: 116,
          subCategoryName: "Education Consulting",
          categoryName: "Education",
          status: "Inactive",
          accountCreatedOn: "21-06-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 115,
          subCategoryName: "Wedding Music",
          categoryName: "Wedding planner",
          status: "Active",
          accountCreatedOn: "28-07-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 114,
          subCategoryName: "Wedding Venue",
          categoryName: "Wedding planner",
          status: "Active",
          accountCreatedOn: "02-08-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 113,
          subCategoryName: "Water Extraction",
          categoryName: "Water Mitigation",
          status: "Active",
          accountCreatedOn: "07-09-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 112,
          subCategoryName: "Water Prevention",
          categoryName: "Water Mitigation",
          status: "Inactive",
          accountCreatedOn: "12-10-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 111,
          subCategoryName: "RepairScope Estimators",
          categoryName: "Estimators",
          status: "Active",
          accountCreatedOn: "18-11-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 110,
          subCategoryName: "ClaimEstimate Estimators",
          categoryName: "Estimators",
          status: "Active",
          accountCreatedOn: "24-12-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 109,
          subCategoryName: "Emergency Police",
          categoryName: "Emergency",
          status: "Active",
          accountCreatedOn: "30-01-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 108,
          subCategoryName: "Emergency Security",
          categoryName: "Emergency",
          status: "Inactive",
          accountCreatedOn: "05-02-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 107,
          subCategoryName: "Home Renovation",
          categoryName: "Home Services",
          status: "Active",
          accountCreatedOn: "11-03-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 106,
          subCategoryName: "Home Inspection",
          categoryName: "Home Services",
          status: "Active",
          accountCreatedOn: "17-04-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 105,
          subCategoryName: "Construction Electrical",
          categoryName: "Construction",
          status: "Active",
          accountCreatedOn: "23-05-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
        {
          id: 104,
          subCategoryName: "Construction Plumbing",
          categoryName: "Construction",
          status: "Inactive",
          accountCreatedOn: "29-06-2024",
          description: "Professional catering services",
          image: "/images/loginlogo.png",
        },
      ],

      currentPage: 1,
      subCategoriesPerPage: 10,
      searchTerm: "",

      addSubCategory: (subCategory) => {
        const newSubCategory: SubCategory = {
          ...subCategory,
          id: Math.max(...get().subCategories.map((sc) => sc.id), 0) + 1,
          accountCreatedOn: new Date().toLocaleDateString("en-GB"), // DD-MM-YYYY format
        };
        set((state) => ({
          subCategories: [...state.subCategories, newSubCategory],
        }));
      },

      updateSubCategory: (id, updates) => {
        set((state) => ({
          subCategories: state.subCategories.map((subCategory) =>
            subCategory.id === id
              ? { ...subCategory, ...updates }
              : subCategory,
          ),
        }));
      },

      deleteSubCategory: (id) => {
        set((state) => {
          const newSubCategories = state.subCategories.filter(
            (subCategory) => subCategory.id !== id,
          );
          const filteredSubCategories = newSubCategories.filter(
            (subCategory) => {
              if (!state.searchTerm) return true;
              const searchLower = state.searchTerm.toLowerCase();
              return (
                subCategory.id.toString().includes(searchLower) ||
                subCategory.subCategoryName
                  .toLowerCase()
                  .includes(searchLower) ||
                subCategory.categoryName.toLowerCase().includes(searchLower) ||
                subCategory.accountCreatedOn
                  .toLowerCase()
                  .includes(searchLower) ||
                subCategory.status.toLowerCase().includes(searchLower)
              );
            },
          );

          const totalPages = Math.ceil(
            filteredSubCategories.length / state.subCategoriesPerPage,
          );
          const newCurrentPage =
            state.currentPage > totalPages
              ? Math.max(1, totalPages)
              : state.currentPage;

          return {
            subCategories: newSubCategories,
            currentPage: newCurrentPage,
          };
        });
      },

      getSubCategory: (id) => {
        return get().subCategories.find((subCategory) => subCategory.id === id);
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term, currentPage: 1 });
      },

      toggleSubCategoryStatus: (id) => {
        set((state) => ({
          subCategories: state.subCategories.map((subCategory) =>
            subCategory.id === id
              ? {
                  ...subCategory,
                  status:
                    subCategory.status === "Active" ? "Inactive" : "Active",
                }
              : subCategory,
          ),
        }));
      },

      getFilteredSubCategories: () => {
        const { subCategories, searchTerm } = get();
        if (!searchTerm) return subCategories;

        return subCategories.filter((subCategory) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            subCategory.id.toString().includes(searchLower) ||
            subCategory.subCategoryName.toLowerCase().includes(searchLower) ||
            subCategory.categoryName.toLowerCase().includes(searchLower) ||
            subCategory.accountCreatedOn.toLowerCase().includes(searchLower) ||
            subCategory.status.toLowerCase().includes(searchLower)
          );
        });
      },

      getPaginatedSubCategories: () => {
        const { currentPage, subCategoriesPerPage } = get();
        const filteredSubCategories = get().getFilteredSubCategories();

        const startIndex = (currentPage - 1) * subCategoriesPerPage;
        const endIndex = startIndex + subCategoriesPerPage;
        return filteredSubCategories.slice(startIndex, endIndex);
      },

      getTotalPages: () => {
        const { subCategoriesPerPage } = get();
        const filteredSubCategories = get().getFilteredSubCategories();
        return Math.ceil(filteredSubCategories.length / subCategoriesPerPage);
      },
    }),
    {
      name: "sub-categories-store",
      version: 1,
    },
  ),
);
