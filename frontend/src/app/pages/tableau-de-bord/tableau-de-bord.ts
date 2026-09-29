import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { DepenseFormulaire } from '../../components/depense-formulaire/depense-formulaire';
import { AuthService } from '../../core/auth/auth.service';
import { CATEGORIES, Categorie, Depense, STYLE_CATEGORIE } from '../../core/depenses/depense.model';
import { DepensesService } from '../../core/depenses/depenses.service';
import { messageErreur } from '../../core/erreur-api';
import { ajouterMois, bornesDuMois, formatEuros, formatJour, formatMois } from '../../core/format';

@Component({
  selector: 'app-tableau-de-bord',
  imports: [DepenseFormulaire],
  templateUrl: './tableau-de-bord.html',
  styleUrl: './tableau-de-bord.scss',
})
export class TableauDeBord implements OnInit {
  protected auth = inject(AuthService);
  private service = inject(DepensesService);

  // Helpers utilisables dans le template
  protected readonly categories = CATEGORIES;
  protected readonly style = STYLE_CATEGORIE;
  protected readonly euros = formatEuros;
  protected readonly jour = formatJour;

  // ----- Filtres -----
  protected mois = signal(ajouterMois(new Date(), 0)); // 1er du mois courant
  protected categorie = signal<Categorie | null>(null);
  protected libelleMois = computed(() => formatMois(this.mois()));
  protected estMoisCourant = computed(
    () => this.mois().getTime() === ajouterMois(new Date(), 0).getTime(),
  );

  // ----- Données -----
  protected depenses = signal<Depense[]>([]);
  protected chargement = signal(true);
  protected erreur = signal<string | null>(null);

  // ----- Résumé (recalculé automatiquement quand la liste change) -----
  protected total = computed(() => this.depenses().reduce((somme, d) => somme + d.montant, 0));
  protected categoriePrincipale = computed(() => {
    const totaux = new Map<Categorie, number>();
    for (const d of this.depenses()) totaux.set(d.categorie, (totaux.get(d.categorie) ?? 0) + d.montant);
    const [premiere] = [...totaux.entries()].sort((a, b) => b[1] - a[1]);
    return premiere ? { nom: premiere[0], montant: premiere[1] } : null;
  });

  // ----- Formulaire et suppression -----
  protected formulaireOuvert = signal(false);
  protected enEdition = signal<Depense | null>(null);
  protected aConfirmer = signal<string | null>(null);

  private requeteEnCours?: Subscription;

  ngOnInit() {
    this.charger();
  }

  charger() {
    // Annule la requête précédente : si on change vite de mois, seule la dernière réponse compte
    this.requeteEnCours?.unsubscribe();
    this.chargement.set(true);
    this.erreur.set(null);

    this.requeteEnCours = this.service
      .lister({ ...bornesDuMois(this.mois()), categorie: this.categorie() ?? undefined })
      .subscribe({
        next: (depenses) => {
          this.depenses.set(depenses);
          this.chargement.set(false);
        },
        error: (e) => {
          this.erreur.set(messageErreur(e));
          this.chargement.set(false);
        },
      });
  }

  changerMois(decalage: number) {
    this.mois.set(ajouterMois(this.mois(), decalage));
    this.charger();
  }

  revenirAuMoisCourant() {
    this.mois.set(ajouterMois(new Date(), 0));
    this.charger();
  }

  filtrer(categorie: Categorie | null) {
    this.categorie.set(categorie);
    this.charger();
  }

  ouvrirAjout() {
    this.enEdition.set(null);
    this.formulaireOuvert.set(true);
  }

  ouvrirModification(depense: Depense) {
    this.enEdition.set(depense);
    this.formulaireOuvert.set(true);
  }

  fermerFormulaire() {
    this.formulaireOuvert.set(false);
    this.enEdition.set(null);
  }

  apresEnregistrement() {
    this.fermerFormulaire();
    this.charger();
  }

  supprimer(depense: Depense) {
    this.service.supprimer(depense.id).subscribe({
      next: () => {
        // Mise à jour immédiate de l'écran, sans recharger toute la liste
        this.depenses.update((liste) => liste.filter((d) => d.id !== depense.id));
        this.aConfirmer.set(null);
      },
      error: (e) => this.erreur.set(messageErreur(e)),
    });
  }
}
