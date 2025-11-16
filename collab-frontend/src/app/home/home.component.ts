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
    if (!this.joinRoomId.trim()) return alert('Enter room ID');
    this.router.navigate(['/room', this.joinRoomId]);
  }
}
