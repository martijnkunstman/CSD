import { NextResponse, NextRequest } from "next/server";
import mysql from "mysql2/promise";

const connectionParams = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "csd",
};

export const GET = async (request: Request) => {
  try {
    // 2. connect to database

    const connection = await mysql.createConnection(connectionParams);

    // 3. create a query to fetch data

    let get_exp_query = "";

    get_exp_query = "SELECT * FROM kds";

    // we can use this array to pass parameters to the SQL query

    const values: any[] = [];

    // 4. exec the query and retrieve the results

    const [results] = await connection.execute(get_exp_query, values);

    // 5. close the connection when done

    connection.end();

    // return the results as a JSON API response

    return NextResponse.json(results);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  console.log({ body });

  // Do something

  return NextResponse.json(
    { message: "Operation successful" },
    { status: 200 }
  );
};
