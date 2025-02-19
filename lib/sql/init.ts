/* eslint-disable no-console */
import chalk from "chalk";
import "dotenv/config";
import { db } from ".";

void initDatabase();

async function initDatabase(): Promise<void> {
  try {
    console.log(chalk.blue("Initializing database schema..."));

    // Create "skills" table first
    console.log(chalk.blue("Creating table: skills"));
    await db.schema
      .createTable("skills")
      .ifNotExists()
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("icon_url", "text")
      .execute();
    console.log(chalk.green("Table 'skills' created."));

    // Create "socials" table
    console.log(chalk.blue("Creating table: socials"));
    await db.schema
      .createTable("socials")
      .ifNotExists()
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("name", "text", (col) => col.notNull())
      .addColumn("url", "text", (col) => col.notNull())
      .execute();
    console.log(chalk.green("Table 'socials' created."));

    // Create "projects" table
    console.log(chalk.blue("Creating table: projects"));
    await db.schema
      .createTable("projects")
      .ifNotExists()
      // Using uuid type with default value; adjust generator per your PostgreSQL setup
      .addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(db.fn("gen_random_uuid"))
      )
      .addColumn("title", "text", (col) => col.notNull())
      .addColumn("description", "text", (col) => col.notNull())
      .addColumn("tools", "jsonb", (col) => col.notNull())
      .addColumn("year", "integer", (col) => col.notNull())
      .addColumn("media", "jsonb")
      .addColumn("live_url", "text")
      .addColumn("github_url", "text")
      .addColumn("company", "text")
      .addColumn("slug", "text", (col) => col.notNull())
      .addColumn("featured", "boolean", (col) => col.notNull().defaultTo(false))
      .execute();
    console.log(chalk.green("Table 'projects' created."));

    // Create "images" table (dependent on projects.id)
    console.log(chalk.blue("Creating table: images"));
    await db.schema
      .createTable("images")
      .ifNotExists()
      .addColumn("id", "serial", (col) => col.primaryKey())
      .addColumn("project_id", "uuid", (col) =>
        col.references("projects.id").notNull()
      )
      .addColumn("url", "text", (col) => col.notNull())
      .execute();
    console.log(chalk.green("Table 'images' created."));

    console.log(
      chalk.green.bold("Database initialization completed successfully.")
    );

    await db.destroy();
  } catch (error) {
    console.error(chalk.red("Error during database initialization:"), error);
    throw error;
  }
}
