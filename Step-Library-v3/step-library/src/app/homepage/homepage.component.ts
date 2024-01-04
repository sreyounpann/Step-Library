import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  data = {
    api_token: environment.API_TOKEN,
    group_id: '',
    student_token: '',
  };
  groups: Array<Group> = new Array<Group>();
  username: string = '';
  constructor(private router: Router, private route: ActivatedRoute) {
    this.getListGroup();
  }

  getListGroup() {
    this.route.queryParams.subscribe((params) => {
      this.username = params['username'];
      this.data.student_token = params['student_token'];
      console.log(this.data.student_token);
      if (params['username'] != null) this.username = params['username'];
    });

    fetch(
      `http://172.104.166.110:8008/api/FT_SD_A_3/groups.php?api_token=${environment.API_TOKEN}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        console.log('Groups data:', data);
        this.groups = data.groups.map((g: Group) => {
          return { id: g.id, name: g.name };
        });
        console.log('Mapped groups:', this.groups);
      });
  }

  subcribeGroup(groupId: number) {
    this.data.group_id = groupId.toString();
    const params = new URLSearchParams(this.data).toString();

    fetch('http://172.104.166.110:8008/api/FT_SD_A_3/subscribe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status == 'SUCCESS') {
          console.log(data);
          this.router.navigate(['/bookslist'], {
            queryParams: {
              student_token: this.data.student_token,
              username: this.username,
              skipLocationChange: true,
            },
          });
        }
      });
  }
}

interface Group {
  id: number;
  name: string;
}
