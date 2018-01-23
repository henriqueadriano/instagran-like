import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {

  type: string = null;
  message: string = null;

  constructor(private notifier: NotificationService) {
    notifier.emmitter.subscribe(
      data => {
        this.type = data.type;
        this.message = data.message;
        this.reset();
      }
    );
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {

    const fullname = form.value.fullname;
    const email = form.value.email
    const password = form.value.password

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {
        userData.sendEmailVerification()
        return firebase.database().ref('users/' + userData.uid).set({
          email: email,
          uid: userData.uid,
          registrationDate: new Date().toString(),
          name: fullname
        })
          .then(() => { firebase.auth().signOut() })
          //.then(() => { this.notifier.display('success', `User ${fullname} inserted with success`) })
          .then(() => { this.notifier.display('success', `A email was sent to ${email},please confirm email!`) })
      })
      .catch(err => {
        this.notifier.display('error', err.message)
        console.log(err)
      })
  }

  reset() {
    setTimeout(() => {
      this.type = null;
      this.message = null;
    }, 6000);
  }

}
