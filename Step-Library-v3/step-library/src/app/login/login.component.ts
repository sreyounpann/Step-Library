import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  [x: string]: any;
  data = {
    api_token: environment.API_TOKEN,
    username: '',
    password: '',
  };

  whenFieldsNotInput = '';
  errorMessage = '';

  resetLoginForm() {
    this.whenFieldsNotInput = '';
    this.errorMessage = '';
  }

  constructor(private router: Router, private route: ActivatedRoute) {}
  onLogin(event: Event): void {
    // console.log('Login button clicked');
    event.preventDefault();

    if (this.data.username.length > 0 && this.data.password.length > 0) {
      const params = JSON.stringify(this.data);

      fetch('http://172.104.166.110:8008/api/FT_SD_A_3/login.php', {
        method: 'POST',
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
          if (data.status === 'SUCCESS') {
            console.log(data);
            Swal.fire({
              title: 'Login Successful',
              text: 'You have successfully logged in.',
              icon: 'success',
            });
            this.router.navigate(['/homepage'], {
              queryParams: {
                username: this.data.username,
                student_token: data.token,
              },
              replaceUrl: true,
              relativeTo: this.route,
            });
          } else if (data.status === 'USER_NOT_FOUND') {
            Swal.fire({
              title: 'Login Failed',
              text: 'User not found. Please check your username and try again.',
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Login Failed',
              text: 'Invalid username or password. Please check your login details again.',
              icon: 'error',
            });
          }
        })
        .catch((error) => {
          console.error('Error during login:', error);
          this.errorMessage = 'An error occurred during login.';
        });
    } else {
      this.whenFieldsNotInput = 'border border-danger';
      this.errorMessage = 'Invalid fields';
    }
  }

  onSignup() {
    this.router.navigate(['/signup'], {
      replaceUrl: true,
      relativeTo: this.route,
    });
  }
}
