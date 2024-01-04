import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-bookslist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookslist.component.html',
  styleUrl: './bookslist.component.css',
})
export class BookslistComponent {
  data = {
    api_token: environment.API_TOKEN,
    student_token: '',
    // groupId: '',
  };

  username = '';
  bookAvailable = true;
  books: Array<Book> = new Array<Book>();

  constructor(private route: ActivatedRoute, private router: Router) {
    this.loadBooks();
  }

  loadBooks() {
    this.route.queryParams.subscribe((params) => {
      this.data.student_token = params['student_token'];
      this.username = params['username'];

      // this.data.groupId = params['groupId'];
      // console.log(this.data.student_Token);
      // console.log(this.username);
      // console.log(this.data.api_token);
      // console.log(params);
    });

    this.bookAvailable = true;
    const params = new URLSearchParams(this.data).toString();
    fetch(` http://172.104.166.110:8008/api/FT_SD_A_3/books.php`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        console.log(data);
        this.books = data.map((b: Book) => {
          return {
            id: b.id,
            title: b.title,
            path: b.path,
            image: `http://172.104.166.110:8008/images/${b.title
              .substring(0, 8)
              .toLowerCase()}.png`,
          };
        });
      });

    this.bookAvailable = false;
  }

  leaveGroup() {
    const params = new URLSearchParams(this.data).toString();
    fetch('http://172.104.166.110:8008/api/FT_SD_A_3/unsubscribe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        console.log(data);
        this.router.navigate(['/homepage'], {
          queryParams: {
            student_token: this.data.student_token,
            username: this.username,
          },
          skipLocationChange: true,
        });
      });
  }
}
interface Book {
  id: number;
  title: string;
  groupId: number;
  image: string;
  path: string;
}
