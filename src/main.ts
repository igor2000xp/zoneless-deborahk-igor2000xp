import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h3>Simple property set in an event</h3>
    <div>Counter: {{ counter }}</div>
    <button (click)='incrementCounter()'>Increment</button>

    <h3>Simple property set asynchronously</h3>
    <div>Tick: {{ tick }}</div>

    <!-- <h3>Data retrieved from HTTP and stored in an array</h3>
    @for(member of members; track member.id) {
      <div>{{ member.name }}</div>
    } -->

    <!-- <h3>Data retrieved from HTTP with async pipe</h3>
    @for(member of members$ | async; track member.id) {
      <div>{{ member.name }}</div>
    } -->

    <!-- <h3>Data retrieved from HTTP and stored in a signal</h3>
    @for(member of membersSignal(); track member.id) {
      <div>{{ member.name }}</div>
    } -->
  `,
})
export class App implements OnInit {
  name = 'Angular';
  teamUrl = "https://jsonplaceholder.typicode.com/users";

  // Simple property set in an event handler
  // The click handler schedules a change detection cycle
  // So on each click, the counter is correctly displayed
  counter = 0;
  incrementCounter() {
    this.counter += 1;
  }

  // Simple property set asynchronously
  // Won't automatically schedule change detection
  // unless it's changed to a signal
  tick = 0;
  //tick = signal(0);
  //cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    setInterval(() => {
      this.tick += 1;
      //this.cdr.markForCheck();
      //this.tick.update(c => c += 1);
    },1000);
  }

  // Data retrieved from HTTP and stored in an array
  members: Member[] = [];
  http= inject(HttpClient);

  // This does NOT cause change detection
  // The data won't appear until the user clicks the button
  // The click handler schedules a change detection cycle
  sub = this.getData().subscribe(
    m => this.members = m
  );

  // Data retrieved from HTTP with async pipe
  // The async pipe schedules change detection when an
  // item is emitted into the observable
  members$ = this.getData();

  // Data retrieved from HTTP and stored in a signal
  // Provides a notification to all "readers"
  membersSignal = toSignal(this.getData(), {initialValue:[] });

  getData() {
    return this.http.get<Member[]>(this.teamUrl)
  }

}

bootstrapApplication(App, appConfig);

export interface Member {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
}