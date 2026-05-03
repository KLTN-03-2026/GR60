import React, { useState, useEffect } from 'react';
import MainLayout from '../Layout/MainLayout';
import { ShieldCheck, Heart, Leaf, Star, Mail, Phone, MapPin } from 'lucide-react';
import { apiGetHomeStayInfo } from '../../services/roomService';

const About = () => {
  const [homeInfo, setHomeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await apiGetHomeStayInfo();
        if (data) {
          setHomeInfo(data);
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin giới thiệu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <MainLayout forceScrolled={true}>
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-8 bg-gray-200 w-48 rounded"></div>
            </div>
        </div>
      </MainLayout>
    );
  }

  const info = homeInfo || {
    ten_Home: "60 Homes",
    mo_Ta: "Tìm thấy sự tĩnh lặng giữa thiên nhiên hùng vĩ và trải nghiệm dịch vụ nghỉ dưỡng cao cấp.",
    anh: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2000&auto=format&fit=crop",
    dia_Chi: "Việt Nam",
    sdt: "N/A",
    email_Home: "N/A"
  };

  return (
    <MainLayout forceScrolled={false} transparentHeader={true}>
      <div className="bg-[#FDFBF7]">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={info.anh} 
              alt={info.ten_Home} 
              className="w-full h-full object-cover brightness-75"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2000&auto=format&fit=crop";
              }}
            />
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight">{info.ten_Home}</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
               Nơi tinh hoa hội tụ - Trải nghiệm nghỉ dưỡng đẳng cấp và an yên.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-24 container mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="flex-1 space-y-8">
              <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary">Câu chuyện của chúng tôi</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-dark leading-tight">Chào mừng bạn đến với {info.ten_Home}</h3>
              <div className="text-gray-light text-lg leading-relaxed text-justify space-y-6 whitespace-pre-line">
                {info.mo_Ta}
              </div>
            </div>
            <div className="lg:w-1/3 space-y-8 lg:sticky lg:top-32">
              <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
                <h4 className="text-xl font-serif text-dark mb-8">Thông tin liên hệ</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-light">
                    <div className="w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-primary shrink-0">
                      <MapPin size={20} />
                    </div>
                    <span className="text-base font-medium">{info.dia_Chi}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-light">
                    <div className="w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-primary shrink-0">
                      <Phone size={20} />
                    </div>
                    <span className="text-base font-medium">{info.sdt}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-light">
                    <div className="w-10 h-10 bg-[#F9F7F2] rounded-full flex items-center justify-center text-primary shrink-0">
                      <Mail size={20} />
                    </div>
                    <span className="text-base font-medium break-all">{info.email_Home}</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark text-white p-10 rounded-[2rem] shadow-xl">
                 <p className="text-3xl font-serif mb-2">100%</p>
                 <p className="text-xs uppercase font-bold text-white/50 tracking-widest">Sự hài lòng từ khách hàng</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-dark text-white">
          <div className="container mx-auto px-6 md:px-10">
            <div className="text-center mb-20">
                <h2 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/50 mb-4">Giá trị cốt lõi</h2>
                <h3 className="text-4xl font-serif">Giá trị chúng tôi mang lại</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-xl font-serif">An tâm tuyệt đối</h4>
                <p className="text-white/60 text-sm leading-relaxed">Chúng tôi cam kết mang đến sự an toàn và riêng tư tối đa cho mọi khách hàng.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} />
                </div>
                <h4 className="text-xl font-serif">Phục vụ tận tâm</h4>
                <p className="text-white/60 text-sm leading-relaxed">Đội ngũ nhân viên chuyên nghiệp, luôn sẵn sàng hỗ trợ bạn 24/7 với nụ cười trên môi.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf size={32} />
                </div>
                <h4 className="text-xl font-serif">Gần gũi thiên nhiên</h4>
                <p className="text-white/60 text-sm leading-relaxed">Kiến trúc bền vững, hài hòa với cảnh quan tự nhiên xung quanh.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star size={32} />
                </div>
                <h4 className="text-xl font-serif">Đẳng cấp 5 sao</h4>
                <p className="text-white/60 text-sm leading-relaxed">Tiện nghi hiện đại và sang trọng, đáp ứng mọi nhu cầu nghỉ dưỡng của bạn.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#EFEBE4]">
            <div className="container mx-auto px-6 md:px-10 text-center">
                <h3 className="text-3xl md:text-4xl font-serif text-dark mb-8">Bắt đầu hành trình của bạn tại {info.ten_Home}</h3>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-12 py-5 bg-dark text-white font-bold uppercase tracking-widest text-xs hover:bg-[#333] transition-all shadow-xl"
                >
                    Đặt phòng ngay
                </button>
            </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
