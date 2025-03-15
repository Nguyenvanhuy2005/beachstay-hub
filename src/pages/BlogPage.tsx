
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });

        if (error) {
          console.error('Error fetching blog posts:', error);
          return;
        }

        if (data && data.length > 0) {
          setPosts(data);
        } else {
          // Fallback to hardcoded data if no data in the database
          setPosts([
            {
              id: '1',
              title: 'Top 5 Hoạt Động Không Thể Bỏ Lỡ Tại Vũng Tàu',
              title_en: 'Top 5 Activities You Can\'t Miss in Vung Tau',
              slug: 'top-5-hoat-dong-tai-vung-tau',
              excerpt: 'Khám phá những hoạt động thú vị nhất tại Vũng Tàu, từ tắm biển đến khám phá ẩm thực địa phương.',
              excerpt_en: 'Discover the most exciting activities in Vung Tau, from swimming to exploring local cuisine.',
              featured_image: '/lovable-uploads/447ed5f1-0675-492c-8437-bb1fdf09ab86.png',
              author: 'Tuấn Anh',
              published_at: '2023-08-15',
              tags: ['du lịch', 'biển', 'hoạt động', 'travel', 'beach', 'activities'],
            },
            {
              id: '2',
              title: 'Trải Nghiệm Ẩm Thực Tại Annam Village',
              title_en: 'Culinary Experience at Annam Village',
              slug: 'trai-nghiem-am-thuc-tai-annam-village',
              excerpt: 'Khám phá những món ăn đặc sắc và cocktail sáng tạo tại nhà hàng và quầy bar của Annam Village.',
              excerpt_en: 'Discover the signature dishes and creative cocktails at Annam Village\'s restaurant and bar.',
              featured_image: '/lovable-uploads/cdfb47b1-e949-44cc-85b1-de98fba2961e.png',
              author: 'Minh Hằng',
              published_at: '2023-09-20',
              tags: ['ẩm thực', 'nhà hàng', 'đồ uống', 'cuisine', 'restaurant', 'drinks'],
            },
            {
              id: '3',
              title: 'Cẩm Nang Du Lịch Vũng Tàu Mùa Hè',
              title_en: 'Vung Tau Summer Travel Guide',
              slug: 'cam-nang-du-lich-vung-tau-mua-he',
              excerpt: 'Hướng dẫn chi tiết về du lịch Vũng Tàu vào mùa hè, bao gồm các địa điểm tham quan và lưu ý quan trọng.',
              excerpt_en: 'Detailed guide to Vung Tau travel in summer, including attractions and important notes.',
              featured_image: '/lovable-uploads/595dc250-29ec-4d1d-873b-d34aecdba712.png',
              author: 'Thanh Tâm',
              published_at: '2023-07-05',
              tags: ['du lịch', 'mùa hè', 'cẩm nang', 'travel', 'summer', 'guide'],
            },
          ]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const getTitle = (post) => {
    return language === 'vi' ? post.title : post.title_en;
  };

  const getExcerpt = (post) => {
    return language === 'vi' ? post.excerpt : post.excerpt_en;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const filteredPosts = posts.filter(post => {
    const title = getTitle(post).toLowerCase();
    const excerpt = getExcerpt(post).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return title.includes(query) || excerpt.includes(query);
  });

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img 
            src="/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png" 
            alt="Blog cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {language === 'vi' ? 'Blog & Tin Tức' : 'Blog & News'}
          </h1>
          <p className="text-beach-100 max-w-3xl text-lg mb-8">
            {language === 'vi' 
              ? 'Cập nhật thông tin mới nhất về Annam Village, các sự kiện, cẩm nang du lịch và nhiều nội dung thú vị khác.'
              : 'Get the latest updates about Annam Village, events, travel guides and more interesting content.'}
          </p>
          
          <div className="relative max-w-lg">
            <Input
              type="text"
              placeholder={language === 'vi' ? "Tìm kiếm bài viết..." : "Search articles..."}
              className="pr-10 border-beach-300 bg-white/90 text-beach-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-beach-500 h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="font-serif text-3xl font-bold mb-8 text-gray-900">
          {language === 'vi' ? 'Bài Viết Mới Nhất' : 'Latest Articles'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {language === 'vi' 
                ? 'Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.'
                : 'No articles found matching your search.'}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.featured_image} 
                      alt={getTitle(post)}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-beach-50 text-beach-700 border-beach-200">
                          {language === 'vi' ? tag : post.tags[index + 3]}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="font-serif">{getTitle(post)}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700">{getExcerpt(post)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-beach-500 text-beach-700 hover:bg-beach-50">
                      <Link to={`/blog/${post.slug}`}>
                        {language === 'vi' ? 'Đọc Tiếp' : 'Read More'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogPage;
