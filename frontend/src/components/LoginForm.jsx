import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("2222@gmail.com");
  const [password, setPassword] = useState("123456");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="w-full max-w-[560px] rounded-[32px] bg-white p-8 shadow-[0_15px_50px_rgba(0,0,0,0.08)] md:p-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#9d7751]">
        Đăng nhập hệ thống
      </p>

      <h2 className="mb-4 text-5xl font-extrabold text-[#1f2a44]">Xin chào!</h2>

      <p className="mb-10 max-w-md text-base leading-7 text-slate-500">
        Đây là giao diện login theo phong cách dự án thực tế cho hệ thống đặt
        phòng homestay 60Home.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <div className="flex items-center rounded-2xl bg-[#eef3fb] px-4">
            <span className="mr-3 text-slate-400">✉️</span>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700">
              Mật khẩu
            </label>
            <a
              href="#"
              className="text-sm font-medium text-[#9d7751] hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          <div className="flex items-center rounded-2xl bg-[#eef3fb] px-4">
            <span className="mr-3 text-slate-400">🔒</span>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />
            <span className="ml-3 text-slate-400">👁️</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-3 text-sm text-slate-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#e8f8ee] px-4 py-2 text-sm font-medium text-[#2f9e62]">
            <span>🛡️</span>
            <span>Secure UI Demo</span>
          </div>
        </div>

        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#9d7751] text-lg font-semibold text-white transition hover:opacity-95"
        >
          <span>Đăng nhập</span>
          <span>→</span>
        </button>

        <div className="grid gap-4 rounded-[28px] bg-[#f8f5f0] p-5 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <h3 className="mb-2 text-base font-bold text-slate-700">
              Khách hàng mới?
            </h3>
            <p className="text-sm leading-6 text-slate-500">
              Tạo tài khoản để đặt phòng, lưu yêu thích và xem lịch sử booking.
            </p>
          </div>

          <button
            type="button"
            className="h-14 rounded-2xl border border-[#d8c2aa] bg-white px-5 font-semibold text-[#9d7751] transition hover:bg-[#fcfaf7]"
          >
            Tạo tài khoản mới
          </button>
        </div>

        <div className="grid gap-4 rounded-[28px] bg-[#f6f8fc] p-5 text-sm md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg shadow-sm">
              📞
            </div>
            <div>
              <p className="font-semibold text-slate-700">Hỗ trợ khách hàng</p>
              <p className="mt-1 text-slate-500">0388048642</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
