import { Injectable, signal } from "@angular/core";
import { CreateInteractionRequest, Interaction, UpdateInteractionRequest } from "../interfaces/interaction";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class InteractionService {
    private interactionsSignal = signal<Interaction[]>([]);
    public interactions = this.interactionsSignal.asReadonly();
    public isLoading = signal(false);
    constructor(private http: HttpClient) { }

    getInteractionsByClient(clientId: string): Observable<Interaction[]> {
        return this.http.get<Interaction[]>(`http://localhost:5000/api/v1/interactions/client/${clientId}`).pipe(
            tap((interactions: Interaction[]) => {
                this.interactionsSignal.set(interactions);
                this.isLoading.set(false);
            })
        );
    }

    getInteractionById(id: string): Observable<Interaction> {
        return this.http.get<Interaction>(`http://localhost:5000/api/v1/interactions/${id}`);
    }

    createInteraction(interactionData: CreateInteractionRequest): Observable<Interaction> {
        return this.http.post<Interaction>(`http://localhost:5000/api/v1/interactions`, interactionData).pipe(
            tap((newInteraction: Interaction) => {
                this.interactionsSignal.update(interactions => [...interactions, newInteraction]);
                this.isLoading.set(false);
            })
        );
    }


    UpdateInteraction(id: string, interactionData: UpdateInteractionRequest): Observable<Interaction> {
        return this.http.patch<Interaction>(`http://localhost:5000/api/v1/interactions/${id}`, interactionData).pipe(
            tap((updatedInteraction: Interaction) => {
                this.interactionsSignal.update(clients =>
                    clients.map(interaction => interaction.id === id ? updatedInteraction : interaction)
                );
            })
        );;
    }

    deleteInteraction(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/api/v1/interactions/${id}`).pipe(
      tap(() => {
        this.interactionsSignal.update(interactions => 
          interactions.filter(interaction => interaction.id !== id)
        );
      })
    );;
  }

//   refreshInteractions() : void{
//     this.getInteractionsByClient().subscribe()
//   }

}