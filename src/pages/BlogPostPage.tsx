
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            gallery_images: [
              '/lovable-uploads/570e7af9-b072-46c1-a4b0-b982c09d1df4.png',
              '/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png'
            ],
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

  const getImageToShow = () => {
    // Combine featured image and gallery images
    const allImages = [
      post.featured_image,
      ...(post.gallery_images || [])
    ].filter(Boolean);
    
    if (allImages.length === 0) {
      return '/placeholder.svg';
    }
    
    return allImages[currentImageIndex];
  };

  const handlePrevImage = () => {
    const allImages = [post.featured_image, ...(post.gallery_images || [])].filter(Boolean);
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const allImages = [post.featured_image, ...(post.gallery_images || [])].filter(Boolean);
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const getMetaTitle = () => {
    if (!post) return '';
    return language === 'vi' 
      ? (post.meta_title || post.title)
      : (post.meta_title_en || post.title_en);
  };

  const getMetaDescription = () => {
    if (!post) return '';
    return language === 'vi'
      ? (post.meta_description || post.excerpt)
      : (post.meta_description_en || post.excerpt_en);
  };

  // Set meta tags for SEO
  useEffect(() => {
    if (post) {
      // Set document title
      document.title = getMetaTitle();
      
      // Set meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', getMetaDescription() || '');
      
      // Set meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      const keywords = language === 'vi' ? post.keywords : post.keywords_en;
      if (keywords) {
        metaKeywords.setAttribute('content', keywords);
      }
      
      // Return cleanup function
      return () => {
        document.title = 'Annam Village';
        if (metaDescription) metaDescription.remove();
        if (metaKeywords) metaKeywords.remove();
      };
    }
  }, [post, language]);

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

  const hasMultipleImages = post.featured_image && post.gallery_images && post.gallery_images.length > 0;

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="relative h-96 bg-beach-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/70 to-beach-900/90 z-10"></div>
          <img 
            src={getImageToShow()} 
            alt={getTitle()} 
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {hasMultipleImages && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
                {currentImageIndex + 1} / {[post.featured_image, ...(post.gallery_images || [])].filter(Boolean).length}
              </div>
            </>
          )}
        </div>
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.slice(0, language === 'vi' ? 3 : 6).map((tag, index) => (
                <Badge key={index} className="bg-beach-600/80">
                  {tag}
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
      
      {/* Gallery Preview (if multiple images) */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto space-x-4 pb-2">
              {[post.featured_image, ...post.gallery_images].filter(Boolean).map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2 
                    ${currentImageIndex === index ? 'border-beach-500' : 'border-transparent'}`}
                >
                  <img 
                    src={image} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="outline" className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Quay Lại Blog' : 'Back to Blog'}
            </Link>
          </Button>
          
          {post.excerpt && (
            <div className="mb-8 bg-beach-50 p-6 rounded-lg border border-beach-100">
              <p className="text-lg italic text-beach-800">
                {language === 'vi' ? post.excerpt : post.excerpt_en}
              </p>
            </div>
          )}
          
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            dangerouslySetInnerHTML={{ __html: getContent() }}
          />
          
          {/* Author Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-beach-200 rounded-full flex items-center justify-center text-beach-600 font-bold text-xl">
                {post.author.charAt(0)}
              </div>
              <div className="ml-4">
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {language === 'vi' ? 'Đăng ngày' : 'Posted on'} {formatDate(post.published_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPostPage;
