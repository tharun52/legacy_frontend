import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BlogService, Post } from 'src/services/blog.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  @Input() post: Post | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form: Post = { title: '', content: '', author: '' };
  isEdit = false;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    if (this.post) {
      this.form = { ...this.post };
      this.isEdit = true;
    }
  }

  submit(): void {
    if (!this.form.title.trim() || !this.form.content.trim()) return;
    if (!this.form.author.trim()) this.form.author = 'Anonymous';

    if (this.isEdit && this.form.id) {
      this.blogService.updatePost(this.form.id, this.form).subscribe(() => this.saved.emit());
    } else {
      this.blogService.createPost(this.form).subscribe(() => this.saved.emit());
    }
  }
}
