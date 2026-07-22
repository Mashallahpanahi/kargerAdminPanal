import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";

const users = [
  {
    id: 1,
    email: "m*********i@g******m",
    role: "Sub admin",
  },
  {
    id: 2,
    email: "m**y@m*************m",
    role: "Location Manager",
  },
  {
    id: 3,
    email: "s****g@r**************m",
    role: "Sub admin",
  },
];

export function AdminUsersTable() {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="h-12 px-4 text-sm font-medium">ID</th>
              <th className="h-12 px-4 text-sm font-medium">EMAIL</th>
              <th className="h-12 px-4 text-sm font-medium">ADMIN ROLE</th>
              <th className="h-12 px-4 text-sm font-medium">EDIT</th>
              <th className="h-12 px-4 text-sm font-medium">DELETE</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4 align-middle">{user.id}</td>
                <td className="p-4 align-middle">{user.email}</td>
                <td className="p-4 align-middle">{user.role}</td>
                <td className="p-4 align-middle">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </td>
                <td className="p-4 align-middle">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
