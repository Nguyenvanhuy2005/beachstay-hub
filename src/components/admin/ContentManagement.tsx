
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ExternalLink, ImageIcon } from 'lucide-react';
import AddBlogPostModal from './AddBlogPostModal';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const ContentManagement = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
    ensureStorageBucketExists();
  }, []);

  const ensureStorageBucketExists = async () => {
    try {
      // Check if blog-images bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) throw error;
      
      const blogImagesBucketExists = buckets.some(bucket => bucket.name === 'blog-images');
      
      if (!blogImagesBucketExists) {
        console.log('Creating blog-images bucket');
        // Create blog-images bucket
        const { error: createError } = await supabase.storage.createBucket('blog-images', {
          public: true
        });
        
        if (createError) throw createError;
        console.log('Blog images bucket created successfully');
      }
    } catch (error) {
      console.error('Error ensuring storage bucket exists:', error);
    }
  };

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching blog posts...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Blog posts fetched:', data?.length || 0);
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Không thể tải dữ liệu bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Đã xóa bài viết thành công');
      fetchContent();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Không thể xóa bài viết');
    } finally {
      setPostToDelete(null);
    }
  };

  const togglePublished = async (id: string, currentValue: boolean) => {
    try {
      const updates = {
        published: !currentValue,
        published_at: !currentValue ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Bài viết đã được ${!currentValue ? 'xuất bản' : 'chuyển về bản nháp'}`);
      fetchContent();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Không thể cập nhật trạng thái bài viết');
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const countImagesInHTML = (html: string) => {
    if (!html) return 0;
    const regex = /<img[^>]+>/g;
    const matches = html.match(regex);
    return matches ? matches.length : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quản Lý Nội Dung</h3>
        <div className="space-x-2">
          <Button onClick={fetchContent} variant="outline" size="sm">
            Làm mới
          </Button>
          <Button onClick={() => setAddModalOpen(true)} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Tạo bài viết mới
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : blogPosts.length === 0 ? (
        <div className="text-center py-12 bg-muted/40 rounded-md">
          <h3 className="text-lg font-medium mb-2">Chưa có bài viết nào</h3>
          <p className="text-muted-foreground mb-4">Hãy tạo bài viết đầu tiên cho trang web của bạn</p>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Tạo bài viết mới
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Media</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{truncateText(post.title, 40)}</div>
                      <div className="text-xs text-muted-foreground mt-1">/blog/{post.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{formatDate(post.published_at || post.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge 
                        className={`${post.published ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}`}
                      >
                        {post.published ? 'Đã đăng' : 'Bản nháp'}
                      </Badge>
                      <Button 
                        onClick={() => togglePublished(post.id, post.published)}
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-8"
                      >
                        {post.published ? 'Chuyển về nháp' : 'Xuất bản'}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center cursor-pointer">
                          <ImageIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">
                            {post.featured_image ? '1' : '0'} + 
                            {post.gallery_images?.length || 0} + 
                            {countImagesInHTML(post.content)}
                          </span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Hình ảnh trong bài viết</p>
                          <div className="text-sm">
                            <p>Ảnh đại diện: {post.featured_image ? '1' : '0'}</p>
                            <p>Thư viện ảnh: {post.gallery_images?.length || 0}</p>
                            <p>Ảnh trong nội dung: {countImagesInHTML(post.content)}</p>
                          </div>
                          {post.featured_image && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Ảnh đại diện:</p>
                              <img 
                                src={post.featured_image} 
                                alt="Featured" 
                                className="w-full h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4 mr-1" /> Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => setPostToDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Xóa
                      </Button>
                      {post.published && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          asChild
                        >
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" /> Xem
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddBlogPostModal 
        open={addModalOpen} 
        onOpenChange={setAddModalOpen} 
        onPostAdded={fetchContent} 
      />

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => postToDelete && handleDeletePost(postToDelete)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentManagement;
