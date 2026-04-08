import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { BlogService, Post, Comment } from 'src/services/blog.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit, OnChanges {
  @Input() post: Post;
  @Output() edit = new EventEmitter<Post>();
  @Output() deleted = new EventEmitter<number>();
  @Output() back = new EventEmitter<void>();

  comments: Comment[] = [];
  newComment: Comment = { content: '', author: '' };

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnChanges(): void {
    this.loadComments();
  }

  loadComments(): void {
    if (this.post && this.post.id) {
      this.blogService.getComments(this.post.id).subscribe(c => this.comments = c);
    }
  }

  addComment(): void {
    if (!this.newComment.content.trim()) return;
    if (!this.newComment.author.trim()) this.newComment.author = 'Anonymous';
    this.blogService.createComment(this.post.id, this.newComment).subscribe(c => {
      this.comments.push(c);
      this.newComment = { content: '', author: '' };
    });
  }

  removeComment(commentId: number | undefined): void {
    if (!commentId) return;
    this.blogService.deleteComment(this.post.id, commentId).subscribe(() => {
      this.comments = this.comments.filter(c => c.id !== commentId);
    });
  }
}
