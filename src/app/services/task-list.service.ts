import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  constructor(private httpClient: HttpClient) { }

  getTasks() {
    return this.httpClient.get('assets/tasks.json');
  }

  deleteTask() {
    // mock delete from backend
  }

  addTask() {
    // mock add to backend
  }

  editTask() {
    // mock edit task backend
  }
}
