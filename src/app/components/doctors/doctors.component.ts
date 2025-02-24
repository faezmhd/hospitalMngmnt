//components/doctors.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/api.service';

@Component({
    selector: 'app-doctors',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './doctors.component.html',
    styleUrl: './doctors.component.css',
})
export class DoctorsComponent implements OnInit {
    name: string = '';
    speciality: string = 'Select';
    isEditing: boolean = false;
    editDoctorId: string = '';
    DoctorsArray: any[] = [];

    constructor(private apiService: ApiService, 
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.apiService.getDoctors().subscribe((res) => {
            this.DoctorsArray = res;
        });
    }

    clear(): void {
        this.name = '';
        this.speciality = 'Select';
    }

    onEditDoctor(id: string): void {
        const index = this.DoctorsArray
        .findIndex((doctor) => doctor._id === id);
        const doctor = this.DoctorsArray[index];
        this.name = doctor['name'];
        this.speciality = doctor['speciality'];
        this.isEditing = true;
        this.editDoctorId = id;
    }

    onDeleteDoctor(id: string): void {
        this.apiService.deleteDoctor(id).subscribe((res) => {
            this.DoctorsArray = this.DoctorsArray.filter(
                (doctor) => doctor._id !== id
            );
            this.toastr.success('Doctor deleted successfully!', 'Success!');
        });
    }

    onAddClick(): void {
        const data = {
            name: this.name,
            speciality: this.speciality,
        };
        console.log(data);
        this.apiService.addDoctor(data).subscribe((res) => {
            this.DoctorsArray.push(res);
            this.clear();
            this.toastr.success('New Doctor added successfully', 'Success!');
        });
    }

    onUpdateClick(): void {
        const data = {
            name: this.name,
            speciality: this.speciality,
        };
        console.log(data);
        this.apiService.updateDoctor(this.editDoctorId, data)
            .subscribe((res) => {
            this.DoctorsArray = this.DoctorsArray.filter(
                (doctor) => doctor._id !== this.editDoctorId
            );
            this.DoctorsArray.push(res);
            this.editDoctorId = '';
            this.isEditing = false;
            this.toastr.success('Doctor details updated successfully', 'Success!');
            this.clear();
        });
    }
}
