import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface Record {
  name: string;
  rating: number;
  rd: number;
}

const DUMMY_DATA: Record[] = [
  { name: 'Steven', rating: 1500, rd: 200 },
  { name: 'Alice', rating: 1600, rd: 150 },
  { name: 'Bob', rating: 1400, rd: 250 },
  { name: 'Charlie', rating: 1700, rd: 100 },
];

@Component({
  selector: 'app-rankings',
  imports: [MatTableModule],
  templateUrl: './rankings.html',
  styleUrl: './rankings.scss',
})
export class Rankings {
  dataSource = DUMMY_DATA;
}
