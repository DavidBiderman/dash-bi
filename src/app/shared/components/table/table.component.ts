import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  readonly rows = [ 
    {
      id: "1234",
      firstName: "Edna",
      lastName: "Fried",
      term: 6,
      selected: false,
    },
    {
      id: "3456",
      firstName: "Michael",
      lastName: "Asner",
      term: 2,
      selected: false,
    },
    {
      id: "9287",
      firstName: "Eric",
      lastName: "Bronze",
      selected: false,
      term: 0.8,
    },
    {
      id: "1029",
      firstName: "Joseph",
      lastName: "Michaels",
      selected: false,
      term: 2
    },
    {
      id: "8374",
      firstName: "Adrian",
      lastName: "Romano",
      selected: false,
      term: 6
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  toggleSelected(row: any) {
    if (row.selected) {
      row.selected = false;
    } else {
      this.rows.forEach(row => row.selected = false);
      row.selected = true;
    }
  }
}
