-descargar postgres:15

    docker pull postgres:15

-levantar postgres:15

    docker run --name echome-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=echome_db -p 5432:5432 -d postgres:15

-cargar la base de datos

    node src/migrations/init_db.js

-iniciar el backend

    npm run dev

-iniciar el frontend

    npm run dev


//para visualizar la base de datos se utiliza dbeaver

para incluir volumes 