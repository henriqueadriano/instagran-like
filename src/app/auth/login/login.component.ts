import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { NotificationService } from "../../shared/notification.service";
import * as firebase from 'firebase';
import { MyFireService } from "../../shared/myfire.service";
import { UserService } from "../../shared/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(private notifier: NotificationService,
    private myFire: MyFireService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userData => {
        if (userData.emailVerified) {
          return this.myFire.getUserFromDatabase(userData.uid);
        } else {
          const message = 'Your email is not yet verified';
          this.notifier.display('error', message);
          firebase.auth().signOut();
        }

      })
      .then(userDataFromDatabase => {
        if (userDataFromDatabase) {
          this.userService.set(userDataFromDatabase);
          this.router.navigate(['/allposts']);
          const message = 'Login with success!';
          this.notifier.display('success', message);
        }
      })
      .catch(err => {
        this.notifier.display('error', err.message);
      });

  }

}