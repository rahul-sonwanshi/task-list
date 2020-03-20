import { TaskListService } from './../../services/task-list.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatInput, MatList, MatButton, MatSelectChange, MatIcon, MatSelect, MatCheckbox, MatSelectionListChange } from "@angular/material";
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  selectedOptions;
  showAddTask;
  showEditInputs = [];
  tasks = [];
  previouslySelectedItems = [];
  filteredSearch;
  subscription: Subscription;
  public selectMultiSearch: FormControl = new FormControl();
  public searchInput: FormControl = new FormControl();
  public addTaskInput: FormControl = new FormControl();

  constructor(private taskListService: TaskListService) { 
    
  }

  ngOnInit() {
    this.taskListService.getTasks()
      .subscribe(data => {
        this.tasks = data['list'];
        this.filteredSearch = this.tasks;
    });

    this.subscription = this.searchInput.valueChanges
      .subscribe(() => {
        this.filter();
    });
  }

  // destroy to prevent memory leaks
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addTask() {
    this.tasks.push(this.addTaskInput.value);
    this.addTaskInput.setValue("");
    this.showAddTask = false;
    this.filteredSearch = this.tasks;
    this.taskListService.addTask(); // mock add
  }

  addTaskKeyDownEvent(event) {
    //optimistic update
    if(event.keyCode == 13) {
      this.addTask();
    }
  }

  editTask(event, editTaskInput, index) {
    //optimistic update
    if(event.keyCode == 13) {
      this.tasks[index] = editTaskInput.value;
      this.showEditInputs[index] = false;
      this.taskListService.editTask(); // mock backend call
      // rest of your code
    }
  }

  deleteTask(index) {
    //optimistic update
    this.tasks.splice(index, 1);
    this.taskListService.deleteTask(); //id will be passed mock delete
  }

  // Simple filter to check if search string matches
  private filter() {
    if (!this.tasks) {
      return;
    }
    // get the search keyword
    let search = this.searchInput.value;

    this.selectMultiSearch.setValue(this.previouslySelectedItems); // ---
    this.filteredSearch = 
      this.tasks.filter(task => task.toLowerCase().indexOf(search.toLowerCase()) > -1);
      
  }

  /*
   * Filtering the mat-option causes already selected mat options to be removed
   * in order to avoid that we store previous value and check if they are present
   * in the current search if not we restore the values.
   */
  onSelection(event: MatSelectionListChange, selectedOptions) {
    console.log(this.selectMultiSearch.value,event.source);
      let restoreSelectedValues = false;
      if(this.searchInput.value && this.searchInput.value.length
        && this.previouslySelectedItems && Array.isArray(this.previouslySelectedItems)) {
            if(!this.selectMultiSearch.value || !Array.isArray(this.selectMultiSearch.value)) {
              this.selectMultiSearch.setValue([]);
            }
            const optionValues = event.source.options.map(option => option.value);
            this.previouslySelectedItems.forEach(previousValue => {
              
              //check if previous value should be restored
              if(this.selectMultiSearch.value.indexOf(previousValue) === -1 && optionValues.indexOf(previousValue) === -1){
                this.selectMultiSearch.value.push(previousValue);
                restoreSelectedValues = true;
              }
            });
          }

          if(restoreSelectedValues) {
            event.source._value = this.selectMultiSearch.value;
          }

          this.previouslySelectedItems = this.selectMultiSearch.value;
  }
}
