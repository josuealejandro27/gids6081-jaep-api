//proveedores de servicio en esta caso base de datos de MySql

import { createConnection } from 'mysql2/promise';

export const mysqlProvider = {
  provide: 'MYSQL_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'jaepapi',
    });
    return connection;
  },
};

/*
Creacion de base de datos de mysql workbench
*/