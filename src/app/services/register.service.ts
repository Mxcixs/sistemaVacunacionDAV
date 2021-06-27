import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Register } from '../models/register.interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private afs: AngularFirestore) {}

  getAllRegisters() {
    return this.afs
      .collection('registros')
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          return snapshot.map((action) => {
            const data = action.payload.doc.data() as Register;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
  }

  getRegisterByUid(uid: string) {
    return this.afs
      .collection('registros')
      .doc(uid)
      .valueChanges()
      .pipe(map((register: any) => register as Register));
  }

  createRegister(register: Register) {
    const docId = this.afs.createId();
    register.uid = docId;
    return this.afs.collection('registros').doc(docId).set({
      uid: register.uid,
      dni: register.dni,
      nombre: register.nombre,
      telefono: register.telefono,
      email: register.email,
      sexo: register.sexo,
      fechaNacimiento: register.fechaNacimiento,
      lugarNacimiento: register.lugarNacimiento,
      lugarResidencia: register.lugarResidencia,
      agendado: register.agendado,
    });
  }

  updateRegister(register: Register) {
    const registerDocRef = this.afs.collection('registros').doc(register.uid);
    return registerDocRef.update(register);
  }

  deleteRegister(uid: string) {
    const registerDocRef = this.afs.collection('registros').doc(uid);
    return registerDocRef.delete();
  }
}
