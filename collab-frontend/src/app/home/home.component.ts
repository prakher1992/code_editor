import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  backend = 'http://localhost:3000';
  joinRoomId = '';

  constructor(private http: HttpClient, private router: Router) {}

  createRoom() {
    this.http.post<any>(`${this.backend}/create-room`, { content: '' })
      .subscribe(res => this.router.navigate(['/room', res.roomId]));
  }

  joinRoom() {
  const id = this.joinRoomId?.trim();
  if (!id) { alert('Enter room ID'); return; }

  this.http.get<any>(`${this.backend}/validate-room/${id}`).subscribe({
    next: (res) => {
      if (res.exists) {
        this.router.navigate(['/room', id]);
      } else {
        alert('Room does not exist');
      }
    },
    error: (err) => {
      if (err.status === 404) {
        alert('Room does not exist');
      } else {
        console.error(err);
        alert('Server error while validating room');
      }
    }
  });
}
}
