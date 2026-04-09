import HomeNavbar from "../components/HomeNavbar";
import HeroSection from "../components/HeroSection";
import SearchSection from "../components/SearchSection";
import RoomList from "../components/RoomList";
import HomeFooter from "../components/HomeFooter";

function HomePage() {
  const rooms = [
    {
      id: 1,
      name: "Phòng Deluxe Ban Công",
      type: "Phòng đôi",
      capacity: 2,
      price: "800.000đ / đêm",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      name: "Phòng Family View Vườn",
      type: "Phòng gia đình",
      capacity: 4,
      price: "1.200.000đ / đêm",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      name: "Phòng Standard",
      type: "Phòng đơn",
      capacity: 2,
      price: "650.000đ / đêm",
      image:
        "https://images.unsplash.com/photo-1505693539802-7c7b5e9b7b2b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      name: "Phòng VIP Hướng Hồ",
      type: "Phòng cao cấp",
      capacity: 3,
      price: "1.500.000đ / đêm",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <>
      <HomeNavbar />
      <HeroSection />
      <SearchSection />
      <RoomList rooms={rooms} />
      <HomeFooter />
    </>
  );
}

export default HomePage;
images.unsplash.com