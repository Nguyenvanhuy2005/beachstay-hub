import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
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
  const {
    language
  } = useLanguage();
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        console.log('Fetching blog posts...');
        const {
          data,
          error
        } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', {
          ascending: false
        });
        if (error) {
          console.error('Error fetching blog posts:', error);
          toast.error(language === 'vi' ? 'Không thể tải bài viết' : 'Could not load blog posts');
          return;
        }
        console.log('Blog posts fetched:', data?.length || 0);
        setPosts(data || []);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogPosts();
  }, [language]);
  const getTitle = post => {
    return language === 'vi' ? post.title : post.title_en;
  };
  const getExcerpt = post => {
    return language === 'vi' ? post.excerpt : post.excerpt_en;
  };
  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    const title = getTitle(post)?.toLowerCase() || '';
    const excerpt = getExcerpt(post)?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return title.includes(query) || excerpt.includes(query);
  });
  return <MainLayout>
      <Helmet>
        <title>{language === 'vi' ? 'Blog & Tin Tức | An Nam Village' : 'Blog & News | An Nam Village'}</title>
        <meta name="description" content={language === 'vi' ? 'Cập nhật thông tin mới nhất về An Nam Village, các sự kiện, cẩm nang du lịch và nhiều nội dung thú vị khác.' : 'Get the latest updates about An Nam Village, events, travel guides and more interesting content.'} />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative bg-beach-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-beach-900/80 to-beach-800/90 z-10"></div>
          <img src="/lovable-uploads/842f894d-4d09-4b7b-9de4-e68c7d1e2e30.png" alt="Blog cover" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {language === 'vi' ? 'Blog & Tin Tức' : 'Blog & News'}
          </h1>
          <p className="text-beach-100 max-w-3xl text-lg mb-8">
            {language === 'vi' ? 'Cập nhật thông tin mới nhất về An Nam Village, các sự kiện, cẩm nang du lịch và nhiều nội dung thú vị khác.' : 'Get the latest updates about An Nam Village, events, travel guides and more interesting content.'}
          </p>
          
          <div className="relative max-w-lg">
            <Input type="text" placeholder={language === 'vi' ? "Tìm kiếm bài viết..." : "Search articles..."} className="pr-10 border-beach-300 bg-white/90 text-beach-900" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-beach-500 h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold mb-8 text-gray-900">
          {language === 'vi' ? 'Bài Viết Mới Nhất' : 'Latest Articles'}
        </h2>

        {loading ? <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
          </div> : filteredPosts.length === 0 ? <div className="text-center py-20">
            {searchQuery ? <p className="text-gray-500 text-lg">
                {language === 'vi' ? 'Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.' : 'No articles found matching your search.'}
              </p> : <p className="text-gray-500 text-lg">
                {language === 'vi' ? 'Chưa có bài viết nào. Hãy thêm bài viết đầu tiên trong phần quản lý nội dung.' : 'No articles yet. Please add the first article in the content management section.'}
              </p>}
          </div> : <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
            {filteredPosts.map(post => <motion.div key={post.id} variants={itemVariants}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.featured_image || '/placeholder.svg'} alt={getTitle(post)} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.tags && post.tags.slice(0, 3).map((tag, index) => <Badge key={index} variant="outline" className="bg-beach-50 text-beach-700 border-beach-200">
                          {tag}
                        </Badge>)}
                    </div>
                    <CardTitle className="font-display my-[2px] font-bold py-[9px]">{getTitle(post)}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-700 line-clamp-3">{getExcerpt(post)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-beach-500 text-beach-700 hover:bg-beach-50">
                      <Link to={`/blog/${post.slug}`}>
                        {language === 'vi' ? 'Đọc Tiếp' : 'Read More'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>)}
          </motion.div>}
      </div>
    </MainLayout>;
};
export default BlogPage;