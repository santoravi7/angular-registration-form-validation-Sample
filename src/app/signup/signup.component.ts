import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { Newuser } from "../newuser";
import { USER } from "../user-credentials";
import { RouterModule, Router } from "@angular/router";
import { UsersService } from "../users.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  users: User[];
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  sample;
  validate: boolean;
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getUsers();
    this.registerForm = this.formBuilder.group(
      {
        userName: ["", Validators.required],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        email: [
          "",
          [
            Validators.required,
            Validators.email,
            Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
          ]
        ],
        password: ["", [Validators.required, Validators.minLength(3)]]
      },
      { validator: this.uniqueValidator.bind(this) }
    );
  }

  uniqueValidator(control: AbstractControl) {
    const name = control.get("email").value;
    return this.check(name);
  }

  check(name: string) {
    if (name === "santoravi7@gmail.com") {
      console.log("emails same");
      return false;
    }
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(users => (this.users = users));
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.addUser(this.registerForm.value.userName,this.registerForm.value.firstName,
    this.registerForm.value.lastName,
      this.registerForm.value.email,
      this.registerForm.value.password
    );
    this.validate = true;
    this.router.navigate(["/"]);
  }
  validate_form(choice: string): void {
    console.log("validate form");

    var userName = (<HTMLInputElement>document.getElementById("user-name"))
      .value;
    var pass = (<HTMLInputElement>document.getElementById("password")).value;
    var fName = (<HTMLInputElement>document.getElementById("first-name")).value;
    var lName = (<HTMLInputElement>document.getElementById("last-name")).value;
    var emailVal = (<HTMLInputElement>document.getElementById("email")).value;
    if (choice == "username") {
      this.username = "";
      if (userName == "") {
        this.username = "Username cannot be null";
      }
      for (var value of this.users) {
        if (userName === value.username) {
          this.username = "Username already exists";
        }
      }
    } else if (choice == "password") {
      this.password = "";
      if (pass == "") {
        this.password += "Password cannot be null";
      }
    } else if (choice == "email") {
      this.email = "";
      if (emailVal == "") {
        this.email += "Email cannot be null";
      }
      for (var value of this.users) {
        if (emailVal === value.email) {
          this.email =
            "Email already registered!!! Please login or use another email!";
        }
      }
    } else if (choice == "firstname") {
      this.firstname = "";
      if (fName == "") {
        this.firstname += "Firstname cannot be null";
      }
    } else if (choice == "lastname") {
      this.lastname = "";
      if (lName == "") {
        this.firstname += "Lastname cannot be null";
      }
    } else if (choice == "register") {
      if (
        userName == "" ||
        emailVal == "" ||
        fName == "" ||
        lName == "" ||
        pass == ""
      ) {
        this.username = "Username cannot be null";
      } else {
        this.addUser(userName, pass, fName, lName, emailVal);
        this.validate = true;
        this.router.navigate(["/"]);
      }
    }
  }
  addUser(
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ): void {
    console.log("addUser");
    username = username.trim();
    var profilepic = "https://image.flaticon.com/icons/svg/1246/1246351.svg";
    var stories = [];
    var suggestions = [];
    var posts = [];
    if (!username) {
      return;
    }
    this.usersService
      .addUser({
        username,
        password,
        firstname,
        lastname,
        email,
        profilepic,
        posts,
        stories,
        suggestions
      })
      .subscribe(user => {
        this.users.push(user);
      });
  }
}
