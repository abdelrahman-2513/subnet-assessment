import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginated-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.css']
})
export class PaginatedListComponent {
  @Input() totalCount = 0;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get hasNextPage(): boolean {
    return this.pageNumber < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.pageNumber > 1;
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.pageNumber;
    const pagesToShow: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pagesToShow.push(i);
    } else {
      if (current <= 3) {
        pagesToShow.push(1, 2, 3, 4, total);
      } else if (current >= total - 2) {
        pagesToShow.push(1, total - 3, total - 2, total - 1, total);
      } else {
        pagesToShow.push(1, current - 1, current, current + 1, total);
      }
    }

    return [...new Set(pagesToShow)];
  }

  changePage(page: number) {
    console.log('changePage', page);
    if (page !== this.pageNumber && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    if (this.hasNextPage) this.pageChange.emit(this.pageNumber + 1);
  }

  prevPage() {
    if (this.hasPreviousPage) this.pageChange.emit(this.pageNumber - 1);
  }
}
