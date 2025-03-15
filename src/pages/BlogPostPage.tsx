
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Loader2, ChevronLeft, ChevronRight, Share2, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(false);
        
        console.log('Fetching blog post with slug:', slug);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching blog post:', error);
          setError(true);
          return;
        }

        if (data) {
          console.log('Blog post retrieved:', data);
          setPost(data);
          
          // Fetch related posts based on tags
          if (data.tags && data.tags.length > 0) {
            fetchRelatedPosts(data.id, data.tags);
          }
        } else {
          // If no data found, set error state
          setError(true);
          console.log('No blog post found with this slug');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
      // Reset scroll position
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const fetchRelatedPosts = async (currentPostId, tags) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, title_en, slug, featured_image, published_at')
        .eq('published', true)
        .neq('id', currentPostId)
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching related posts:', error);
        return;
      }

      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Unexpected error when fetching related posts:', error);
    }
  };

  const getTitle = () => {
    return language === 'vi' ? post.title : post.title_en;
  };

  const getContent = () => {
    return language === 'vi' ? post.content : post.content_en;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getReadingTime = (content) => {
    // Average reading speed: 200 words per minute
    if (!content) return language === 'vi' ? '1 phút đọc' : '1 min read';
    const wordCount = content.split(/\s+/).length || 0;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    return language === 'vi' 
      ? `${readingTimeMinutes} phút đọc`
      : `${readingTimeMinutes} min read`;
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
    if (!post) return language === 'vi' ? 'Không tìm thấy bài viết' : 'Post Not Found';
    return language === 'vi' 
      ? (post.meta_title || post.title)
      : (post.meta_title_en || post.title_en);
  };

  const getMetaDescription = () => {
    if (!post) return '';
    return language === 'vi'
      ? (post.meta_description || post.excerpt || `Đọc bài viết ${post.title} tại Annam Village`)
      : (post.meta_description_en || post.excerpt_en || `Read ${post.title_en} at Annam Village`);
  };

  const handleSharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: getTitle(),
        text: getMetaDescription(),
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success(language === 'vi' ? 'Đã sao chép đường dẫn' : 'Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Helmet>
          <title>{language === 'vi' ? 'Đang tải...' : 'Loading...'} | Annam Village</title>
        </Helmet>
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-beach-600" />
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <Helmet>
          <title>{language === 'vi' ? 'Không tìm thấy bài viết' : 'Post Not Found'} | Annam Village</title>
          <meta 
            name="description" 
            content={language === 'vi' 
              ? 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.' 
              : 'The post you are looking for does not exist or has been removed.'} 
          />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-serif font-bold mb-6 text-beach-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {language === 'vi' ? 'Không Tìm Thấy Bài Viết' : 'Post Not Found'}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {language === 'vi' 
                ? 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã được gỡ bỏ.'
                : 'The post you are looking for does not exist or has been removed.'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild className="bg-beach-600 hover:bg-beach-700">
                <Link to="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {language === 'vi' ? 'Quay Lại Blog' : 'Back to Blog'}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasMultipleImages = post.featured_image && post.gallery_images && post.gallery_images.length > 0;
  const currentPostUrl = window.location.href;
  const readingTime = getReadingTime(getContent());

  return (
    <MainLayout>
      <Helmet>
        <title>{getMetaTitle()} | Annam Village</title>
        <meta name="description" content={getMetaDescription()} />
        {post.keywords && <meta name="keywords" content={language === 'vi' ? post.keywords : post.keywords_en} />}
        <meta property="og:title" content={getMetaTitle()} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:url" content={currentPostUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.author} />
        {post.tags && post.tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
        <link rel="canonical" href={currentPostUrl} />
      </Helmet>
      
      {/* Hero Banner */}
      <div className="relative h-80 md:h-96 bg-beach-900">
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
                aria-label={language === 'vi' ? 'Ảnh trước' : 'Previous image'}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-20"
                aria-label={language === 'vi' ? 'Ảnh sau' : 'Next image'}
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
              {post.tags && post.tags.map((tag, index) => (
                <Badge key={index} className="bg-beach-600/80">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {getTitle()}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-beach-100 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Preview (if multiple images) */}
      {post.gallery_images && post.gallery_images.length > 0 && (
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
              {[post.featured_image, ...post.gallery_images].filter(Boolean).map((image, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 
                    ${currentImageIndex === index ? 'border-beach-500' : 'border-transparent'}`}
                >
                  <img 
                    src={image} 
                    alt={`${getTitle()} - ${language === 'vi' ? 'Hình ảnh' : 'Image'} ${index + 1}`} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Article Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'vi' ? 'Quay Lại Blog' : 'Back to Blog'}
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSharePost} 
              className="rounded-full"
              aria-label={language === 'vi' ? 'Chia sẻ bài viết' : 'Share post'}
            >
              <Share2 className="mr-2 h-4 w-4" />
              {language === 'vi' ? 'Chia sẻ' : 'Share'}
            </Button>
          </div>
          
          {post.excerpt && (
            <motion.div 
              className="mb-8 bg-beach-50 p-6 rounded-lg border border-beach-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg italic text-beach-800">
                {language === 'vi' ? post.excerpt : post.excerpt_en}
              </p>
            </motion.div>
          )}
          
          <motion.article 
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-beach-900 prose-img:rounded-lg prose-a:text-beach-600 prose-a:no-underline hover:prose-a:underline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            dangerouslySetInnerHTML={{ __html: getContent() }}
          />
          
          {/* Share buttons */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-beach-900">
                {language === 'vi' ? 'Chia sẻ bài viết này' : 'Share this post'}
              </h3>
              <Button 
                variant="outline" 
                onClick={handleSharePost} 
                className="rounded-full"
                aria-label={language === 'vi' ? 'Chia sẻ bài viết' : 'Share post'}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {language === 'vi' ? 'Chia sẻ' : 'Share'}
              </Button>
            </div>
          </div>
          
          {/* Author Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-beach-200 rounded-full flex items-center justify-center text-beach-600 font-bold text-xl">
                {post.author ? post.author.charAt(0) : 'A'}
              </div>
              <div className="ml-4">
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {language === 'vi' ? 'Đăng ngày' : 'Posted on'} {formatDate(post.published_at || post.created_at)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold text-beach-900 mb-6">
                {language === 'vi' ? 'Bài Viết Liên Quan' : 'Related Posts'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="rounded-lg overflow-hidden h-40 mb-3">
                      <img 
                        src={relatedPost.featured_image || '/placeholder.svg'} 
                        alt={language === 'vi' ? relatedPost.title : relatedPost.title_en} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-medium text-beach-900 group-hover:text-beach-600 transition-colors line-clamp-2">
                      {language === 'vi' ? relatedPost.title : relatedPost.title_en}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(relatedPost.published_at || relatedPost.created_at)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogPostPage;
