<template>
  <Header />
  <div class="container">
    <!-- Titres -->
    <div class="titles">
      <h1>Calcul avec bulletins</h1>
      <p>
        Renseignez les informations du salarié pour calculer l'ensemble des
        droits à la rupture
      </p>
    </div>

    <!-- Section Informations du salarié -->
    <section id="info-salarie" class="section-info">
      <div class="section-container">
        <h2>* Informations du salarié</h2>
        <div class="input-section">
          <div class="form-group">
            <label>Nom et Prénoms du salarié</label>
            <input type="text" v-model="nom" />
          </div>

          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="categorie">
              <option value="" disabled="" selected="">Sélectionner</option>
              <option value="ouvrier">Ouvrier</option>
              <option value="employe">Employé</option>
              <option value="agent_maitrise">Agent de maîtrise</option>
              <option value="cadre">Cadre</option>
              <option value="cadre_superieur">Cadre supérieur</option>
            </select>
          </div>

          <div class="form-group">
            <label>Type de contrat</label>
            <select v-model="typeContrat">
              <option value="">Sélectionner</option>
              <option value="cdi">CDI</option>
              <option value="cdd">CDD</option>
              <option value="saisonnier">Contrat saisonnier</option>
            </select>
          </div>

          <div class="form-group">
            <label>Mode de paiement</label>
            <select v-model="modePaiement">
              <option value="">Sélectionner</option>
              <option value="mois">Au mois</option>
              <option value="heure">À l'heure</option>
            </select>
          </div>

          <div class="form-group">
            <label>Salaire Minima Conventionnel Catégoriel (FCFA)</label>
            <input type="number" v-model="salaireMinCat" />
          </div>

          <div class="form-group">
            <label>Date d'embauche</label>
            <input type="date" v-model="dateEmbauche" />
          </div>
          <div class="form-group">
            <label>Date de rupture</label>
            <input type="date" v-model="dateRupture" />
          </div>
          <div class="form-group">
            <label>Date de retour du dernier congé</label>
            <input type="date" v-model="dateRetourConge" />
          </div>
          <div class="result-box" v-if="ancienneteDetail">
            <h3>Ancienneté Calculée</h3>

            <div v-if="ancienneteDetail.erreur" class="error-message">
              ⚠ {{ ancienneteDetail.erreur }}
            </div>

            <div v-else>
              <div class="result-item">
                <!-- <div class="icon">✓</div> -->
                <div>
                  Années complètes :
                  <span class="value">{{ ancienneteDetail.annees }} ans</span>
                </div>
              </div>
              <div class="result-item">
                <!-- <div class="icon">✓</div> -->
                <div>
                  Mois supplémentaires :
                  <span class="value">{{ ancienneteDetail.mois }} mois</span>
                </div>
              </div>
              <div class="result-item">
                <!-- <div class="icon">✓</div> -->
                <div>
                  Jours supplémentaires :
                  <span class="value">{{ ancienneteDetail.jours }} jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Salaires -->
    <section id="salaires">
      <div class="section-container">
        <h2>* Salaires des 12 derniers mois</h2>
        <p style="margin-top: 5px; color: #555">
          Calculer le Salaire Brut 12 mois (STB) & Salaire Moyen Mensuel Brut
          Imposable (SMMBI)
        </p>
        <div class="input-section">
          <input
            v-for="(s, index) in salaires"
            :key="index"
            type="number"
            v-model.number="salaires[index]"
            :placeholder="`Mois ${index + 1}`" />
          <button type="button" @click="remplirIdentique" class="btn-identique">
            Salaire identique
          </button>

          <!-- Résultats Salaires -->
          <div v-if="salaires.some((s) => s !== null)" class="result-box">
            <div class="result-item">
              <!-- <div class="icon">✓</div> -->
              <div>
                Total Salaire Brut 12 mois (STB) :
                <span class="value">{{ STB.toLocaleString() }} FCFA</span>
              </div>
            </div>
            <div class="result-item">
              <!-- <div class="icon">✓</div> -->
              <div>
                Salaire Moyen Mensuel Brut Imposable (SMMBI) :
                <span class="value">{{ SMMBI.toLocaleString() }} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Indemnité -->
    <h1 style="text-align: center; margin-bottom: 20px">
      I - CALCUL DES INDEMNITES
    </h1>
    <section id="indemnite-licenciement">
      <div class="section-container indem-licenciement">
        <h3 style="margin-bottom: 15px">I- INDEMNITÉ DE LICENCIEMENT</h3>
        <p class="section-hint">
          Veuillez indiquer le type de contrat, les dates d'embauche et de
          rupture et le Salaires des 12 derniers mois
        </p>
        <!-- CAS NON APPLICABLE -->
        <div v-if="typeContrat !== 'cdi'" class="info-message">
          ⚠ L’indemnité de licenciement s’applique uniquement aux contrats CDI.
        </div>
        <!-- CAS VALIDE -->
        <div
          class="result2"
          v-else-if="typeContrat === 'cdi' && ancienneteDetail && SMMBI">
          <h3>Résultats Indemnité de Licenciement</h3>
          <!-- Calcul par tranche -->
          <div class="result-item" v-for="(tranche, i) in tranches" :key="i">
            <!-- <div class="icon">✓</div> -->
            <div>
              Tranche {{ tranche.label }} ({{ tranche.taux * 100 }}%) :
              <span class="value">
                {{
                  tranche.montant.toLocaleString("fr-FR", {
                    maximumFractionDigits: 0,
                  })
                }}
                FCFA
              </span>
            </div>
          </div>
          <!-- Résultat principal -->
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div class="total">
              <strong>INDEMNITÉ DE LICENCIEMENT : </strong>
              <span class="value">
                {{
                  indemnite.toLocaleString("fr-FR", {
                    maximumFractionDigits: 0,
                  })
                }}
                FCFA
              </span>
            </div>
          </div>
          <!-- Base légale -->
          <h4 class="legal-title">Base légal</h4>
          <p class="legal-text">
            Art. 18.16 du Code du travail, Art. 39 de la CCNI et Décret n°
            2017-210
          </p>

          <!-- Méthode -->
          <h4 style="margin: 20px 0 10px 0">Méthodes de calcul</h4>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.4">
            ‣ 1 à 5 ans : SMMBI × 30% × durée<br />
            ‣ 6 à 10 ans : SMMBI × 35% × durée<br />
            ‣ > 10 ans : SMMBI × 40% × durée<br />
            ‣ Conversion : mois/12, jours/360
          </p>
        </div>
      </div>
    </section>
    <section id="conges-payes">
      <div class="section-container conge-box">
        <h3>II - INDEMNITÉ DE CONGÉS PAYÉS</h3>
        <p class="section-hint">
          Veuillez indiquer la date de retour dernier congé, la date de rupture
          et les salaires en dessous
        </p>
        <div class="input-section">
          <!-- Salaires -->
          <label>Salaires depuis dernier congés</label>
          <input
            v-for="(s, index) in salairesConge"
            :key="index"
            type="number"
            v-model.number="salairesConge[index]"
            :placeholder="`Mois ${index + 1}`" />

          <button @click="remplirIdentiqueConge" class="btn-identique">
            Salaire identique
          </button>

          <!-- Majorations -->
          <input
            type="number"
            placeholder="Nombre de mois de paie"
            v-model.number="nbMoisPaie" />
          <input
            type="number"
            v-model.number="joursMajorationMedaille"
            placeholder="Majoration médaille (jours)" />
          <input
            type="number"
            v-model.number="joursMajorationEnfant"
            placeholder="Majoration enfants (jours)" />

          <!-- RESULTATS -->
          <div v-if="dprJours > 0" class="result-box result2">
            <h3>Résultats Congés Payés</h3>

            <div class="result-item">
              DPR (jours) :
              <span class="value">{{ dprJours }}</span>
            </div>

            <div class="result-item">
              DPR (mois) :
              <span class="value">{{ dprMois.toFixed(2) }}</span>
            </div>

            <div class="result-item">
              Jours ouvrables (JO) :
              <span class="value">{{ joursOuvrables }}</span>
            </div>

            <div class="result-item">
              Jours calendaires (JC) :
              <span class="value">{{ joursCalendaires }}</span>
            </div>

            <div class="result-item">
              Majoration ancienneté :
              <span class="value">{{ majorationAnciennete }} jours</span>
            </div>

            <div class="result-item">
              Durée congé total :
              <span class="value">{{ dureeConge }} jours</span>
            </div>

            <div class="result-item">
              Salaire total période :
              <span class="value"
                >{{ totalSalairesPeriode.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>

            <div class="result-item">
              SMMBI période :
              <span class="value"
                >{{ smmbiPeriode.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>

            <div class="result-item">
              Salaire moyen journalier :
              <span class="value">
                {{
                  salaireJournalier.toLocaleString("fr-FR", {
                    maximumFractionDigits: 0,
                  })
                }}
                FCFA
              </span>
            </div>
            <!-- RESULTAT FINAL -->
            <div>
              <strong>INDEMNITÉ DE CONGÉS PAYÉS : </strong>
              <span class="value big">
                {{ indemniteConge.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
            <h4 class="legal-title">Bases légales</h4>

            <p class="legal-text">
              Article 25.1 à 25.7 du Code du travail<br />
              Articles 68 à 71 de la Convention Collective
              Interprofessionnelle<br />
              Décret n°98-39 du 28 janvier 1998 relatif au régime des congés
              payés
            </p>

            <h4 style="margin: 20px 0 10px 0">Méthodes de calcul</h4>

            <p style="font-size: 0.9rem; color: #555; line-height: 1.4">
              DPR = Date rupture – Date retour congé → en mois (jours ÷ 30)<br />
              JO = DPR × 2,2 (arrondi sup.)<br />
              JC = JO × 1,25 (arrondi sup.)<br />
              DC = JC + majorations<br />
              SMMBI = Salaires période ÷ mois de paie<br />
              SMJ = SMMBI ÷ 30<br />
              Indemnité = SMJ × DC
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Section Indemnité Préavis -->
    <section id="preavis">
      <div class="section-container preavis-box">
        <h3>C. INDEMNITÉ COMPENSATRICE DE PRÉAVIS</h3>
        <p class="section-hint">
          Veuillez indiquer la catégorie professionnelle et les Salaires des 12
          derniers mois
        </p>
        <div class="result-box result2" v-if="dureePreavis">
          <h3>Résultats Indemnité compensatrice de préavis</h3>
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              Salaire Moyen Mensuel (SMMBI) :
              <span class="value">
                {{ SMMBI.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>INDEMNITÉ COMPENSATRICE DE PRÉAVIS : </strong>
              <span class="value">
                {{ indemnitePreavis.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- Base légale -->
          <h4 class="legal-title">Bases légales</h4>
          <p class="legal-text">Art. 34 & 35 CCI • Art. 18.7 Code du travail</p>
          <!-- Méthode courte -->
          <h4 style="margin: 20px 0 10px 0">Méthodes de calcul</h4>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.4">
            Indemnité = SMMBI × durée du préavis (en mois)
          </p>
        </div>
      </div>
    </section>
    <!-- Section Aggravation Préavis -->
    <section id="aggravation-preavis">
      <div class="section-container aggravation-box">
        <h3>D.L’INDEMNITÉ DE L'AGGRAVATION DE PRÉAVIS</h3>
        <p class="section-hint">
          Veuillez indiquer le Mode de paiement et les Salaires des 12 derniers
          mois (SBMMI)
        </p>
        <div class="input-section">
          <div class="form-group">
            <label style="margin-bottom: 10px">Cas d'application</label>
            <select v-model="aggravationActive">
              <option :value="false">Non</option>
              <option :value="true">
                Oui (rupture pendant / autour du congé)
              </option>
            </select>
          </div>
        </div>

        <!-- Résultat -->
        <div class="result-box result2" v-if="aggravationActive">
          <h3>Résultat Indemnité de l'aggravation de préavis</h3>
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              Mode de paiement :
              <span class="value">
                {{ modePaiement === "mois" ? "Mensualisé" : "Non indiqué" }}
              </span>
            </div>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>INDEMNITÉ DE L'AGGRAVATION : </strong>
              <span class="value">
                {{ indemniteAggravation.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- Base légale -->
          <h4 class="legal-title">Base légale</h4>
          <p class="legal-text">
            Article 36 de la Convention Collective Interprofessionnelle
          </p>
          <!-- Méthode -->
          <h4 style="margin: 20px 0 10px 0">Méthodes de calcul</h4>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.4">
            Mensualisé : +2 mois de salaire<br />
            Horaire : +1 mois de salaire
          </p>
        </div>
      </div>
    </section>
    <!-- GRATIFICATION -->
    <section id="gratification">
      <div class="section-container gratification-box">
        <h3>E. GRATIFICATION</h3>

        <p class="section-hint">
          Veuillez indiquer Salaire Minima Conventionnel Catégoriel
        </p>

        <!-- INPUTS -->
        <div class="input-section">
          <div class="form-group">
            <label>Type de calcul</label>
            <select v-model="typeGratification">
              <option value="" disabled>Sélectionner</option>
              <option value="annuelle">Annuelle</option>
              <option value="prorata">Prorata temporis</option>
            </select>
          </div>
          <div class="form-group" v-if="typeGratification === 'prorata'">
            <label>Nombre de jours de référence</label>
            <input
              type="number"
              v-model.number="joursReference"
              placeholder="ex: 180" />
          </div>
        </div>

        <!-- RESULTAT -->
        <div class="result-box result2" v-if="gratification > 0">
          <h3>Résultats Gratification</h3>
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>GRATIFICATION : </strong>
              <span class="value"
                >{{ gratification.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>

          <!-- Base légale -->
          <h4 class="legal-title">Base légale</h4>
          <p class="legal-text">
            Art. 8 Code du travail et barème des salaires minimas conventionnels
            catégoriels. Le taux minimum de la gratification est de 75%.
          </p>

          <!-- Méthode -->
          <h4 style="margin: 20px 0 10px 0">Méthode de calcul</h4>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.4">
            ‣ Gratification annuelle : Salaire Minima Conventionnel × 75%<br />
            ‣ Gratification prorata temporis : Salaire Minima Conventionnel ×
            75% × (Jours de référence ÷ 360)
          </p>
        </div>
      </div>
    </section>
    <section id="rappel-prime">
      <div class="section-container indem-licenciement">
        <h3>F. RAPPEL DE PRIME D'ANCIENNETÉ</h3>

        <p class="section-hint">
          Indiquer: Dates d'embauche et de rupture, Salaire minima conventionnel
          catégoriel
        </p>

        <!-- ERREUR -->
        <div v-if="ancienneteDetail?.erreur" class="info-message">
          ⚠ {{ ancienneteDetail.erreur }}
        </div>

        <!-- RESULTAT -->
        <div
          v-else-if="dateEmbauche && dateRupture && salaireMinCat"
          class="result-box result2">
          <!-- NON ELIGIBLE -->
          <div v-if="ancienneteDetail.annees < 2" class="info-message">
            ⚠ Ancienneté < 2 ans → pas de rappel.
          </div>

          <!-- RESULTAT -->
          <div v-else>
            <h3>Résultats Rappel de Prime d'Ancienneté</h3>
            <!-- Salaire -->
            <div class="result-item">
              <!-- <div class="icon">✓</div> -->
              <div>
                Salaire minimum :
                <span class="value"
                  >{{ salaireMinCat.toLocaleString("fr-FR") }} FCFA</span
                >
              </div>
            </div>

            <!-- Ancienneté -->
            <div class="result-item">
              <!-- <div class="icon">✓</div> -->
              <div>
                Ancienneté :
                <span class="value">{{ ancienneteDetail.annees }} ans</span>
              </div>
            </div>

            <!-- DETAIL -->
            <h4 style="margin: 20px 0">Détail par tranche</h4>

            <div
              v-for="(item, i) in tranchesRappel"
              :key="i"
              class="result-item">
              <!-- <div class="icon">✓</div> -->
              <div>
                {{ item.label }} → {{ item.taux }}% × {{ item.mois }} mois :
                <span class="value">
                  {{ item.montant.toLocaleString("fr-FR") }} FCFA
                </span>
              </div>
            </div>

            <!-- TOTAL -->
            <div class="result-item highlight">
              <!-- <div class="icon">✓</div> -->
              <div>
                <strong>TOTAL RAPPEL : </strong>
                <span class="value">
                  {{ totalRappel.toLocaleString("fr-FR") }} FCFA
                </span>
              </div>
            </div>
          </div>
          <!-- BASE LEGALE -->
          <h4 class="legal-title">Base légale</h4>
          <p class="legal-text">
            Article 55 de la Convention Collective Interprofessionnelle (CCI)
          </p>
          <h4 style="margin: 20px 0 10px 0">Méthode de calcul</h4>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.4">
            ‣ Le rappel est calculé sur les 2 dernières années (24 mois).<br />
            ‣ Le taux de la prime évolue chaque année selon l’ancienneté.<br />
            ‣ Chaque période est calculée séparément (année par année).<br />
            ‣ Montant = Taux × Salaire minimum × nombre de mois.<br />
            ‣ Le total correspond à la somme des montants de chaque tranche.
          </p>
        </div>
      </div>
    </section>
    <section id="recapitulatif">
      <div class="section-container recap-box">
        <h2 style="text-align: center">RÉCAPITULATIF TOTAL DES INDEMNITÉS</h2>
        <div style="margin-top: 20px">
          <!-- Indemnité de licenciement -->
          <div class="result-item" v-if="indemnite > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Indemnité de licenciement :
              <span class="value"
                >{{
                  indemnite.toLocaleString("fr-FR", {
                    maximumFractionDigits: 0,
                  })
                }}
                FCFA</span
              >
            </div>
          </div>

          <!-- Indemnité compensatrice de congés payés -->
          <div class="result-item" v-if="indemniteConge > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Indemnité compensatrice de congés payés :
              <span class="value"
                >{{ indemniteConge.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>

          <!-- Indemnité compensatrice de préavis -->
          <div class="result-item" v-if="indemnitePreavis > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Indemnité compensatrice de préavis :
              <span class="value"
                >{{ indemnitePreavis.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>

          <!-- Indemnité d'aggravation de préavis -->
          <div
            class="result-item"
            v-if="aggravationActive && indemniteAggravation > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Indemnité d'aggravation de préavis :
              <span class="value"
                >{{ indemniteAggravation.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>

          <!-- Gratification -->
          <div class="result-item" v-if="gratification > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Gratification :
              <span class="value"
                >{{ gratification.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>

          <!-- Rappel prime d'ancienneté -->
          <div class="result-item" v-if="totalRappel > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Rappel prime d'ancienneté :
              <span class="value"
                >{{ totalRappel.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>

          <!-- TOTAL GÉNÉRAL -->
          <div class="result-item highlight">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>TOTAL GÉNÉRAL DES DROITS : </strong>
              <span class="value"
                >{{ totalDroits.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="dommages-licenciement-abusif">
      <div class="section-container indem-abusif">
        <h3>G. DOMMAGES-INTÉRÊTS POUR LICENCIEMENT ABUSIF</h3>
        <p class="section-hint">
          Indiquer : Type de contrat, Dates d'embauche et de rupture, Salaires
          des 12 derniers mois
        </p>

        <div
          class="result-box result2"
          v-if="typeContrat === 'cdi' && ancienneteDetail && SMMBI">
          <h3>Résultats Dommages-Intérêts pour licenciement abusif</h3>
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>SMMBI (base de calcul) :</div>
            <span class="value">{{ SMMBI.toLocaleString("fr-FR") }} FCFA</span>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>Ancienneté (années entières) :</div>
            <span class="value">{{ ancienneteDetail.annees }} ans</span>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>Plancher légal :</div>
            <span class="value"
              >{{ plancherLegal.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>Plafond légal :</div>
            <span class="value"
              >{{ plafondLegal.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>TOTAL DOMMAGES : </strong>
              <span class="value"
                >{{ montantBrutDI.toLocaleString("fr-FR") }} FCFA</span
              >
            </div>
          </div>
        </div>

        <div v-else class="info-message">
          ⚠ Les dommages-intérêts s'appliquent uniquement aux CDI.
        </div>
      </div>
    </section>
    <section id="dommages-cnps">
      <div class="section-container cnps-box">
        <h3>H. DOMMAGES-INTÉRÊTS — NON-DÉCLARATION À LA CNPS</h3>
        <p class="section-hint">
          Indiquer: Type de contrat, Dates d'embauche et de rupture, Salaires
          des 12 derniers mois
        </p>

        <div class="result-box result2" v-if="ancienneteDetail && SMMBI">
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>SMMBI (base de cotisation) :</div>
            <span class="value">
              {{ SMMBI.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>Taux cotisation patronale retraite (CNPS) :</div>
            <span class="value">7,7 %</span>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>Durée totale du contrat (mois) :</div>
            <span class="value">{{ dureeContratMois }} mois</span>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>Cotisation mensuelle non versée :</div>
            <span class="value">
              {{ cotisationMensuelle.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>
          <div class="result-item highlight">
            <!-- <div class="icon">✓</div> -->
            <strong>TOTAL DOMMAGES CNPS : </strong>
            <span class="value">
              {{ totalDommagesCNPS.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>
        </div>
      </div>
    </section>
    <section id="dommages-certificat">
      <div class="section-container certificat-box">
        <h3>I. DOMMAGES-INTÉRÊTS — NON-DÉLIVRANCE DU CERTIFICAT DE TRAVAIL</h3>
        <p class="section-hint">
          Indiquer: Salaires des 12 derniers mois et le Nombre de mois accordé
          par le juge
        </p>

        <div class="input-section">
          <div class="form-group">
            <label>Nombre de mois accordé</label>
            <input
              type="number"
              v-model.number="moisCertificat"
              placeholder="Ex: 3" />
          </div>
        </div>

        <div class="result-box result2" v-if="moisCertificat > 0 && SMMBI">
          <div class="result-item">
            <div>SMMBI :</div>
            <span class="value">
              {{ SMMBI.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>

          <div class="result-item">
            <div>Nombre de mois accordé :</div>
            <span class="value">{{ moisCertificat }} mois</span>
          </div>

          <div class="result-item highlight">
            <strong>TOTAL DOMMAGES : </strong>
            <span class="value">
              {{ totalCertificat.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>
        </div>
      </div>
    </section>
    <section id="dommages-releve">
      <div class="section-container certificat-box">
        <h3>
          J. DOMMAGES-INTÉRÊTS — NON-DÉLIVRANCE DU RELEVÉ NOMINATIF DE SALAIRE
        </h3>
        <p class="section-hint">
          Indiquer: Salaires des 12 derniers mois et le Nombre de mois accordé
          par le juge
        </p>

        <!-- INPUT -->
        <div class="input-section">
          <div class="form-group">
            <label>Nombre de mois accordé</label>
            <input
              type="number"
              v-model.number="moisReleve"
              placeholder="Ex: 3" />
          </div>
        </div>

        <!-- RESULTATS -->
        <div class="result-box result2" v-if="moisReleve > 0 && SMMBI">
          <div class="result-item">
            <div>SMMBI :</div>
            <span class="value">
              {{ SMMBI.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>

          <div class="result-item">
            <div>Nombre de mois accordé :</div>
            <span class="value">{{ moisReleve }} mois</span>
          </div>

          <div class="result-item highlight">
            <strong>TOTAL DOMMAGES : </strong>
            <span class="value">
              {{ totalReleve.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="section-container recap-box">
        <h2 style="text-align: center">RÉCAPITULATIF DES DOMMAGES-INTÉRÊTS</h2>

        <div style="margin-top: 20px">
          <!-- G -->
          <div class="result-item" v-if="montantBrutDI > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Licenciement abusif :
              <span class="value">
                {{ montantBrutDI.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- H -->
          <div class="result-item" v-if="totalDommagesCNPS > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Non-déclaration CNPS :
              <span class="value">
                {{ totalDommagesCNPS.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- I -->
          <div class="result-item" v-if="totalCertificat > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Certificat de travail :
              <span class="value">
                {{ totalCertificat.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- J -->
          <div class="result-item" v-if="totalReleve > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Relevé nominatif de salaire :
              <span class="value">
                {{ totalReleve.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- TOTAL -->
          <div class="result-item highlight">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>TOTAL DOMMAGES-INTÉRÊTS : </strong>
              <span class="value">
                {{ totalDommages.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="section-container recap-box">
        <h2 style="text-align: center">
          TOTAL GÉNÉRAL (INDÉMNITÉS + DOMMAGES)
        </h2>

        <div style="margin-top: 20px">
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              Total indemnités :
              <span class="value">
                {{ totalDroits.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              Total dommages-intérêts :
              <span class="value">
                {{ totalDommages.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <div class="result-item highlight">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>TOTAL GLOBAL: </strong>
              <span class="value big">
                {{ totalGeneral.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="btn-container">
      <button @click="genererPDF" class="btn-pdf">Télécharger le PDF</button>
    </div>
  </div>
  <aside class="sidebar">
    <nav>
      <ul>
        <li><a href="#info-salarie">Informations du salarié</a></li>
        <li><a href="#salaires">Salaires 12 mois</a></li>
        <li><a href="#indemnite-licenciement">Indemnité licenciement</a></li>
        <li><a href="#conges-payes">Congés payés</a></li>
        <li><a href="#preavis">Indemnité préavis</a></li>
        <li><a href="#aggravation-preavis">Aggravation préavis</a></li>
        <li><a href="#gratification">Gratification</a></li>
        <li><a href="#rappel-prime">Rappel prime ancienneté</a></li>
        <li><a href="#recapitulatif">Récapitulatif Indemnités</a></li>
        <li><a href="#dommages-licenciement-abusif">Licenciement abusif</a></li>
        <li><a href="#dommages-cnps">Dommages CNPS</a></li>
        <li><a href="#dommages-certificat">Certificat de travail</a></li>
        <li><a href="#dommages-releve">Relevé nominatif</a></li>
      </ul>
    </nav>
  </aside>

  <div id="pdf-content" class="pdf-container">
        <div
      class="result-box"
      v-if="
        nom ||
        categorie ||
        typeContrat ||
        modePaiement ||
        dateEmbauche ||
        dateRupture ||
        dateRetourConge
      ">
      <h3>Données du salarié</h3>

      <div class="result-item" v-if="nom">
        Nom et Prénoms : <span class="value">{{ nom }}</span>
      </div>
      <div class="result-item" v-if="categorie">
        Catégorie : <span class="value">{{ categorie }}</span>
      </div>
      <div class="result-item" v-if="typeContrat">
        Type de contrat : <span class="value">{{ typeContrat }}</span>
      </div>
      <div class="result-item" v-if="modePaiement">
        Mode de paiement : <span class="value">{{ modePaiement }}</span>
      </div>
      <div class="result-item" v-if="dateEmbauche">
        Date d'embauche : <span class="value">{{ dateEmbauche }}</span>
      </div>
      <div class="result-item" v-if="dateRupture">
        Date de rupture : <span class="value">{{ dateRupture }}</span>
      </div>
      <div class="result-item" v-if="dateRetourConge">
        Date retour dernier congé :
        <span class="value">{{ dateRetourConge }}</span>
      </div>
    </div>
    <!-- anciennete -->
    <div class="result-box" v-if="ancienneteDetail">
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Années complètes :
          <span class="value">{{ ancienneteDetail.annees }} ans</span>
        </div>
      </div>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Mois supplémentaires :
          <span class="value">{{ ancienneteDetail.mois }} mois</span>
        </div>
      </div>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Jours supplémentaires :
          <span class="value">{{ ancienneteDetail.jours }} jours</span>
        </div>
      </div>
    </div>
    <!-- SALAIES -->
    <div v-if="salaires.some((s) => s !== null)" class="result-box">
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Total Salaire Brut 12 mois (STB) :
          <span class="value">{{ STB.toLocaleString() }} FCFA</span>
        </div>
      </div>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Salaire Moyen Mensuel Brut Imposable (SMMBI) :
          <span class="value">{{ SMMBI.toLocaleString() }} FCFA</span>
        </div>
      </div>
    </div>
    <!-- INDEM licenciement -->
    <div
      class="result2"
      v-else-if="typeContrat === 'cdi' && ancienneteDetail && SMMBI">
      <h3>Résultats Indemnité de Licenciement</h3>
      <!-- Calcul par tranche -->
      <div class="result-item" v-for="(tranche, i) in tranches" :key="i">
        <!-- <div class="icon">✓</div> -->
        <div>
          Tranche {{ tranche.label }} ({{ tranche.taux * 100 }}%) :
          <span class="value">
            {{
              tranche.montant.toLocaleString("fr-FR", {
                maximumFractionDigits: 0,
              })
            }}
            FCFA
          </span>
        </div>
      </div>
      <!-- Résultat principal -->
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div class="total">
          <strong>INDEMNITÉ DE LICENCIEMENT : </strong>
          <span class="value">
            {{
              indemnite.toLocaleString("fr-FR", {
                maximumFractionDigits: 0,
              })
            }}
            FCFA
          </span>
        </div>
      </div>
    </div>
    <!-- CONGE PAYE -->
    <div v-if="dprJours > 0" class="result-box result2">
      <h3>Résultats Congés Payés</h3>

      <div class="result-item">
        DPR (jours) :
        <span class="value">{{ dprJours }}</span>
      </div>

      <div class="result-item">
        DPR (mois) :
        <span class="value">{{ dprMois.toFixed(2) }}</span>
      </div>

      <div class="result-item">
        Jours ouvrables (JO) :
        <span class="value">{{ joursOuvrables }}</span>
      </div>

      <div class="result-item">
        Jours calendaires (JC) :
        <span class="value">{{ joursCalendaires }}</span>
      </div>

      <div class="result-item">
        Majoration ancienneté :
        <span class="value">{{ majorationAnciennete }} jours</span>
      </div>

      <div class="result-item">
        Durée congé total :
        <span class="value">{{ dureeConge }} jours</span>
      </div>

      <div class="result-item">
        Salaire total période :
        <span class="value"
          >{{ totalSalairesPeriode.toLocaleString("fr-FR") }} FCFA</span
        >
      </div>

      <div class="result-item">
        SMMBI période :
        <span class="value"
          >{{ smmbiPeriode.toLocaleString("fr-FR") }} FCFA</span
        >
      </div>

      <div class="result-item">
        Salaire moyen journalier :
        <span class="value">
          {{
            salaireJournalier.toLocaleString("fr-FR", {
              maximumFractionDigits: 0,
            })
          }}
          FCFA
        </span>
      </div>
      <!-- RESULTAT FINAL -->
      <div>
        <strong>INDEMNITÉ DE CONGÉS PAYÉS : </strong>
        <span class="value big">
          {{ indemniteConge.toLocaleString("fr-FR") }} FCFA
        </span>
      </div>
    </div>
    <!-- PREAVIS -->
    <div class="result-box result2" v-if="dureePreavis">
      <h3>Résultats Indemnité compensatrice de préavis</h3>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Salaire Moyen Mensuel (SMMBI) :
          <span class="value"> {{ SMMBI.toLocaleString("fr-FR") }} FCFA </span>
        </div>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          <strong>INDEMNITÉ COMPENSATRICE DE PRÉAVIS : </strong>
          <span class="value">
            {{ indemnitePreavis.toLocaleString("fr-FR") }} FCFA
          </span>
        </div>
      </div>
    </div>
    <!-- AGGRAVATION -->

    <div class="result-box result2" v-if="aggravationActive">
      <h3>Résultat Indemnité de l'aggravation de préavis</h3>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          Mode de paiement :
          <span class="value">
            {{ modePaiement === "mois" ? "Mensualisé" : "Non indiqué" }}
          </span>
        </div>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          <strong>INDEMNITÉ DE L'AGGRAVATION : </strong>
          <span class="value">
            {{ indemniteAggravation.toLocaleString("fr-FR") }} FCFA
          </span>
        </div>
      </div>
    </div>
    <!-- GRATIFICATION -->
    <div class="result-box result2" v-if="gratification > 0">
      <h3>Résultats Gratification</h3>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          <strong>GRATIFICATION : </strong>
          <span class="value"
            >{{ gratification.toLocaleString("fr-FR") }} FCFA</span
          >
        </div>
      </div>
    </div>
    <!-- RAPPEL PRIME -->
    <div
      v-if="dateEmbauche && dateRupture && salaireMinCat"
      class="result-box result2">
      <!-- NON ELIGIBLE -->
      <div v-if="ancienneteDetail.annees < 2" class="info-message">
        ⚠ Ancienneté < 2 ans → pas de rappel.
      </div>

      <!-- RESULTAT -->
      <div v-else>
        <h3>Résultats Rappel de Prime d'Ancienneté</h3>
        <!-- Salaire -->
        <div class="result-item">
          <!-- <div class="icon">✓</div> -->
          <div>
            Salaire minimum :
            <span class="value"
              >{{ salaireMinCat.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>

        <!-- Ancienneté -->
        <div class="result-item">
          <!-- <div class="icon">✓</div> -->
          <div>
            Ancienneté :
            <span class="value">{{ ancienneteDetail.annees }} ans</span>
          </div>
        </div>

        <!-- DETAIL -->
        <h4 style="margin: 20px 0">Détail par tranche</h4>

        <div v-for="(item, i) in tranchesRappel" :key="i" class="result-item">
          <!-- <div class="icon">✓</div> -->
          <div>
            {{ item.label }} → {{ item.taux }}% × {{ item.mois }} mois :
            <span class="value">
              {{ item.montant.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>
        </div>

        <!-- TOTAL -->
        <div class="result-item highlight">
          <!-- <div class="icon">✓</div> -->
          <div>
            <strong>TOTAL RAPPEL : </strong>
            <span class="value">
              {{ totalRappel.toLocaleString("fr-FR") }} FCFA
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- RECAP -->
    <div class="section-container recap-box">
      <h2 style="text-align: center">RÉCAPITULATIF TOTAL DES INDEMNITÉS</h2>
      <div style="margin-top: 20px">
        <!-- Indemnité de licenciement -->
        <div class="result-item" v-if="indemnite > 0">
          <!-- <div class="icon">✓</div> -->
          <div>
            Indemnité de licenciement :
            <span class="value"
              >{{
                indemnite.toLocaleString("fr-FR", {
                  maximumFractionDigits: 0,
                })
              }}
              FCFA</span
            >
          </div>
        </div>

        <!-- Indemnité compensatrice de congés payés -->
        <div class="result-item" v-if="indemniteConge > 0">
          <!-- <div class="icon">✓</div> -->
          <div>
            Indemnité compensatrice de congés payés :
            <span class="value"
              >{{ indemniteConge.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>

        <!-- Indemnité compensatrice de préavis -->
        <div class="result-item" v-if="indemnitePreavis > 0">
          <!-- <div class="icon">✓</div> -->
          <div>
            Indemnité compensatrice de préavis :
            <span class="value"
              >{{ indemnitePreavis.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>

        <!-- Indemnité d'aggravation de préavis -->
        <div
          class="result-item"
          v-if="aggravationActive && indemniteAggravation > 0">
          <!-- <div class="icon">✓</div> -->
          <div>
            Indemnité d'aggravation de préavis :
            <span class="value"
              >{{ indemniteAggravation.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>

        <!-- Gratification -->
        <div class="result-item" v-if="gratification > 0">
          <!-- <div class="icon">✓</div> -->
          <div>
            Gratification :
            <span class="value"
              >{{ gratification.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>

        <!-- Rappel prime d'ancienneté -->
        <div class="result-item" v-if="totalRappel > 0">
          <!-- <div class="icon">✓</div> -->
          <div>
            Rappel prime d'ancienneté :
            <span class="value"
              >{{ totalRappel.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>

        <!-- TOTAL GÉNÉRAL -->
        <div class="result-item highlight">
          <!-- <div class="icon">✓</div> -->
          <div>
            <strong>TOTAL GÉNÉRAL DES DROITS : </strong>
            <span class="value"
              >{{ totalDroits.toLocaleString("fr-FR") }} FCFA</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- DOAMMAGE LICENCIEMENT -->
    <div
      class="result-box result2"
      v-if="typeContrat === 'cdi' && ancienneteDetail && SMMBI">
      <h3>Résultats Dommages-Intérêts pour licenciement abusif</h3>
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>SMMBI (base de calcul) :</div>
        <span class="value">{{ SMMBI.toLocaleString("fr-FR") }} FCFA</span>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>Ancienneté (années entières) :</div>
        <span class="value">{{ ancienneteDetail.annees }} ans</span>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>Plancher légal :</div>
        <span class="value"
          >{{ plancherLegal.toLocaleString("fr-FR") }} FCFA</span
        >
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>Plafond légal :</div>
        <span class="value"
          >{{ plafondLegal.toLocaleString("fr-FR") }} FCFA</span
        >
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>
          <strong>TOTAL DOMMAGES : </strong>
          <span class="value"
            >{{ montantBrutDI.toLocaleString("fr-FR") }} FCFA</span
          >
        </div>
      </div>
    </div>
    <!-- DOMMAGE CNPS -->
    <div class="result-box result2" v-if="ancienneteDetail && SMMBI">
      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>SMMBI (base de cotisation) :</div>
        <span class="value"> {{ SMMBI.toLocaleString("fr-FR") }} FCFA </span>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>Taux cotisation patronale retraite (CNPS) :</div>
        <span class="value">7,7 %</span>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>Durée totale du contrat (mois) :</div>
        <span class="value">{{ dureeContratMois }} mois</span>
      </div>

      <div class="result-item">
        <!-- <div class="icon">✓</div> -->
        <div>Cotisation mensuelle non versée :</div>
        <span class="value">
          {{ cotisationMensuelle.toLocaleString("fr-FR") }} FCFA
        </span>
      </div>
      <div class="result-item highlight">
        <!-- <div class="icon">✓</div> -->
        <strong>TOTAL DOMMAGES CNPS : </strong>
        <span class="value">
          {{ totalDommagesCNPS.toLocaleString("fr-FR") }} FCFA
        </span>
      </div>
    </div>
    <!-- DOMMAGE  -->
    <div class="result-box result2" v-if="moisCertificat > 0 && SMMBI">
      <div class="result-item">
        <div>SMMBI :</div>
        <span class="value"> {{ SMMBI.toLocaleString("fr-FR") }} FCFA </span>
      </div>

      <div class="result-item">
        <div>Nombre de mois accordé :</div>
        <span class="value">{{ moisCertificat }} mois</span>
      </div>

      <div class="result-item highlight">
        <strong>TOTAL DOMMAGES : </strong>
        <span class="value">
          {{ totalCertificat.toLocaleString("fr-FR") }} FCFA
        </span>
      </div>
    </div>
    <!-- DOMMAGE DERNIER -->

    <div class="result-box result2" v-if="moisReleve > 0 && SMMBI">
      <div class="result-item">
        <div>SMMBI :</div>
        <span class="value"> {{ SMMBI.toLocaleString("fr-FR") }} FCFA </span>
      </div>

      <div class="result-item">
        <div>Nombre de mois accordé :</div>
        <span class="value">{{ moisReleve }} mois</span>
      </div>

      <div class="result-item highlight">
        <strong>TOTAL DOMMAGES : </strong>
        <span class="value">
          {{ totalReleve.toLocaleString("fr-FR") }} FCFA
        </span>
      </div>
    </div>
    <!-- RECAP -->

          <div class="section-container recap-box">
        <h2 style="text-align: center">RÉCAPITULATIF DES DOMMAGES-INTÉRÊTS</h2>

        <div style="margin-top: 20px">
          <!-- G -->
          <div class="result-item" v-if="montantBrutDI > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Licenciement abusif :
              <span class="value">
                {{ montantBrutDI.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- H -->
          <div class="result-item" v-if="totalDommagesCNPS > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Non-déclaration CNPS :
              <span class="value">
                {{ totalDommagesCNPS.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- I -->
          <div class="result-item" v-if="totalCertificat > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Certificat de travail :
              <span class="value">
                {{ totalCertificat.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- J -->
          <div class="result-item" v-if="totalReleve > 0">
            <!-- <div class="icon">✓</div> -->
            <div>
              Relevé nominatif de salaire :
              <span class="value">
                {{ totalReleve.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <!-- TOTAL -->
          <div class="result-item highlight">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>TOTAL DOMMAGES-INTÉRÊTS : </strong>
              <span class="value">
                {{ totalDommages.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- RECAP TOTAL -->
             <div class="section-container recap-box">
        <h2 style="text-align: center">
          TOTAL GÉNÉRAL (INDÉMNITÉS + DOMMAGES)
        </h2>

        <div style="margin-top: 20px">
          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              Total indemnités :
              <span class="value">
                {{ totalDroits.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <div class="result-item">
            <!-- <div class="icon">✓</div> -->
            <div>
              Total dommages-intérêts :
              <span class="value">
                {{ totalDommages.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>

          <div class="result-item highlight">
            <!-- <div class="icon">✓</div> -->
            <div>
              <strong>TOTAL GLOBAL: </strong>
              <span class="value big">
                {{ totalGeneral.toLocaleString("fr-FR") }} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
  import { ref, computed } from "vue";
  import Header from "@/components/Header.vue";
  import html2pdf from "html2pdf.js";

  const cleanFileName = (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "_");
  };

  const genererPDF = () => {
    const element = document.getElementById("pdf-content");

    document.body.classList.add("pdf-mode");

    const today = new Date().toISOString().split("T")[0];

    const opt = {
      margin: 10,
      filename: `Calcul_bulletins_${cleanFileName(nom.value || "salarie")}_${today}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        document.body.classList.remove("pdf-mode");
      });
  };

  const dateEmbauche = ref("");
  const dateRupture = ref("");
    const typeContrat = ref("");
    const nom = ref("");

  const ancienneteDetail = computed(() => {
    if (!dateEmbauche.value || !dateRupture.value) return null;

    const debut = new Date(dateEmbauche.value);
    const fin = new Date(dateRupture.value);

    if (fin < debut) {
      return {
        erreur: "La date de rupture est antérieure à la date d'embauche",
      };
    }

    let annees = fin.getFullYear() - debut.getFullYear();
    let mois = fin.getMonth() - debut.getMonth();
    let jours = fin.getDate() - debut.getDate();

    if (jours < 0) {
      mois--;
      const dernierJourMois = new Date(
        fin.getFullYear(),
        fin.getMonth(),
        0,
      ).getDate();
      jours += dernierJourMois;
    }
    if (mois < 0) {
      annees--;
      mois += 12;
    }

    return { annees, mois, jours };
  });

  const salaires = ref(Array(12).fill(null));
  function remplirIdentique() {
    const valeur = salaires.value[0] || 0;
    salaires.value = salaires.value.map(() => valeur);
  }

  const STB = computed(() =>
    salaires.value.reduce((acc, s) => acc + (s || 0), 0),
  );
  const SMMBI = computed(() => STB.value / 12);

  const indemnite = computed(() => {
    if (!ancienneteDetail.value) return 0;
    const { annees, mois, jours } = ancienneteDetail.value;
    const ancienneteAnnuelle = annees + mois / 12 + jours / 360;

    const tranche1 = Math.min(ancienneteAnnuelle, 5);
    const tranche2 = Math.min(Math.max(ancienneteAnnuelle - 5, 0), 5);
    const tranche3 = Math.max(ancienneteAnnuelle - 10, 0);

    return Math.round(
      tranche1 * SMMBI.value * 0.3 +
        tranche2 * SMMBI.value * 0.35 +
        tranche3 * SMMBI.value * 0.4,
    );
  });

  const tranches = computed(() => {
    if (!ancienneteDetail.value) return [];
    const { annees, mois, jours } = ancienneteDetail.value;
    const ancienneteAnnuelle = annees + mois / 12 + jours / 360;

    const tranche1 = Math.min(ancienneteAnnuelle, 5);
    const tranche2 = Math.min(Math.max(ancienneteAnnuelle - 5, 0), 5);
    const tranche3 = Math.max(ancienneteAnnuelle - 10, 0);

    return [
      {
        label: "1-5 ans",
        taux: 0.3,
        montant: Math.round(tranche1 * SMMBI.value * 0.3),
      },
      {
        label: "6-10 ans",
        taux: 0.35,
        montant: Math.round(tranche2 * SMMBI.value * 0.35),
      },
      {
        label: ">10 ans",
        taux: 0.4,
        montant: Math.round(tranche3 * SMMBI.value * 0.4),
      },
    ];
  });

  /* =========================
     INPUTS
========================= */

  const dateRetourConge = ref("");

  // ancienneté déjà calculée ailleurs
  // (on suppose que tu as ancienneteDetail)

  const salairesConge = ref(Array(12).fill(null));

  // majoration supplémentaires
  const joursMajorationMedaille = ref(null);
  const joursMajorationEnfant = ref(null);

  /* =========================
     DPR (BASE LÉGALE)
========================= */

  // DPR en jours
  const dprJours = computed(() => {
    if (!dateRetourConge.value || !dateRupture.value) return 0;

    const debut = new Date(dateRetourConge.value);
    const fin = new Date(dateRupture.value);

    if (fin <= debut) return 0;

    return Math.floor((fin - debut) / (1000 * 60 * 60 * 24));
  });

  // DPR en mois
  const dprMois = computed(() => dprJours.value / 30);

  /* =========================
     JOURS
========================= */

  // JO
  const joursOuvrables = computed(() => Math.ceil(dprMois.value * 2.2));

  // JC
  const joursCalendaires = computed(() =>
    Math.ceil(joursOuvrables.value * 1.25),
  );

  /* =========================
     MAJORATION ANCIENNETÉ
========================= */

  const majorationAnciennete = computed(() => {
    if (!ancienneteDetail.value) return 0;

    const { annees } = ancienneteDetail.value;

    if (annees < 5) return 0;
    if (annees < 10) return 1;
    if (annees < 15) return 2;
    if (annees < 20) return 3;
    if (annees < 25) return 5;
    if (annees < 30) return 7;
    return 8;
  });

  /* =========================
     DURÉE CONGÉ
========================= */

  const dureeConge = computed(
    () =>
      joursCalendaires.value +
      majorationAnciennete.value +
      (joursMajorationMedaille.value || 0) +
      (joursMajorationEnfant.value || 0),
  );

  /* =========================
     SALAIRES
========================= */

  // SBI
  const totalSalairesPeriode = computed(() =>
    salairesConge.value.reduce((acc, s) => acc + (s || 0), 0),
  );

  // nb mois (calculé automatiquement)
  const nbMoisPaie = ref(null);
  // const nbMoisPaie = computed(() =>
  //   Math.max(1, Math.round(dprMois.value))
  // );

  // SMMBI
  const smmbiPeriode = computed(() => {
    if (!nbMoisPaie.value) return 0;
    return totalSalairesPeriode.value / nbMoisPaie.value;
  });

  // salaire journalier
  const salaireJournalier = computed(() => smmbiPeriode.value / 30);

  /* =========================
     INDEMNITÉ
========================= */

  const indemniteConge = computed(() => {
    const montant = salaireJournalier.value * dureeConge.value;
    return Number(montant.toFixed(3)); // millième
  });

  /* =========================
     ACTION
========================= */

  function remplirIdentiqueConge() {
    const valeur = salairesConge.value[0] || 0;
    salairesConge.value = salairesConge.value.map(() => valeur);
  }

  const categorie = ref("");
  // Durée du préavis (automatique selon CCI Art. 34)
  const dureePreavis = computed(() => {
    if (!categorie.value) return 0;

    // Ouvrier / Employé
    if (categorie.value === "ouvrier" || categorie.value === "employe") {
      return modePaiement.value === "heure" ? 8 / 30 : 1;
      // 8 jours ≈ 0.27 mois
    }

    // Agent de maîtrise / technicien
    if (categorie.value === "agent_maitrise") {
      return 2;
    }

    // Cadre
    if (categorie.value === "cadre") {
      return 3;
    }

    // Cadre supérieur
    if (categorie.value === "cadre_superieur") {
      return 4;
    }

    return 0;
  });

  // Indemnité préavis
  const indemnitePreavis = computed(() => {
    if (!dureePreavis.value) return 0;
    return Math.round(SMMBI.value * dureePreavis.value);
  });

  //   Aggravation préavis
  const aggravationActive = ref(false);

  // ⚠️ récupère ton mode de paiement déjà existant
  const modePaiement = ref(""); // "mois" ou "heure"

  const indemniteAggravation = computed(() => {
    if (!aggravationActive.value) return 0;

    if (modePaiement.value === "mois") {
      return Math.round(SMMBI.value * 2);
    }

    if (modePaiement.value === "heure") {
      return Math.round(SMMBI.value * 1);
    }

    return 0;
  });

  // RAPPEL DE PRIME

  const salaireMinCat = ref(null);

  // Générer les tranches de rappel
  const tranchesRappel = computed(() => {
    if (!ancienneteDetail.value || ancienneteDetail.value.erreur) return [];

    const annees = ancienneteDetail.value.annees;

    if (annees < 2) return [];

    let result = [];

    // on remonte 2 ans
    let anneeFin = annees;
    let anneeDebut = annees - 2;

    let moisRestants = 24;

    for (let annee = anneeDebut; annee <= anneeFin; annee++) {
      if (annee < 2) continue;

      let taux = Math.min(2 + (annee - 2), 25);

      // calcul mois par tranche
      let mois = 12;

      // cas première tranche (souvent 11 mois)
      if (annee === anneeDebut) {
        mois = 12 - (ancienneteDetail.value.mois || 0);
      }

      // cas dernière tranche
      if (annee === anneeFin) {
        mois = ancienneteDetail.value.mois || 1;
      }

      let montant = (taux / 100) * salaireMinCat.value * mois;

      result.push({
        label: `${annee} ans`,
        taux,
        mois,
        montant: Math.round(montant),
      });
    }

    return result;
  });

  // TOTAL
  const totalRappel = computed(() => {
    return tranchesRappel.value.reduce((acc, t) => acc + t.montant, 0);
  });

  // GRATIFICATION
  const typeGratification = ref(""); // "annuelle" ou "prorata"
  const joursReference = ref(null); // uniquement si prorata

  const GRATIFICATION_TAUX = 0.75; // 75%

  const gratification = computed(() => {
    if (!salaireMinCat.value || !typeGratification.value) return 0;

    if (typeGratification.value === "annuelle") {
      return Math.round(salaireMinCat.value * GRATIFICATION_TAUX);
    }

    if (typeGratification.value === "prorata" && joursReference.value) {
      return Math.round(
        salaireMinCat.value * GRATIFICATION_TAUX * (joursReference.value / 360),
      );
    }
    return 0;
  });

  // Calcul du total général
  const totalDroits = computed(() => {
    return (
      (indemnite.value || 0) +
      (indemniteConge.value || 0) +
      (indemnitePreavis.value || 0) +
      (aggravationActive.value ? indemniteAggravation.value || 0 : 0) +
      (gratification.value || 0) +
      (totalRappel.value || 0)
    );
  });

  // DOMMAGES-INTÉRÊTS POUR LICENCIEMENT ABUSIF
  // Montant brut = SMMBI × années
  const montantBrutDI = computed(() => {
    if (!ancienneteDetail.value || ancienneteDetail.value.erreur) return 0;
    return SMMBI.value * ancienneteDetail.value.annees;
  });

  // Bornes légales
  const plancherLegal = computed(() => 3 * SMMBI.value); // 3 mois
  const plafondLegal = computed(() => 20 * SMMBI.value); // 20 mois

  //   DOMMAGES-INTÉRÊTS POUR NON-DÉCLARATION À LA CNPS

  // Taux CNPS
  const TAUX_CNPS = 0.077; // 7,7%

  // Durée totale en mois
  const dureeContratMois = computed(() => {
    if (!ancienneteDetail.value) return 0;

    return ancienneteDetail.value.annees * 12 + ancienneteDetail.value.mois;
  });

  // Cotisation mensuelle non versée
  const cotisationMensuelle = computed(() => {
    return Math.round(SMMBI.value * TAUX_CNPS);
  });

  // TOTAL DOMMAGES CNPS
  const totalDommagesCNPS = computed(() => {
    return cotisationMensuelle.value * dureeContratMois.value;
  });

  //   DOMMAGES-INTÉRÊTS POUR NON-DÉLIVRANCE DU CERTIFICAT DE TRAVAIL
  // Input
  const moisCertificat = ref(0);

  // Total dommages certificat
  const totalCertificat = computed(() => {
    return Math.round(SMMBI.value * (moisCertificat.value || 0));
  });

  // DOMMAGES-INTÉRÊTS — NON-DÉLIVRANCE DU RELEVÉ NOMINATIF

  // input
  const moisReleve = ref(0);

  // total dommages
  const totalReleve = computed(() => {
    return Math.round(SMMBI.value * (moisReleve.value || 0));
  });

  const totalDommages = computed(() => {
    return (
      (montantBrutDI.value || 0) + // G
      (totalDommagesCNPS.value || 0) + // H
      (totalCertificat.value || 0) + // I
      (totalReleve.value || 0) // J
    );
  });

  // Total général avec droits + dommages

  const totalGeneral = computed(() => {
    return (totalDroits.value || 0) + (totalDommages.value || 0);
  });
</script>

<style src="/src/styles/app.css"></style>
