import { NextResponse, NextRequest } from "next/server";
import mysql from "mysql2/promise";

const connectionParams = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "csd",
};

export const GET = async (req: Request, { params }: { params: { value: string } }) => {

  const { value } = params;

  console.log({ value });

  try {
    // 2. connect to database

    const connection = await mysql.createConnection(connectionParams);

    // 3. create a query to fetch data

    let get_exp_query = "";

    get_exp_query = `SELECT 
    kds.kd_id,
    kds.name AS kd_name,
    kd_cores.kd_core_id,
    kd_cores.name AS kd_core_name,
    kd_cores.info1 AS kd_core_info1,
    kd_cores.info2 AS kd_core_info2,
    kd_skills.kd_skill_id,
    kd_skills.description AS skill_description,
    kd_wps.kd_wp_id,
    kd_wps.name AS wp_name,
    kd_wps.info1 AS wp_info1,
    kd_wps.info2 AS wp_info2,
    kd_wps.info3 AS wp_info3
FROM 
    kds
JOIN 
    kd_core ON kds.kd_id = kd_core.kd_id
JOIN 
    kd_cores ON kd_core.kd_core_id = kd_cores.kd_core_id
LEFT JOIN 
    kd_core_skills ON kd_cores.kd_core_id = kd_core_skills.kd_core_id
LEFT JOIN 
    kd_skills ON kd_core_skills.kd_skill_id = kd_skills.kd_skill_id
LEFT JOIN 
    kd_core_wps ON kd_cores.kd_core_id = kd_core_wps.kd_core_id
LEFT JOIN 
    kd_wps ON kd_core_wps.kd_wp_id = kd_wps.kd_wp_id
WHERE 
    kds.kd_id = ?;  -- Replace with the desired kd_id`;

    // we can use this array to pass parameters to the SQL query

    const values: any[] = [value];

    // 4. exec the query and retrieve the results

    const [results]:any = await connection.execute(get_exp_query, values);

    // 5. close the connection when done

    connection.end();

    // return the results as a JSON API response

    const resultsArray = processQueryResults(results);

    return NextResponse.json(resultsArray);
  } catch (err) {
    console.log("ERROR: API - ", (err as Error).message);

    const response = {
      error: (err as Error).message,

      returnedStatus: 200,
    };

    return NextResponse.json(response, { status: 200 });
  }
}

function processQueryResults(results: any[]) {
  const kdMap = new Map();

  results.forEach(result => {
    if (!kdMap.has(result.kd_id)) {
      kdMap.set(result.kd_id, {
        kd_id: result.kd_id,
        kd_name: result.kd_name,
        kd_cores: []
      });
    }

    const kd = kdMap.get(result.kd_id);

    let kd_core = kd.kd_cores.find((core: { kd_core_id: any; }) => core.kd_core_id === result.kd_core_id);
    if (!kd_core) {
      kd_core = {
        kd_core_id: result.kd_core_id,
        kd_core_name: result.kd_core_name,
        kd_core_info1: result.kd_core_info1,
        kd_core_info2: result.kd_core_info2,
        kd_skills: [],
        kd_wps: []
      };
      kd.kd_cores.push(kd_core);
    }

    // Remove redundant skills
    if (result.kd_skill_id) {
      const skillExists = kd_core.kd_skills.some((skill: { kd_skill_id: any; }) => skill.kd_skill_id === result.kd_skill_id);
      if (!skillExists) {
        kd_core.kd_skills.push({
          kd_skill_id: result.kd_skill_id,
          skill_description: result.skill_description
        });
      }
    }

    // Remove redundant work packages
    if (result.kd_wp_id) {
      const wpExists = kd_core.kd_wps.some((wp: { kd_wp_id: any; }) => wp.kd_wp_id === result.kd_wp_id);
      if (!wpExists) {
        kd_core.kd_wps.push({
          kd_wp_id: result.kd_wp_id,
          wp_name: result.wp_name,
          wp_info1: result.wp_info1,
          wp_info2: result.wp_info2,
          wp_info3: result.wp_info3
        });
      }
    }

  });

  return Array.from(kdMap.values());
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
