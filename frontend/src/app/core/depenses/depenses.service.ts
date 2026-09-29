import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../config';
import { Depense, DepenseSaisie, FiltreDepenses } from './depense.model';

/** Appels à l'API /depenses (le token est ajouté par l'intercepteur) */
@Injectable({ providedIn: 'root' })
export class DepensesService {
  private http = inject(HttpClient);
  private url = `${API_URL}/depenses`;

  lister(filtre: FiltreDepenses = {}) {
    // Seuls les filtres renseignés sont envoyés : ?du=...&au=...&categorie=...
    let params = new HttpParams();
    for (const [cle, valeur] of Object.entries(filtre)) {
      if (valeur) params = params.set(cle, valeur);
    }
    return this.http.get<Depense[]>(this.url, { params });
  }

  creer(saisie: DepenseSaisie) {
    return this.http.post<Depense>(this.url, saisie);
  }

  modifier(id: string, saisie: Partial<DepenseSaisie>) {
    return this.http.patch<Depense>(`${this.url}/${id}`, saisie);
  }

  supprimer(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
