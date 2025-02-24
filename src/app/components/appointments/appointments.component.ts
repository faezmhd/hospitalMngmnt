import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/api.service';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.css'],
})
export class AppointmentsComponent implements OnInit {
    patient: string = 'Select';
    doctor: string = 'Select';
    appointmentDate: string = '';
    isEditing: boolean = false;
    editAppointmentId: string = '';
    DoctorsArray: any[] = [];
    PatientsArray: any[] = [];
    AppointmentsArray: any[] = [];

    constructor(
        private readonly apiService: ApiService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        // Load patients, doctors, and appointments
        this.apiService.getPatients().subscribe((res) => {
            this.PatientsArray = res;
        });
        this.apiService.getDoctors().subscribe((res) => {
            this.DoctorsArray = res;
        });
        this.apiService.getAppointments().subscribe((res) => {
            this.AppointmentsArray = res;
        });
    }

    clear(): void {
        this.patient = 'Select';
        this.doctor = 'Select';
        this.appointmentDate = '';
    }

    onEditAppointment(id: string): void {
        const appointment = this.AppointmentsArray.find(
            (appointment) => appointment._id === id
        );
        if (!appointment) {
            this.toastr.error('Appointment not found', 'Error');
            return;
        }

        // Map the appointment data to the form fields
        this.patient = appointment.patientName;
        this.doctor = appointment.doctor;
        this.appointmentDate = new Date(appointment.appointmentDate)
            .toISOString()
            .slice(0, 10);
        this.isEditing = true;
        this.editAppointmentId = id;
    }

    onDeleteAppointment(id: string): void {
        this.apiService.deleteAppointment(id).subscribe(() => {
            this.AppointmentsArray = this.AppointmentsArray.filter(
                (appointment) => appointment._id !== id
            );
            this.toastr.success('Appointment deleted successfully!', 'Success!');
        });
    }

    onAddClick(): void {
        if (this.patient === 'Select' || this.doctor === 'Select' || !this.appointmentDate) {
            this.toastr.warning('Please fill in all fields', 'Warning');
            return;
        }

        const data = {
            patient: this.patient,
            doctor: this.doctor,
            appointmentDate: this.appointmentDate,
        };

        this.apiService.addAppointment(data).subscribe((res) => {
            this.AppointmentsArray.push(res);
            this.clear();
            this.toastr.success('New appointment added successfully', 'Success!');
        });
    }

    onUpdateClick(): void {
        if (this.patient === 'Select' || this.doctor === 'Select' || !this.appointmentDate) {
            this.toastr.warning('Please fill in all fields', 'Warning');
            return;
        }

        const data = {
            patient: this.patient,
            doctor: this.doctor,
            appointmentDate: this.appointmentDate,
        };

        this.apiService.updateAppointment(this.editAppointmentId, data).subscribe((res) => {
            const index = this.AppointmentsArray.findIndex(
                (appointment) => appointment._id === this.editAppointmentId
            );
            if (index !== -1) {
                this.AppointmentsArray[index] = res;
            }
            this.isEditing = false;
            this.editAppointmentId = '';
            this.clear();
            this.toastr.success(
                'Appointment details updated successfully',
                'Success!'
            );
        });
    }
}
