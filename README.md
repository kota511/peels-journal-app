# Peels

## Team Members
The members of the team *Banana Byte* are:
- Ahmet Kucuk
- Bivas Aryal
- Hassan Mahmood
- Imran Mehdiyev
- Kota Amemiya
- Medant Sharan
- Yasith Medagama Disanayakage
- Yifei Shi
- Yunus Sufian


## Project Overview
Peels is a digital journaling web application designed to enhance users' journaling experience by offering digital convenience and creative freedom. The application supports users in maintaining a daily journaling habit by providing predefined templates, mood tracking, multimedia support, export functionalities, and reminder settings. It also incorporates a gamification aspect to encourage consistent journaling practices.


## Deployed Version
The deployed version of Peels has been redacted.


## Installation Instructions
To set up Peels for local development, follow these steps:


### Clone the Repository
```shell
$ git clone https://github.com/kota511/peels-journal-app.git
```


### Install Dependencies
Navigate into the ***api*** directory and install its dependencies:
```shell
$ cd peels-journal-app/api
$ npm install
```


Then, navigate into the ***ui*** directory and repeat the installation process:

```shell
$ cd ../ui
$ npm install
```


## Running the Application
Open two terminals. In one, navigate to the ***api*** directory and start the server:

```shell
$ cd api
$ npm start
```

In the second terminal, navigate to the ***ui*** directory and start the client:
```shell
$ cd ui
$ npm start
```

The application should now be running on your local development environment.


## Seeding the Database
To seed the database with initial data, run the following command in the ***api*** directory:

```shell
$ npm run seed
```


## Running Tests
To run tests, execute the following command in either the ***api*** or ***ui*** directory:

```shell
$ npm run test
```


## Running Coverage
To generate a coverage report, use the following command in the ***api*** directory:

```shell
$ npm run test -- --coverage
```

## Running Coverage
To generate a coverage report, use the following command in the ***ui*** directory:

```shell
$ npm test -- --coverage --watchAll
```

## Technology Stack
ReactJS, Express, JEST testing framework

## Disclaimers
This repository was cloned from a private repository owned by another team member.

As all confidential Firebase authentication keys have been removed, you may encounter errors when running the application locally. To resolve this, create a new Firebase database, update the configuration file, and replace the necessary import statements. A working deployed version is available upon request.