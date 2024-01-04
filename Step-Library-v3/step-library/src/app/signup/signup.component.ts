import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  data = {
    api_token: environment.API_TOKEN,
    username: '',
    password: '',
    confirm_password: '',
  };

  constructor(private router: Router) {}

  onSignup(event: Event): void {
    event.preventDefault();

    if (
      this.data.username.length > 0 &&
      this.data.password.length > 0 &&
      this.data.confirm_password.length > 0
    ) {
      if (this.data.password === this.data.confirm_password) {
        const params = JSON.stringify(this.data);
        fetch('http://172.104.166.110:8008/api/FT_SD_A_3/register.php', {
          method: 'POST',
          body: params,
        })
          .then((res) => {
            if (res.ok) {
              // Check for a specific response indicating username/password already created
              if (res.status === 409) {
                this.updateMessageInfo;
              } else {
                this.showSuccessAlert();
                setTimeout(() => {
                  this.router.navigateByUrl('/login');
                }, 2000);
              }
            } else {
              this.updateMessageInfo(); // Default error message
            }
            return res.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error('Error:', error);
            this.updateMessageInfo(); // Default error message
          });
      } else {
        this.updateMessageInfo(); // Default error message
      }
    } else {
      this.updateMessageInfo(); // Default error message
    }
  }

  updateMessageInfo(errorType: string = 'default'): void {
    let errorMessage: string;

    switch (errorType) {
      case 'userExists':
        errorMessage =
          'User with this username already exists. Please choose a different one.';
        break;
      default:
        errorMessage = 'Something went wrong!';
        break;
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
  }

  onLogin(): void {
    this.router.navigateByUrl('/login');
  }

  showSuccessAlert(): void {
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful!',
      text: 'Your account has been created successfully.',
    });
  }
}
