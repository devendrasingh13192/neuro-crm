import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// import { environment } from '../../environments/environment';
import { Client, CreateClientRequest, UpdateClientRequest } from '../interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  //private apiUrl = environment.apiUrl;
  
  private clientsSignal = signal<Client[]>([]);
  public clients = this.clientsSignal.asReadonly();
  public isLoading = signal(false);

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    this.isLoading.set(true);
    return this.http.get<Client[]>('http://localhost:5000/api/v1/clients').pipe(
      tap((clients: Client[]) => {
        this.clientsSignal.set(clients);
        this.isLoading.set(false);
      })
    );
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`http://localhost:5000/api/v1/clients/${id}`);
  }

  createClient(clientData: CreateClientRequest): Observable<Client> {
    this.isLoading.set(true);
    return this.http.post<Client>(`http://localhost:5000/api/v1/clients`, clientData).pipe(
      tap((newClient: Client) => {
        this.clientsSignal.update(clients => [...clients, newClient]);
        this.isLoading.set(false);
      })
    );
  }

  updateClient(id: string, clientData: UpdateClientRequest): Observable<Client> {
    return this.http.patch<Client>(`http://localhost:5000/api/v1/clients/${id}`, clientData).pipe(
      tap((updatedClient: Client) => {
        this.clientsSignal.update(clients => 
          clients.map(client => client.id === id ? updatedClient : client)
        );
      })
    );
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/v1/clients/${id}`).pipe(
      tap(() => {
        this.clientsSignal.update(clients => 
          clients.filter(client => client.id !== id)
        );
      })
    );
  }

  // updateNeuroProfile(id: string, neuroProfile: any): Observable<Client> {
  //   return this.http.patch<Client>(`${this.apiUrl}/clients/${id}/neuro-profile`, neuroProfile);
  // }

  refreshClients(): void {
    this.getClients().subscribe();
  }
}