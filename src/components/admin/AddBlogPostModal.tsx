
import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Plus, X, Upload, Info, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AddBlogPostModal = ({ open, onOpenChange, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptEn, setExcerptEn] = useState('');
  const [author, setAuthor] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [published, setPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [featuredImage, setFeaturedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  
  // SEO related states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaTitleEn, setMetaTitleEn] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaDescriptionEn, setMetaDescriptionEn] = useState('');
  const [metaKeywordInput, setMetaKeywordInput] = useState('');
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [focusKeyword, setFocusKeyword] = useState('');
  const [focusKeywordEn, setFocusKeywordEn] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  
  // Structured data state (simplified JSON-LD for blog post)
  const [structuredData, setStructuredData] = useState({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "",
    "image": "",
    "author": {
      "@type": "Person",
      "name": ""
    },
    "datePublished": "",
    "dateModified": "",
    "publisher": {
      "@type": "Organization",
      "name": "Annam Village",
      "logo": {
        "@type": "ImageObject",
        "url": "https://annamvillage.vn/logo.png"
      }
    }
  });
  
  const fileInputRef = useRef(null);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  // Calculate SEO score based on content quality
  const calculateSeoScore = () => {
    let score = 0;
    const maxScore = 100;
    
    // Title length (ideal: 50-60 chars)
    if (title && title.length >= 40 && title.length <= 70) score += 10;
    else if (title && title.length > 20) score += 5;
    
    // Meta description (ideal: 150-160 chars)
    if (metaDescription && metaDescription.length >= 140 && metaDescription.length <= 170) score += 15;
    else if (metaDescription && metaDescription.length >= 100) score += 8;
    
    // Content length (min 300 words ~ 1500 chars)
    if (content && content.length > 3000) score += 20;
    else if (content && content.length > 1500) score += 10;
    
    // Focus keyword in title
    if (focusKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 10;
    
    // Focus keyword in content (at least 3 times)
    if (focusKeyword) {
      const regex = new RegExp(focusKeyword.toLowerCase(), 'g');
      const matches = (content.toLowerCase().match(regex) || []).length;
      if (matches >= 5) score += 15;
      else if (matches >= 3) score += 10;
      else if (matches >= 1) score += 5;
    }
    
    // Featured image
    if (featuredImageUrl) score += 10;
    
    // Meta keywords
    if (metaKeywords.length >= 3) score += 10;
    
    // Canonical URL
    if (canonicalUrl) score += 5;
    
    // Content has headings (h2, h3)
    if (content.includes('<h2') || content.includes('<h3')) score += 5;
    
    setSeoScore(score);
    
    // Return color class based on score
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Generate slug from title if slug is empty
    if (!slug) {
      setSlug(generateSlug(newTitle));
    }
    
    // Use title as meta title if empty
    if (!metaTitle) {
      setMetaTitle(newTitle);
    }
    
    // Update structured data
    setStructuredData(prev => ({
      ...prev,
      headline: newTitle.substring(0, 110) // Schema.org recommends max 110 chars
    }));
  };

  const generateSlug = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-'); // Replace multiple - with single -
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAddMetaKeyword = (e) => {
    if (e.key === 'Enter' && metaKeywordInput.trim()) {
      e.preventDefault();
      if (!metaKeywords.includes(metaKeywordInput.trim())) {
        setMetaKeywords([...metaKeywords, metaKeywordInput.trim()]);
      }
      setMetaKeywordInput('');
    }
  };

  const handleRemoveMetaKeyword = (keywordToRemove) => {
    setMetaKeywords(metaKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      
      // Check file size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Kích thước tệp quá lớn (tối đa 5MB)');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận tệp hình ảnh');
        return;
      }
      
      // Generate a unique path for the image
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `blog-images/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Không thể tải lên hình ảnh');
        return;
      }
      
      // Get public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);
      
      setFeaturedImage(file);
      setFeaturedImageUrl(urlData.publicUrl);
      
      // Update structured data
      setStructuredData(prev => ({
        ...prev,
        image: urlData.publicUrl
      }));
      
      toast.success('Đã tải lên hình ảnh thành công');
      
    } catch (error) {
      console.error('Unexpected error uploading image:', error);
      toast.error('Không thể tải lên hình ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !titleEn || !slug || !content || !contentEn || !author) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if slug already exists
      const { data: existingPost, error: checkError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingPost) {
        toast.error('Đường dẫn (slug) đã tồn tại, vui lòng sử dụng một đường dẫn khác');
        setIsSubmitting(false);
        return;
      }
      
      // Update structured data with final values
      const currentDate = new Date().toISOString();
      const updatedStructuredData = {
        ...structuredData,
        headline: metaTitle || title.substring(0, 110),
        image: featuredImageUrl || "",
        author: {
          "@type": "Person",
          name: author
        },
        datePublished: currentDate,
        dateModified: currentDate
      };
      
      // Calculate final SEO score
      const finalSeoScore = seoScore || calculateSeoScore();
      
      // Create new blog post with SEO fields
      const newPost = {
        title,
        title_en: titleEn,
        slug,
        content,
        content_en: contentEn,
        excerpt: excerpt || null,
        excerpt_en: excerptEn || null,
        author,
        tags,
        published,
        published_at: published ? new Date().toISOString() : null,
        featured_image: featuredImageUrl || null,
        // SEO fields
        meta_title: metaTitle || title,
        meta_title_en: metaTitleEn || titleEn,
        meta_description: metaDescription || excerpt,
        meta_description_en: metaDescriptionEn || excerptEn,
        meta_keywords: metaKeywords,
        focus_keyword: focusKeyword,
        focus_keyword_en: focusKeywordEn,
        canonical_url: canonicalUrl,
        seo_score: finalSeoScore,
        structured_data: updatedStructuredData
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(newPost)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Đã tạo bài viết thành công');
      onPostAdded();
      handleReset();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Không thể tạo bài viết');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setTitleEn('');
    setSlug('');
    setContent('');
    setContentEn('');
    setExcerpt('');
    setExcerptEn('');
    setAuthor('');
    setTags([]);
    setTagInput('');
    setPublished(false);
    setFeaturedImage(null);
    setFeaturedImageUrl('');
    
    // Reset SEO fields
    setMetaTitle('');
    setMetaTitleEn('');
    setMetaDescription('');
    setMetaDescriptionEn('');
    setMetaKeywords([]);
    setMetaKeywordInput('');
    setFocusKeyword('');
    setFocusKeywordEn('');
    setCanonicalUrl('');
    setSeoScore(0);
    
    // Reset structured data
    setStructuredData({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "",
      "image": "",
      "author": {
        "@type": "Person",
        "name": ""
      },
      "datePublished": "",
      "dateModified": "",
      "publisher": {
        "@type": "Organization",
        "name": "Annam Village",
        "logo": {
          "@type": "ImageObject",
          "url": "https://annamvillage.vn/logo.png"
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleReset();
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Bài Viết Mới</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <Tabs defaultValue="vietnamese">
            <TabsList className="mb-4">
              <TabsTrigger value="vietnamese">Tiếng Việt</TabsTrigger>
              <TabsTrigger value="english">Tiếng Anh</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vietnamese" className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu Đề (Tiếng Việt) <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={handleTitleChange} 
                  placeholder="Nhập tiêu đề bài viết" 
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt">Tóm Tắt (Tiếng Việt)</Label>
                <Textarea 
                  id="excerpt" 
                  value={excerpt} 
                  onChange={(e) => setExcerpt(e.target.value)} 
                  placeholder="Tóm tắt ngắn gọn về bài viết (sẽ hiển thị ở trang danh sách)" 
                  rows={3} 
                />
              </div>
              
              <div>
                <Label htmlFor="content">Nội Dung (Tiếng Việt) <span className="text-red-500">*</span></Label>
                <div className="mt-1 mb-8 h-64 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập nội dung bài viết..."
                    className="h-56"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="english" className="space-y-4">
              <div>
                <Label htmlFor="title_en">Tiêu Đề (Tiếng Anh) <span className="text-red-500">*</span></Label>
                <Input 
                  id="title_en" 
                  value={titleEn} 
                  onChange={(e) => setTitleEn(e.target.value)} 
                  placeholder="Enter post title" 
                />
              </div>
              
              <div>
                <Label htmlFor="excerpt_en">Tóm Tắt (Tiếng Anh)</Label>
                <Textarea 
                  id="excerpt_en" 
                  value={excerptEn} 
                  onChange={(e) => setExcerptEn(e.target.value)} 
                  placeholder="Brief excerpt about the post (will be displayed in the listing page)" 
                  rows={3} 
                />
              </div>
              
              <div>
                <Label htmlFor="content_en">Nội Dung (Tiếng Anh) <span className="text-red-500">*</span></Label>
                <div className="mt-1 mb-8 h-64 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={contentEn} 
                    onChange={setContentEn}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter post content..."
                    className="h-56"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="space-y-4">
              <div>
                <Label htmlFor="slug">Đường Dẫn (Slug) <span className="text-red-500">*</span></Label>
                <Input 
                  id="slug" 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  placeholder="duong-dan-bai-viet" 
                />
                <p className="text-sm text-gray-500 mt-1">URL: /blog/{slug}</p>
              </div>
              
              <div>
                <Label htmlFor="author">Tác Giả <span className="text-red-500">*</span></Label>
                <Input 
                  id="author" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  placeholder="Tên tác giả" 
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Thẻ</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs hover:bg-red-600 rounded-full h-4 w-4 inline-flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input 
                  id="tags" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleAddTag} 
                  placeholder="Nhập thẻ và nhấn Enter" 
                />
              </div>
              
              <div>
                <Label htmlFor="featured-image">Ảnh Đại Diện</Label>
                <div className="mt-2">
                  {featuredImageUrl ? (
                    <div className="relative w-full h-48 rounded-md overflow-hidden mb-2">
                      <img 
                        src={featuredImageUrl} 
                        alt="Featured" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                        onClick={() => {
                          setFeaturedImage(null);
                          setFeaturedImageUrl('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full h-24 border-dashed"
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5 mr-2" />
                      )}
                      {uploadingImage ? 'Đang tải lên...' : 'Tải lên ảnh đại diện'}
                    </Button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Xuất bản ngay</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg border border-muted mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">SEO Score</h3>
                  <div className={`ml-auto font-bold text-lg ${calculateSeoScore()}`}>
                    {seoScore}/100
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Điểm SEO được tính dựa trên các yếu tố tối ưu. Điểm càng cao, bài viết càng có khả năng đạt thứ hạng tốt trên công cụ tìm kiếm.
                </p>
              </div>
            
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <Label htmlFor="metaTitle">Tiêu đề Meta (Tiếng Việt)</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="text-sm">Tiêu đề hiển thị trên kết quả tìm kiếm. Lý tưởng: 50-60 ký tự.</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <Input 
                      id="metaTitle" 
                      value={metaTitle} 
                      onChange={(e) => setMetaTitle(e.target.value)} 
                      placeholder={title || "Tiêu đề hiển thị trên kết quả tìm kiếm"} 
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">Ký tự tối ưu: 50-60</p>
                      <p className={`text-xs ${metaTitle.length > 70 ? 'text-red-500' : metaTitle.length > 50 ? 'text-green-500' : 'text-amber-500'}`}>
                        {metaTitle.length}/70
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Label htmlFor="metaDescription">Mô tả Meta (Tiếng Việt)</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="text-sm">Mô tả ngắn hiển thị trên kết quả tìm kiếm. Lý tưởng: 150-160 ký tự.</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <Textarea 
                      id="metaDescription" 
                      value={metaDescription} 
                      onChange={(e) => setMetaDescription(e.target.value)} 
                      placeholder={excerpt || "Mô tả ngắn hiển thị trên kết quả tìm kiếm"}
                      rows={3}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">Ký tự tối ưu: 150-160</p>
                      <p className={`text-xs ${metaDescription.length > 170 ? 'text-red-500' : metaDescription.length > 140 ? 'text-green-500' : 'text-amber-500'}`}>
                        {metaDescription.length}/170
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Label htmlFor="focusKeyword">Từ khóa chính (Tiếng Việt)</Label>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="text-sm">Từ khóa chính bạn muốn tối ưu cho bài viết này.</p>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <Input 
                      id="focusKeyword" 
                      value={focusKeyword} 
                      onChange={(e) => setFocusKeyword(e.target.value)} 
                      placeholder="Từ khóa chính cần tối ưu" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center">
                      <Label htmlFor="metaTitleEn">Tiêu đề Meta (Tiếng Anh)</Label>
                    </div>
                    <Input 
                      id="metaTitleEn" 
                      value={metaTitleEn} 
                      onChange={(e) => setMetaTitleEn(e.target.value)} 
                      placeholder={titleEn || "Meta title in English"} 
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">Optimal characters: 50-60</p>
                      <p className={`text-xs ${metaTitleEn.length > 70 ? 'text-red-500' : metaTitleEn.length > 50 ? 'text-green-500' : 'text-amber-500'}`}>
                        {metaTitleEn.length}/70
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Label htmlFor="metaDescriptionEn">Mô tả Meta (Tiếng Anh)</Label>
                    </div>
                    <Textarea 
                      id="metaDescriptionEn" 
                      value={metaDescriptionEn} 
                      onChange={(e) => setMetaDescriptionEn(e.target.value)} 
                      placeholder={excerptEn || "Meta description in English"}
                      rows={3}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">Optimal characters: 150-160</p>
                      <p className={`text-xs ${metaDescriptionEn.length > 170 ? 'text-red-500' : metaDescriptionEn.length > 140 ? 'text-green-500' : 'text-amber-500'}`}>
                        {metaDescriptionEn.length}/170
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Label htmlFor="focusKeywordEn">Từ khóa chính (Tiếng Anh)</Label>
                    </div>
                    <Input 
                      id="focusKeywordEn" 
                      value={focusKeywordEn} 
                      onChange={(e) => setFocusKeywordEn(e.target.value)} 
                      placeholder="Main keyword to optimize for" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center">
                    <Label htmlFor="metaKeywords">Từ khóa Meta</Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p className="text-sm">Các từ khóa liên quan đến bài viết, cách nhau bằng dấu phẩy.</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {metaKeywords.map((keyword, index) => (
                      <Badge key={index} className="flex items-center gap-1">
                        {keyword}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMetaKeyword(keyword)}
                          className="text-xs hover:bg-red-600 rounded-full h-4 w-4 inline-flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    id="metaKeywords" 
                    value={metaKeywordInput} 
                    onChange={(e) => setMetaKeywordInput(e.target.value)} 
                    onKeyDown={handleAddMetaKeyword} 
                    placeholder="Nhập từ khóa và nhấn Enter" 
                  />
                </div>
                
                <div>
                  <div className="flex items-center">
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <p className="text-sm">URL gốc của bài viết. Sử dụng khi có nhiều URL trỏ đến cùng một nội dung.</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input 
                    id="canonicalUrl" 
                    value={canonicalUrl} 
                    onChange={(e) => setCanonicalUrl(e.target.value)} 
                    placeholder="https://annamvillage.vn/blog/your-post" 
                  />
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-sky-500" />
                  <h3 className="font-medium">SEO Preview</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sky-600 text-base font-medium">
                    {metaTitle || title || "Tiêu đề bài viết của bạn"}
                  </p>
                  <p className="text-green-700 text-sm">
                    annamvillage.vn/blog/{slug || "duong-dan-bai-viet"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {metaDescription || excerpt || "Mô tả bài viết của bạn sẽ xuất hiện ở đây..."}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang Tạo...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Bài Viết
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlogPostModal;
