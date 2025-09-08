import { AdminAccessCheck } from '@/components/admin/AdminAccessCheck';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAccessCheck>
      {children}
    </AdminAccessCheck>
  );
}
