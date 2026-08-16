import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { RankingsService } from '../rankings.service';
import { Player } from '../player';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-rankings',
  imports: [AsyncPipe, MatTableModule],
  templateUrl: './rankings.html',
  styleUrl: './rankings.scss',
})
export class Rankings {
  players$: Observable<Player[]>;
  private rankingsService = inject(RankingsService);

  constructor() {
    this.players$ = this.rankingsService.getRankings();
  }
}
