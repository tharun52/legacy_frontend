import { Component, OnInit } from '@angular/core';
import { BlogService, Post } from 'src/services/blog.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  selectedPost: Post | null = null;
  showForm = false;
  editPost: Post | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.blogService.getPosts().subscribe(posts => this.posts = posts);
  }

  selectPost(post: Post): void {
    this.selectedPost = post;
    this.showForm = false;
  }

  openCreateForm(): void {
    this.editPost = null;
    this.showForm = true;
    this.selectedPost = null;
  }

  openEditForm(post: Post): void {
    this.editPost = { ...post };
    this.showForm = true;
    this.selectedPost = null;
  }

  deletePost(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Delete this post?')) return;
    this.blogService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(p => p.id !== id);
      if (this.selectedPost && this.selectedPost.id === id) {
        this.selectedPost = null;
      }
    });
  }

  onPostSaved(): void {
    this.showForm = false;
    this.loadPosts();
  }

  onCancel(): void {
    this.showForm = false;
  }
}
