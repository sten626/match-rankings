import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { RankingsService } from '../rankings.service';
import { AsyncPipe } from '@angular/common';
import { Player } from '../player';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

export interface Record {
  name: string;
  rating: number;
  rd: number;
}

// const DUMMY_DATA: Record[] = [
//   { name: 'Steven', rating: 1500, rd: 200 },
//   { name: 'Alice', rating: 1600, rd: 150 },
//   { name: 'Bob', rating: 1400, rd: 250 },
//   { name: 'Charlie', rating: 1700, rd: 100 },
// ];

@Component({
  selector: 'app-rankings',
  imports: [MatTableModule],
  templateUrl: './rankings.html',
  styleUrl: './rankings.scss',
})
export class Rankings {
  dataSource: PlayerDataSource;
  // dataSource = DUMMY_DATA;
  private rankingsService = inject(RankingsService);

  constructor() {
    this.dataSource = new PlayerDataSource(this.rankingsService);
  }
}

class PlayerDataSource extends DataSource<Player> {
  constructor(private rankingsService: RankingsService) {
    super();
  }

  override connect(): Observable<readonly Player[]> {
    return this.rankingsService.getRankings();
  }
  override disconnect(): void {}
}
