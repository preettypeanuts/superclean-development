# Frontend Portal Workspace

This repository contains a Progressive Web Application (PWA) built using **Nx**, **Next.js**, **Tailwind CSS**, and **Shadcn UI**.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Features](#features)
- [Setup](#setup)
- [Folder Structure](#folder-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Project Overview

This project is a modern web application that utilizes **Nx** for managing a monorepo, **Next.js** for building scalable and efficient React applications, **Tailwind CSS** for utility-first styling, and **Shadcn UI** for accessible and customizable UI components. The app is designed as a **Progressive Web App (PWA)**, with all the features and optimizations for mobile-first usage.

## Technologies

- **Nx**: Monorepo tool that provides a set of extensible tools for building scalable web applications.
- **Next.js**: React framework for server-side rendering, static site generation, and optimized performance.
- **Tailwind CSS**: Utility-first CSS framework to create custom designs without writing CSS.
- **Shadcn UI**: A UI kit with prebuilt components and hooks for building consistent, accessible designs.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Apollo Client**: Used for fetching data from GraphQL APIs in the application.

## Features

- **PWA Support**: Full PWA setup, with caching and offline capabilities.
- **Multi-Zone Architecture**: The project uses multi-zone architecture with Nx for better code organization and scalability.
- **Authentication**: Built-in user authentication using GraphQL for session management.
- **State Management**: Centralized state management using React context and hooks.
- **Responsive UI**: Fully responsive design with Tailwind CSS and Shadcn UI components.
- **Routing**: Dynamic routing with Next.js and Nx workspace structure.
- **Push Notifications**: Notifications are integrated for real-time updates.

## Setup

To get started with the application, follow these steps:

### 1. Clone the repository

```bash
git clone https://git.enigmacamp.com/enigma-camp-apps/humanika/superclean-workspace.git
cd superclean-workspace
```

### 2. Install dependencies

Make sure you have Node.js installed. Then, install the project dependencies:

```bash
npm install
```

### 3. Run the development server

Start the development server:

```bash
npx nx s mitra-app --port 3000
```
The application will be available at **http://localhost:3000**.

### 4. Add new application

If you want to add new application or zone. You just run command below:

```bash
npx nx g @nx/next:application mitra-app --directory apps
```

Then clean project by deleting folder **/api** and **global.css**. And then, update file **layout.tsx** :
```bash
...
import '@superclean-workspace/shared/styles';
...
```
And update **project.json** on target build option, add this configuration
```bash
...
   "postcssConfig": "postcss.config.js"
...
```
Update **/apps/mitra-app/next.config.js** with adding this configuration :

```bash
  {
    source: '/dashboard/:path*',
    destination: `http://localhost:3002/:path*`
  }
```

### 5. Add new page for application
If you want generate new page for application, you can also run this command:

```bash
nx g @nx/next:page page-name
```

And then follow the instruction as below :
```bash
√ What is the name of the project for this component? · mitra-app
```

## Folder Structure

Here is a high-level overview of the folder structure:

```bash
/apps
  /mitra-app                 # Mitra Next.js app
  /admin-app                 # Admin Next.js app
/libs
  /ui-components            # Shared UI components
  /shared                   # Shared Apollo Client, Styles, etc.
```

## Development
### Running

You can run the unit and integration tests using:

```bash
npm run run:all
```

or

```bash
npx nx s admin-app --port 3000
npx nx s mitra-app --port 3001
```

### Building the Application

To build the production-ready application:

```bash
npm run build:all
```

### Linting & Formatting

Ensure that your code is properly linted and formatted:

```bash
npm run lint
npm run format
```

## Deployment

To deploy the application, you'll need to build the app for production:

```bash
npm run build:all
```

Then, you can deploy the build folder to your preferred hosting service, such as Vercel, Netlify, or others.

## Contributing

If you'd like to contribute to the project:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes and commit them
4. Push to your fork and create a pull request

Please ensure that your code follows the project's linting and formatting rules.