import LoginForm from "../components/LoginForm";

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/8 p-5 text-white shadow-sm backdrop-blur-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-6 text-white/75">{desc}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/8 p-5 text-white backdrop-blur-sm">
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-2 text-sm text-white/75">{label}</div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] px-4 py-6 md:px-8 lg:px-12">
      <div className="mx-auto grid min-h-[92vh] max-w-[1400px] overflow-hidden rounded-[32px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#9d7751] via-[#b18962] to-[#d5b189] p-8 text-white md:p-12 lg:p-14">
          <div className="mb-14 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl backdrop-blur-sm">
              🏠
            </div>
            <div>
              <h2 className="text-3xl font-bold">60Home</h2>
              <p className="text-sm text-white/80">
                Smart Homestay Booking Platform
              </p>
            </div>
          </div>

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
            <span>🛡️</span>
            <span>Nền tảng đặt phòng dành cho trải nghiệm lưu trú hiện đại</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="mb-6 text-5xl font-extrabold leading-tight lg:text-6xl">
              Chào mừng quay lại
              <br />
              với 60Home
            </h1>

            <p className="mb-12 max-w-xl text-lg leading-8 text-white/85">
              Đăng nhập để quản lý booking, lịch sử đặt phòng, thông tin cá nhân
              và trải nghiệm hệ thống đặt phòng homestay chuyên nghiệp.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon="🧳"
              title="Đặt phòng nhanh"
              desc="Tìm phòng phù hợp chỉ trong vài phút."
            />
            <FeatureCard
              icon="📍"
              title="Vị trí thuận tiện"
              desc="Khám phá homestay gần biển, trung tâm, khu du lịch."
            />
            <FeatureCard
              icon="⭐"
              title="Trải nghiệm tốt"
              desc="Không gian ấm cúng, sạch sẽ và đáng nhớ."
            />
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <StatCard value="120+" label="Homestay đẹp" />
            <StatCard value="4.9/5" label="Đánh giá tốt" />
            <StatCard value="24/7" label="Hỗ trợ khách" />
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#f7f4ef] p-6 md:p-8 lg:p-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;