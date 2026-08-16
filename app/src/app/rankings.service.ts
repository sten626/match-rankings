import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Player } from './player';
import { Observable } from 'rxjs';

@Service()
export class RankingsService {
  private http = inject(HttpClient);

  getRankings(): Observable<Player[]> {
    return this.http.get<Player[]>('/api/players');
  }
}
