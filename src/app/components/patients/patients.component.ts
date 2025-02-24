// components/patients.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/api.service';

@Component({
    selector: 'app-patients',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './patients.component.html',
    styleUrl: './patients.component.css',
})
export class PatientsComponent implements OnInit {
    name: string = '';
    age: string = '';
    gender: string = 'Select';
    isEditing: boolean = false;
    editPatientId: string = '';
    PatientsArray: any[] = [];

    constructor(private apiService: ApiService, 
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.apiService.getPatients().subscribe((res) => {
            this.PatientsArray = res;
        });
    }

    clear(): void {
        this.name = '';
        this.age = '';
        this.gender = 'Select';
    }

    onEditPatient(id: string): void {
        const index = this.PatientsArray
        .findIndex((patient) => patient._id === id);
        const patient = this.PatientsArray[index];
        this.name = patient['name'];
        this.age = patient['age'];
        this.gender = patient['gender'];
        this.isEditing = true;
        this.editPatientId = id;
    }

    onDeletePatient(id: string): void {
        this.apiService.deletePatient(id).subscribe((res) => {
            this.PatientsArray = this.PatientsArray.filter(
                (patient) => patient._id !== id
            );
            this.toastr.success('Patient deleted successfully!', 'Success!');
        });
    }

    onAddClick(): void {
        const data = {
            name: this.name,
            age: this.age,
            gender: this.gender,
        };
        this.apiService.addPatient(data).subscribe((res) => {
            this.PatientsArray.push(res);
            this.clear();
            this.toastr.success('New Patient added successfully', 'Success!');
        });
    }

    onUpdateClick(): void {
        const data = {
            name: this.name,
            age: this.age,
            gender: this.gender,
        };

        console.log(data);
        this.apiService.updatePatient(this.editPatientId, data)
        .subscribe((res) => {
            this.PatientsArray = this.PatientsArray.filter(
                (patient) => patient._id !== this.editPatientId
            );
            this.PatientsArray.push(res);
            this.editPatientId = '';
            this.isEditing = false;
            this.toastr.success('Patient details updated successfully', 'Success!');
            this.clear();
        });
    }
}
