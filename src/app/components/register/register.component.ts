import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Register } from 'src/app/models/register.interface';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  registerUidPath: string | null;
  emailPattern: any =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.buildForm();
    this.registerUidPath = this.route.snapshot.paramMap.get('uid');
  }

  private buildForm() {
    this.registerForm = this.fb.group({
      uid: ['', Validators.required],
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: [''],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      lugarNacimiento: ['', Validators.required],
      lugarResidencia: ['', Validators.required],
      agendado: [true],
    });
  }

  ngOnInit(): void {
    this.getRegisterInfo();
  }

  getRegisterInfo() {
    if (this.registerUidPath !== null) {
      this.registerService
        .getRegisterByUid(this.registerUidPath)
        .subscribe((register) => {
          this.setInfoToForm(register);
        });
    }
  }

  setInfoToForm(register: Register) {
    this.registerForm.get('uid')?.setValue(register.uid);
    this.registerForm.get('dni')?.setValue(register.dni);
    this.registerForm.get('nombre')?.setValue(register.nombre);
    this.registerForm.get('telefono')?.setValue(register.telefono);
    this.registerForm.get('email')?.setValue(register.email);
    this.registerForm.get('sexo')?.setValue(register.sexo);
    this.registerForm
      .get('fechaNacimiento')
      ?.setValue(register.fechaNacimiento);
    this.registerForm
      .get('lugarNacimiento')
      ?.setValue(register.lugarNacimiento);
    this.registerForm
      .get('lugarResidencia')
      ?.setValue(register.lugarNacimiento);
    this.registerForm.get('agendado')?.setValue(register.agendado);
  }

  saveData() {
    const registerData = this.registerForm.value as Register;
    if (this.registerUidPath !== null) {
      this.registerService
        .updateRegister(registerData)
        .then(() => {
          console.log('Registro actualizado con éxito');
          this.router.navigate(['..']);
        })
        .catch((err) => console.log(err));
    } else {
      this.registerService
        .createRegister(registerData)
        .then(() => {
          console.log('Registro agregado con éxito');
          this.router.navigate(['..']);
        })
        .catch((err) => console.log(err));
    }
  }

  deleteRegister() {
    this.registerService
      .deleteRegister(this.registerUidPath as string)
      .then(() => this.router.navigate(['/list']));
  }
}
