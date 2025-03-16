
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-beach-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold">
                Annam<span className="text-beach-500">Village</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-4">
              Nơi hòa quyện giữa thiên nhiên và không gian nghỉ dưỡng sang trọng tại thành phố biển Vũng Tàu.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-beach-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-beach-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-beach-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-beach-500 transition-colors">Trang Chủ</Link></li>
              <li><Link to="/ve-chung-toi" className="text-gray-300 hover:text-beach-500 transition-colors">Về Chúng Tôi</Link></li>
              <li><Link to="/loai-phong" className="text-gray-300 hover:text-beach-500 transition-colors">Loại Phòng</Link></li>
              <li><Link to="/dich-vu" className="text-gray-300 hover:text-beach-500 transition-colors">Dịch Vụ</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-beach-500 transition-colors">Blog</Link></li>
              <li><Link to="/lien-he" className="text-gray-300 hover:text-beach-500 transition-colors">Liên Hệ</Link></li>
              <li><Link to="/chinh-sach" className="text-gray-300 hover:text-beach-500 transition-colors">Chính Sách</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-beach-500" />
                <span className="text-gray-300">
                  123 Đường Biển, Phường 1, TP. Vũng Tàu, Việt Nam
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-beach-500" />
                <a href="tel:+84909123456" className="text-gray-300 hover:text-beach-500 transition-colors">+84 909 123 456</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-beach-500" />
                <a href="mailto:info@annamvillage.vn" className="text-gray-300 hover:text-beach-500 transition-colors">info@annamvillage.vn</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Đăng Ký Nhận Tin</h3>
            <p className="text-gray-300 mb-4">
              Đăng ký để nhận thông tin ưu đãi và tin tức mới nhất từ Annam Village.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Email của bạn"
                className="bg-beach-800 border-beach-700 focus:border-beach-500 text-white"
              />
              <Button className="bg-beach-500 hover:bg-beach-600">
                Đăng Ký
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-beach-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Annam Village. Tất cả quyền được bảo lưu.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-400">
                <li><Link to="/dieu-khoan" className="hover:text-beach-500 transition-colors">Điều Khoản</Link></li>
                <li><Link to="/bao-mat" className="hover:text-beach-500 transition-colors">Bảo Mật</Link></li>
                <li><Link to="/cookie" className="hover:text-beach-500 transition-colors">Cookie</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
