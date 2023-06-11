import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSideBar = () => {
  const pathname = usePathname();
  const links = [
    {
      text: "Projects",
      url: "/admin",
    },
    {
      text: "Users",
      url: "/admin/users",
    },
    {
      text: "Home",
      url: "/",
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {links.map((link, idx) => (
        <Link
          href={link.url}
          className={`px-4 py-2 w-full group hover:bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-stretch justify-between ${
            pathname === link.url && "bg-gray-100"
          }`}
          key={idx}
        >
          {link.text}
        </Link>
      ))}
    </div>
  );
};

export default AdminSideBar;
