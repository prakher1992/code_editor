import { Component, ElementRef, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { EditorState } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styles: [`.editor { height: 70vh; border: 1px solid #ddd; }`]
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: false }) editorHost!: ElementRef;
  view: EditorView | null = null;
  socket: Socket | null = null;

  roomId = '';
  username = '';
  joined = false;
  backend = 'http://localhost:3000';
  ignoreRemote = false;

  // store content here until editorHost is ready
  private initialContent = '';

  aiInput: string = '';
  aiOutput: string = '';


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.roomId = id ?? '';
  }

  ngAfterViewInit() {
    // If initialContent was already set before view init, and joined is true, init now
    if (this.joined && this.initialContent !== '') {
      this.initEditor(this.initialContent);
    }
  }

  join() {
    if (!this.username.trim()) {
      alert('Enter username');
      return;
    }
    this.socket = io(this.backend);

    this.socket.on('room-not-found', ({ roomId }) => {
        alert(`Room "${roomId}" not found. Returning to home.`);
        // cleanup socket and navigate back
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }
        this.router.navigate(['/']);
    });

    this.socket.on('room-error', (payload) => {
      alert(payload.message || 'Room error');
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      this.router.navigate(['/']);
    });


    this.socket.on('room-content', ({ content }: { content: string }) => {
      this.initialContent = content ?? '';

      // Now set joined *first*, so Angular renders the editorHost div
      this.joined = true;

      // Then, wait for next microtask so view updates
      setTimeout(() => {
        if (this.editorHost) {
          this.initEditor(this.initialContent);
        } else {
          console.error('editorHost still not available after join');
        }
      });
    });

    this.socket.on('remote-doc-change', ({ content }: { content: string }) => {
      if (!this.view) return;
      this.ignoreRemote = true;
      const current = this.view.state.doc.toString();
      if (current !== content) {
        this.view.dispatch({
          changes: { from: 0, to: current.length, insert: content }
        });
      }
      setTimeout(() => this.ignoreRemote = false, 20);
    });

    this.socket.emit('join-room', { roomId: this.roomId, username: this.username });
  }

  initEditor(initialText: string) {
    const state = EditorState.create({
      doc: initialText,
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged && !this.ignoreRemote && this.socket) {
            const newText = v.state.doc.toString();
            this.socket!.emit('doc-change', { roomId: this.roomId, content: newText });
          }
        })
      ]
    });

    this.view = new EditorView({
      state,
      parent: this.editorHost.nativeElement
    });
  }

  leave() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.view) {
      this.view.destroy();
    }
  }

  generateSuggestion() {
    const codeToSend = this.aiInput.trim() || this.view?.state.doc.toString() || "";

    if (!codeToSend) {
      alert("Nothing to analyze!");
      return;
    }

    this.http.post<any>(`${this.backend}/api/complete`, { code: codeToSend })
      .subscribe({
        next: (res) => {
          this.aiOutput = res.suggestion || "No suggestion received.";
        },
        error: () => {
          alert("Gemini API error");
        }
      });
  }


}
