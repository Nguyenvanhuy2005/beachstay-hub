
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error) {
          console.error('Error fetching blog post:', error);
          return;
        }

        if (data) {
          setPost(data);
        } else {
          // Fallback to hardcoded data if no data in the database
          setPost({
            id: '1',
            title: 'Top 5 Hoạt Động Không Thể Bỏ Lỡ Tại Vũng Tàu',
            title_en: 'Top 5 Activities You Can\'t Miss in Vung Tau',
            slug: 'top-5-hoat-dong-tai-vung-tau',
            content: `<p>Vũng Tàu là điểm đến du lịch biển nổi tiếng tại miền Nam Việt Nam, chỉ cách TP.HCM khoảng 2 giờ di chuyển. Với bãi biển đẹp, khí hậu mát mẻ và nhiều điểm tham quan thú vị, Vũng Tàu luôn là lựa chọn hàng đầu cho kỳ nghỉ ngắn ngày.</p>
            <h2>1. Tắm biển tại Bãi Sau</h2>
            <p>Bãi Sau (hay còn gọi là Bãi Thùy Vân) là một trong những bãi biển đẹp nhất Vũng Tàu với bờ cát trắng mịn trải dài, nước biển trong xanh và sóng nhẹ. Đây là nơi lý tưởng để tắm biển, tắm nắng hoặc chơi các môn thể thao trên biển.</p>
            <h2>2. Check-in tại Tượng Chúa Kitô</h2>
            <p>Tượng Chúa Kitô Vua là biểu tượng nổi tiếng của Vũng Tàu, nằm trên đỉnh Núi Nhỏ. Du khách có thể leo 811 bậc thang để lên đến tượng và thưởng ngoạn toàn cảnh thành phố và biển từ trên cao.</p>
            <h2>3. Khám phá Hải đăng Vũng Tàu</h2>
            <p>Hải đăng Vũng Tàu nằm trên đỉnh Núi Nhỏ, là một trong những ngọn hải đăng cổ nhất Việt Nam. Đây không chỉ là điểm tham quan mà còn là địa điểm lý tưởng để ngắm bình minh hoặc hoàng hôn tuyệt đẹp.</p>
            <h2>4. Thưởng thức hải sản tươi ngon</h2>
            <p>Vũng Tàu nổi tiếng với các món hải sản tươi ngon như bánh khọt, hải sản nướng, gỏi cá trích... Du khách có thể thưởng thức tại các nhà hàng ven biển hoặc khu chợ hải sản Lưới Đỏ.</p>
            <h2>5. Tham quan khu du lịch Hồ Mây</h2>
            <p>Khu du lịch Hồ Mây nằm trên đỉnh Núi Lớn, cung cấp nhiều hoạt động giải trí như trò chơi mạo hiểm, vườn thú, công viên nước và nhiều dịch vụ khác. Từ đây, du khách cũng có thể ngắm toàn cảnh thành phố.</p>`,
            content_en: `<p>Vung Tau is a famous beach destination in southern Vietnam, just about 2 hours away from Ho Chi Minh City. With beautiful beaches, pleasant climate and many interesting attractions, Vung Tau is always a top choice for a short getaway.</p>
            <h2>1. Swimming at Back Beach</h2>
            <p>Back Beach (or Thuy Van Beach) is one of the most beautiful beaches in Vung Tau with long, fine white sand, clear blue water and gentle waves. This is an ideal place for swimming, sunbathing or playing water sports.</p>
            <h2>2. Check-in at Christ the King Statue</h2>
            <p>The Christ the King Statue is a famous symbol of Vung Tau, located on Small Mountain. Visitors can climb 811 steps to reach the statue and enjoy panoramic views of the city and sea from above.</p>
            <h2>3. Explore Vung Tau Lighthouse</h2>
            <p>Vung Tau Lighthouse is located on Small Mountain and is one of the oldest lighthouses in Vietnam. It is not only a tourist attraction but also an ideal place to watch beautiful sunrises or sunsets.</p>
            <h2>4. Enjoy fresh seafood</h2>
            <p>Vung Tau is famous for its fresh seafood dishes such as banh khot (mini pancakes), grilled seafood, herring fish salad, etc. Visitors can enjoy these at seaside restaurants or at the Luoi Do seafood market.</p>
            <h2>5. Visit Ho May Tourist Park</h2>
            <p>Ho May Tourist Park is located on Big Mountain and offers many recreational activities such as adventure games, zoo, water park and many other services. From here, visitors can also see panoramic views of the city.</p>`,
            featured_image: '/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png',
            author: 'Tuấn Anh',
            published_at: '2023-08-15',
            tags: ['du lịch', 'biển', 'hoạt động', 'travel', 'beach', 'activities'],
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const getTitle = () => {
    return language === 'vi' ? post.title : post.title_en;
  };

  const getContent = () => {
    return language === 'vi' ? post.content : post.content_en;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4 text-gray-900">
            {language === 'vi' ? 'Không Tìm Thấy Bài Viết' : 'Post Not Found'}
          </h1>
          <p className="text-gray-700 mb-8">
            {language === 'vi' 
              ? 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.'
              : 'The post you are looking for does not exist or has been removed.'}
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Quay Lại Blog' : 'Back to Blog'}
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative h-96 bg-beach-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/70 to-beach-900/90 z-10"></div>
          <img 
            src={post.featured_image} 
            alt={getTitle()} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="flex gap-2 mb-4">
              {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} className="bg-beach-600/80">
                  {language === 'vi' ? tag : post.tags[index + 3]}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {getTitle()}
            </h1>
            <div className="flex items-center gap-6 text-beach-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Quay Lại Blog' : 'Back to Blog'}
            </Link>
          </Button>
          
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            dangerouslySetInnerHTML={{ __html: getContent() }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPostPage;
