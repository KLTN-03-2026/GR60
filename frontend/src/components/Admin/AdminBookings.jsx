import React from 'react';
import MainLayout from '../Layout/MainLayout';
import AdminLayout from './AdminLayout';

const AdminBookings = () => {
  return (
    <MainLayout forceScrolled={true} requireAuth={true} hideFooter={true}>
      <AdminLayout>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1A251F] mb-6">Quản lý Booking</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500">Giao diện quản lý booking đang được xây dựng...</p>
          </div>
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBookings;
