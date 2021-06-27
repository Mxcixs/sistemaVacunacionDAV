import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Register } from 'src/app/models/register.interface';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-register-detail',
  templateUrl: './register-detail.component.html',
  styleUrls: ['./register-detail.component.css'],
})
export class RegisterDetailComponent implements OnInit {
  registers: Register[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(private registerService: RegisterService) {}

  ngOnInit(): void {
    this.getRegisters();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getRegisters() {
    this.registerService
      .getAllRegisters()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((registers) => {
        if (registers && registers.length > 0) {
          this.registers = registers;
        }
      });
  }

  deleteRegister(uid: string) {
    this.registerService.deleteRegister(uid);
  }

  changeRegisterStatus(register: Register) {
    this.registerService.updateRegister(register);
  }
}
